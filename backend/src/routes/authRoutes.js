// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const { signup, login, changePassword } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// @POST /api/v1/auth/signup
router.post("/signup", signup);

// @POST /api/v1/auth/login
router.post("/login", login);

// PATCH /api/v1/auth/password (protected)
router.patch("/password", authMiddleware, changePassword);

module.exports = router;
