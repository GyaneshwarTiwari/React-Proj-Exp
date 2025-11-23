// server/controllers/budgetController.js
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const mongoose = require('mongoose');

exports.setBudget = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { category, budget_amount } = req.body;
        if (!category || budget_amount == null) {
            return res.status(400).json({ error: 'category and budget_amount are required' });
        }

        // Allow user to set total budgets up to current month's income.
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalIncomeAgg = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalIncome = totalIncomeAgg[0]?.total || 0;

        // Sum existing budgets and compute new total after this change
        const existingBudgets = await Budget.find({ user: userId }).lean();
        const existing = existingBudgets.find((b) => String(b.category) === String(category));
        const existingSum = existingBudgets.reduce((s, b) => s + (b.budget_amount || 0), 0);
        const newBudgetAmount = Number(budget_amount);
        const newTotalBudgets = existing ? (existingSum - (existing.budget_amount || 0) + newBudgetAmount) : (existingSum + newBudgetAmount);

        // Enforce: total monthly budgets must not exceed total monthly income
        if (newTotalBudgets > totalIncome) {
            return res.status(400).json({ error: 'Total monthly budgets cannot exceed total income for this month.' });
        }

        // Upsert budget for user+category
        const budget = await Budget.findOneAndUpdate(
            { user: userId, category },
            { $set: { budget_amount: newBudgetAmount } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(201).json({ message: 'Budget set successfully', budget });
    } catch (err) {
        // handle duplicate key (shouldn't happen due to findOneAndUpdate) or pass error
        next(err);
    }
};

exports.updateBudget = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const updated = await Budget.findOneAndUpdate(
            { _id: req.params.id, user: userId },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Budget not found" });
        }

        res.json({ message: "Budget updated", budget: updated });
    } catch (err) {
        next(err);
    }
};

exports.deleteBudget = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const deleted = await Budget.findOneAndDelete({
            _id: req.params.id,
            user: userId
        });

        if (!deleted) {
            return res.status(404).json({ error: "Budget not found" });
        }

        res.json({ message: "Budget deleted" });
    } catch (err) {
        next(err);
    }
};

exports.getBudgets = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const budgets = await Budget.find({ user: userId }).sort({ createdAt: -1 }).lean();

        // compute spent for current month per budget category
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const results = [];
        for (const b of budgets) {
            const spentAgg = await Expense.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId),
                        category: b.category,
                        transactionType: 'expense',
                        date: { $gte: startOfMonth }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            const spent = spentAgg[0]?.total || 0;
            results.push({
                ...b,
                spent,
                percent: b.budget_amount ? Math.round((spent / b.budget_amount) * 100) : 0
            });
        }

        res.json({ budgets: results });
    } catch (err) {
        next(err);
    }
};
