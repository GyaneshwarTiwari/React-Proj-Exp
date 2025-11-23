// server/controllers/goalsController.js
const Goal = require('../models/Goal');
const Expense = require('../models/Expense');
const notificationService = require('../services/notificationService');

exports.createGoal = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { title, target_amount, start_date, end_date, notifications = {} } = req.body;

        if (!title || target_amount == null) {
            return res.status(400).json({ error: "title and target_amount are required" });
        }

        const goal = await Goal.create({
            user: userId,
            title,
            target_amount,
            start_date: start_date || new Date(),
            end_date,
            notifications
        });

        return res.status(201).json({ message: "Financial goal set successfully", goal });
    } catch (err) {
        next(err);
    }
};


// NO TRANSACTIONS – SAFE FOR LOCAL MONGODB
exports.contributeToGoal = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const goalId = req.params.id;
        const { amount, date = new Date(), description = "" } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "amount is required" });
        }

        // 1. Validate goal
        const goal = await Goal.findOne({ _id: goalId, user: userId, status: "active" });
        if (!goal) {
            return res.status(404).json({ error: "Goal not found or not active" });
        }

        // 2. Create expense
        const expense = await Expense.create({
            user: userId,
            amount,
            date,
            description,
            category: "Contribution",
            source: "manual",
            transactionType: "contribution",
            goal: goalId
        });

        // 3. Update goal values
        const prevPercent = goal.progress_percent || 0;

        goal.current_amount += amount;
        const progress = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
        goal.progress_percent = progress;

        if (progress >= 100) goal.status = "achieved";

        await goal.save();

        // 4. Milestone notifications
        const thresholds = (goal.notifications?.thresholds) || [50, 75, 100];

        for (const t of thresholds) {
            if (prevPercent < t && progress >= t) {
                await notificationService.createAndDeliver(userId, {
                    type: t === 100 ? "goal_achieved" : "goal_milestone",
                    title: t === 100 ? `Goal Achieved: ${goal.title}` : `Goal reached ${t}%`,
                    message: `Goal "${goal.title}" is now at ${progress}% progress.`,
                    metadata: { goalId, progress, amountAdded: amount },
                    sendEmail: goal.notifications?.notifyByEmail
                });
            }
        }

        return res.status(201).json({
            message: "Contribution added and goal updated",
            expense,
            goal
        });
    } catch (err) {
        next(err);
    }
};

exports.updateGoal = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const goalId = req.params.id;

        // Find the goal
        const goal = await Goal.findOne({ _id: goalId, user: userId });
        if (!goal) return res.status(404).json({ error: "Goal not found" });

        // Update fields
        if (req.body.title !== undefined) goal.title = req.body.title;
        if (req.body.target_amount !== undefined)
            goal.target_amount = req.body.target_amount;

        // ⭐ Recalculate progress percent
        goal.progress_percent = Math.round(
            (goal.current_amount / goal.target_amount) * 100
        );

        // ⭐ Update status
        if (goal.progress_percent >= 100) {
            goal.status = "achieved";
        } else {
            goal.status = "active";
        }

        await goal.save();

        res.json({
            message: "Goal updated",
            goal,
        });
    } catch (err) {
        next(err);
    }
};


exports.deleteGoal = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const deleted = await Goal.findOneAndDelete({
            _id: req.params.id,
            user: userId
        });

        if (!deleted) {
            return res.status(404).json({ error: "Goal not found" });
        }

        res.json({ message: "Goal deleted" });
    } catch (err) {
        next(err);
    }
};

exports.getGoals = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });

        res.json({ goals });
    } catch (err) {
        next(err);
    }
};

// GET /goals/:id/contributions
exports.getContributions = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const goalId = req.params.id;

        const contributions = await Expense.find({
            user: userId,
            goal: goalId,
            transactionType: 'contribution'
        }).sort({ date: -1 }).lean();

        res.json({ contributions });
    } catch (err) {
        next(err);
    }
};

// DELETE /goals/:goalId/contribution/:expenseId
exports.deleteContribution = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { goalId, expenseId } = req.params;

        // Step 1: find contribution expense
        const expense = await Expense.findOne({
            _id: expenseId,
            user: userId,
            goal: goalId,
            transactionType: "contribution"
        });

        if (!expense) {
            return res.status(404).json({ error: "Contribution not found" });
        }

        const amount = expense.amount;

        // Step 2: delete the expense
        await expense.deleteOne();

        // Step 3: update goal values
        const goal = await Goal.findOne({ _id: goalId, user: userId });

        if (!goal) {
            return res.status(404).json({ error: "Goal not found" });
        }

        // Reverse the added amount
        goal.current_amount = Math.max(0, goal.current_amount - amount);

        const progress =
            Math.round((goal.current_amount / goal.target_amount) * 100);

        goal.progress_percent = progress;

        if (progress < 100) {
            goal.status = "active";
        }

        await goal.save();

        res.json({
            message: "Contribution deleted & goal updated",
            goal,
        });
    } catch (err) {
        next(err);
    }
};

