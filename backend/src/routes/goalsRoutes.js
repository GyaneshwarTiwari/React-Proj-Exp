// routes/goalsRoutes.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const goalsController = require("../controllers/goalsController");

// @POST /api/v1/goals
router.post("/", authMiddleware, goalsController.createGoal);

// @POST /api/v1/goals/:id/contribute
router.post("/:id/contribute", authMiddleware, goalsController.contributeToGoal);
router.put("/:id", authMiddleware, goalsController.updateGoal);
router.delete("/:id", authMiddleware, goalsController.deleteGoal);
router.get("/", authMiddleware, goalsController.getGoals);
router.delete(
    "/:goalId/contribution/:expenseId",
    authMiddleware,
    goalsController.deleteContribution
);
// fetch contributions for a goal
router.get("/:id/contributions", authMiddleware, goalsController.getContributions);

module.exports = router;
