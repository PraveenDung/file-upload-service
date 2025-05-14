const rateLimit = require("express-rate-limit");

// Key generator based on user ID (from JWT)
const uploadRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Max 5 uploads per window per user
  message: "Too many uploads from this user. Please try again later.",
  keyGenerator: (req, res) => {
    return req.user?.id || req.ip; // fallback to IP if no user
  },
});

module.exports = uploadRateLimiter;
