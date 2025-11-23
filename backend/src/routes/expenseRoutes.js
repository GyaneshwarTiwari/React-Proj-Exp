// routes/expenseRoutes.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const expenseController = require("../controllers/expenseController");

// @GET /api/v1/expenses
router.get("/", authMiddleware, expenseController.getExpenses);

// @POST /api/v1/expenses
router.post("/", authMiddleware, expenseController.addExpense);

// @POST /api/v1/expenses/import
router.post("/import", authMiddleware, expenseController.importExpenses);

router.put("/:id", authMiddleware, expenseController.updateExpense);
router.delete("/:id", authMiddleware, expenseController.deleteExpense);

module.exports = router;
