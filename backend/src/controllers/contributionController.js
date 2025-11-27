const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const mongoose = require("mongoose");

exports.addContribution = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { goalId } = req.params;
        const { amount, date, description } = req.body;

        const goal = await Goal.findOne({ _id: goalId, user: userId });
        if (!goal) return res.status(404).json({ error: "Goal not found" });

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

            // Update goal
            goal.current_amount += amount;
            goal.progress_percent = Math.round(
                (goal.current_amount / goal.target_amount) * 100
            );
            if (goal.progress_percent >= 100) goal.status = "achieved";
            await goal.save({ session });

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