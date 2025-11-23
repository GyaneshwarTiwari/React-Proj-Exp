// routes/budgetRoutes.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const budgetController = require("../controllers/budgetController");

// @POST /api/v1/budgets
router.post("/", authMiddleware, budgetController.setBudget);

router.put("/:id", authMiddleware, budgetController.updateBudget);
router.delete("/:id", authMiddleware, budgetController.deleteBudget);
router.get("/", authMiddleware, budgetController.getBudgets);

module.exports = router;
