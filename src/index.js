// Load environment variables from .env file
require("dotenv").config();

// Import Express framework
const express = require("express");
const app = express();

// Import custom route modules
const fileRoutes = require("./files/routes");
const authRoutes = require('./auth/routes');
const authMiddleware = require("./middleware/authMiddleware");

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data (e.g., from form submissions)
app.use(express.urlencoded({ extended: true }));

// Route for handling file uploads (protected inside /files/routes.js)
app.use("/", fileRoutes);

// Route for handling authentication (login, etc.)
app.use('/auth', authRoutes);

// Example protected route to verify JWT middleware works
app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.email}!`, user: req.user });
});

// Health check route to verify server is up
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
