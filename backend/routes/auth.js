// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const protect = require("../middleware/authMiddleware.js");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", authController.login);

// @route   GET /api/auth/profile
// @desc    Get logged-in user profile
// @access  Private
router.get("/profile", protect, authController.getProfile);

module.exports = router;