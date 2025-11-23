const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const controller = require("../controllers/contributionController");

router.post("/:goalId/contribute", authMiddleware, controller.addContribution);
router.delete("/:goalId/contribution/:expenseId", authMiddleware, controller.deleteContribution);

module.exports = router;