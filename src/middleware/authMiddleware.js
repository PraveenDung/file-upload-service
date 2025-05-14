const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid user" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
