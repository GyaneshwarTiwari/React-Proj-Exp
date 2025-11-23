// server/cron/jobs.js
const cron = require("node-cron");
const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");
const notificationService = require("../services/notificationService");

// DAILY BUDGET SUMMARY - 12:01 AM
cron.schedule("1 0 * * *", async () => {
    console.log("⏳ Running daily budget summary job...");

    try {
        const users = await Budget.distinct("user");

        for (const userId of users) {
            const userBudgets = await Budget.find({ user: userId });

            for (const budget of userBudgets) {
                const today = new Date();
                const start = new Date(today.getFullYear(), today.getMonth(), 1);
                const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

                const agg = await Expense.aggregate([
                    {
                        $match: {
                            user: mongoose.Types.ObjectId(userId),
                            category: budget.category,
                            transactionType: "expense",
                            date: { $gte: start, $lte: end }
                        }
                    },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ]);

                const spent = (agg[0]?.total) || 0;

                if (spent >= budget.budget_amount * 0.8) {
                    await notificationService.createAndDeliver(String(userId), {
                        type: "budget_warning",
                        title: `You reached 80% of your ${budget.category} budget`,
                        message: `You've spent ₹${spent} of ₹${budget.budget_amount} in ${budget.category}.`,
                        metadata: { category: budget.category, spent, limit: budget.budget_amount },
                        sendEmail: true
                    });
                }
            }
        }

        console.log("✅ Budget summary completed.");
    } catch (err) {
        console.error("❌ Budget summary error:", err);
    }
});

// NIGHTLY GOAL RECONCILIATION (optional)
cron.schedule("5 0 * * *", async () => {
    console.log("⏳ Running goal reconciliation job...");
    try {
        const goals = await Goal.find({ status: "active" });
        for (const goal of goals) {
            // Optional to re-calc if you ever infer contributions
            goal.progress_percent = Math.min(
                100,
                Math.round((goal.current_amount / goal.target_amount) * 100)
            );
            if (goal.progress_percent >= 100) {
                goal.status = "achieved";
            }
            await goal.save();
        }
        console.log("✅ Goal reconciliation done");
    } catch (err) {
        console.error("❌ Goal reconciliation error:", err);
    }
});
