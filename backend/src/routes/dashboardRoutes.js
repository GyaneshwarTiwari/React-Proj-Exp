// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const { getDashboardOverview } = require("../controllers/dashboardController");

// @GET /api/v1/dashboard
router.get("/", authMiddleware, getDashboardOverview);

module.exports = router;
