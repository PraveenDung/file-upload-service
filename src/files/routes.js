const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("./uploadMiddleware");
const uploadRateLimiter = require("../middleware/rateLimit");
const fileQueue = require("../jobs/queue");

router.post("/upload", authMiddleware,uploadRateLimiter, (req, res, next) => {
  upload.single("file")(req, res, function (err) {
    if (err && err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "File too large. Max limit is 5MB." });
    } else if (err) {
      return res.status(400).json({ message: "File upload error", error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Save to DB
    const newFile = await prisma.file.create({
      data: {
        userId: req.user.id,
        originalName: file.originalname,
        storagePath: file.path,
        title,
        description,
      },
    });

    // Enqueue background job
    await fileQueue.add("processFile", {
      fileId: newFile.id,
      path: file.path,
    });

    res.status(201).json({ fileId: newFile.id, status: "uploaded" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/files/:id", authMiddleware, async (req, res) => {
  const fileId = parseInt(req.params.id);

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check ownership
    if (file.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(file);
  } catch (err) {
    console.error("GET /files/:id error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
