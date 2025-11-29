const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const mongoose = require("mongoose");
const notificationService = require("../services/notificationService"); // Import notification service

exports.addContribution = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { goalId } = req.params;
        const { amount, date, description } = req.body;

        const goal = await Goal.findOne({ _id: goalId, user: userId });
        if (!goal) return res.status(404).json({ error: "Goal not found" });

        // 1. Calculate Old Percentage
        const oldPercent = Math.round((goal.current_amount / goal.target_amount) * 100);

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { merchant = '' } = req.body || {};
            const contribution = await Expense.create(
                [
                    {
                        user: userId,
                        amount,
                        date,
                        description,
                        merchant,
                        category: "Savings",
                        transactionType: "contribution",
                        goal: goalId,
                    }
                ],
                { session }
            );

            // 2. Update Goal & Calculate New Percentage
            goal.current_amount += Number(amount);
            const newPercent = Math.round(
                (goal.current_amount / goal.target_amount) * 100
            );

            goal.progress_percent = newPercent;
            if (goal.progress_percent >= 100) goal.status = "achieved";

            await goal.save({ session });

            // 3. Check Milestones (50, 75, 100)
            // We check the highest milestone crossed to avoid spamming multiple alerts at once
            const milestones = [100, 75, 50];
            const crossedMilestone = milestones.find(m => oldPercent < m && newPercent >= m);

            if (crossedMilestone) {
                let title = `Goal Milestone: ${crossedMilestone}% Reached! 🚀`;
                let message = `You have reached ${crossedMilestone}% of your goal: ${goal.title}.`;

                if (crossedMilestone === 100) {
                    title = `Goal Achieved! 🏆`;
                    message = `Congratulations! You have successfully completed your goal: ${goal.title}.`;
                }

                await notificationService.createAndDeliver(userId, {
                    type: 'goal_progress', // distinct type for frontend icons
                    title,
                    message,
                    metadata: {
                        goalId: goal._id,
                        progress: newPercent,
                        target: goal.target_amount
                    },
                    sendEmail: true // Goals are high-value updates
                });
            }

            await session.commitTransaction();
            session.endSession();

            res.status(201).json({
                message: "Contribution added",
                contribution: contribution[0],
                goal,
            });
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            next(err);
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteContribution = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { goalId, expenseId } = req.params;

        const contribution = await Expense.findOne({
            _id: expenseId,
            goal: goalId,
            transactionType: "contribution",
        });

        if (!contribution)
            return res.status(404).json({ error: "Contribution not found" });

        const goal = await Goal.findById(goalId);

        if (!goal) return res.status(404).json({ error: "Goal not found" });

        // Adjust goal
        goal.current_amount -= contribution.amount;
        goal.progress_percent = Math.round(
            (goal.current_amount / goal.target_amount) * 100
        );
        if (goal.progress_percent < 100) goal.status = "active";
        await goal.save();

        await contribution.deleteOne();

        res.json({ message: "Contribution removed", goal });
    } catch (err) {
        next(err);
    }
};