const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const controller = require("../controllers/incomeController");

router.post("/", authMiddleware, controller.addIncome);
router.get("/", authMiddleware, controller.getIncome);
router.put("/:id", authMiddleware, controller.updateIncome);
router.delete("/:id", authMiddleware, controller.deleteIncome);

module.exports = router;
