require("dotenv").config();
const express = require("express");
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./auth/routes');
app.use('/auth', authRoutes);

const authMiddleware = require("./middleware/authMiddleware");

// Example protected route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.email}!`, user: req.user });
});


// Health route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
