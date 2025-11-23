// routes/exportRoutes.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const { exportExpenses } = require("../controllers/exportController");

// @GET /api/v1/export
router.get("/", authMiddleware, exportExpenses);

module.exports = router;
