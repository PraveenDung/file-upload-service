const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("./uploadMiddleware");
const fileQueue = require("../jobs/queue");

router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
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

module.exports = router;
