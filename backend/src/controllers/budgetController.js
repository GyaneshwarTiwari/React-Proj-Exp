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


        // Compute monthly totals (for warning) and all-time totals (for strict limit)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // monthly totals
        const monthlyIncomeAgg = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const monthlyIncome = monthlyIncomeAgg[0]?.total || 0;

        const monthlyExpensesAgg = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), transactionType: 'expense', date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const monthlyExpenses = monthlyExpensesAgg[0]?.total || 0;

        const monthlyContribAgg = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), transactionType: 'contribution', date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const monthlyContributions = monthlyContribAgg[0]?.total || 0;

        const monthlySavings = monthlyIncome - monthlyExpenses - monthlyContributions;

        // all-time totals
        const totalIncomeAllAgg = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalIncomeAll = totalIncomeAllAgg[0]?.total || 0;

        const totalExpensesAllAgg = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), transactionType: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalExpensesAll = totalExpensesAllAgg[0]?.total || 0;

        const totalContribAllAgg = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), transactionType: 'contribution' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalContributionsAll = totalContribAllAgg[0]?.total || 0;

        const netSavingsAll = totalIncomeAll - totalExpensesAll - totalContributionsAll;

        // Sum existing budgets and compute new total after this change
        const existingBudgets = await Budget.find({ user: userId }).lean();
        const existing = existingBudgets.find((b) => String(b.category) === String(category));
        const existingSum = existingBudgets.reduce((s, b) => s + (b.budget_amount || 0), 0);
        const newBudgetAmount = Number(budget_amount);
        const newTotalBudgets = existing ? (existingSum - (existing.budget_amount || 0) + newBudgetAmount) : (existingSum + newBudgetAmount);

        // Enforce strict: total budgets must not exceed net savings (all-time)
        if (newTotalBudgets > netSavingsAll) {
            return res.status(400).json({ error: 'Total budgets cannot exceed net savings (all time).' });
        }

        // Upsert budget for user+category
        const budget = await Budget.findOneAndUpdate(
            { user: userId, category },
            { $set: { budget_amount: newBudgetAmount } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const resp = { message: 'Budget set successfully', budget };
        // If new total budgets exceed monthly savings, include a warning so frontend can notify the user
        if (newTotalBudgets > monthlySavings) {
            resp.warning = { exceedsMonthlySavings: true, message: 'Total monthly budgets exceed monthly savings.' };
        }

        return res.status(201).json(resp);
    } catch (err) {
        // handle duplicate key (shouldn't happen due to findOneAndUpdate) or pass error
        next(err);
    }
};

exports.updateBudget = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Validate similar to setBudget: ensure total budgets do not exceed netSavingsAll
        const budgetId = req.params.id;
        const { budget_amount, category } = req.body;

        const existingBudget = await Budget.findOne({ _id: budgetId, user: userId }).lean();
        if (!existingBudget) return res.status(404).json({ error: 'Budget not found' });

        // Gather totals
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyIncomeAgg = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const monthlyIncome = monthlyIncomeAgg[0]?.total || 0;

        const monthlyExpensesAgg = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), transactionType: 'expense', date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const monthlyExpenses = monthlyExpensesAgg[0]?.total || 0;

        const monthlyContribAgg = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), transactionType: 'contribution', date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const monthlyContributions = monthlyContribAgg[0]?.total || 0;

        const monthlySavings = monthlyIncome - monthlyExpenses - monthlyContributions;

        const totalIncomeAllAgg = await Income.aggregate([{ $match: { user: new mongoose.Types.ObjectId(userId) } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
        const totalIncomeAll = totalIncomeAllAgg[0]?.total || 0;
        const totalExpensesAllAgg = await Expense.aggregate([{ $match: { user: new mongoose.Types.ObjectId(userId), transactionType: 'expense' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
        const totalExpensesAll = totalExpensesAllAgg[0]?.total || 0;
        const totalContribAllAgg = await Expense.aggregate([{ $match: { user: new mongoose.Types.ObjectId(userId), transactionType: 'contribution' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
        const totalContributionsAll = totalContribAllAgg[0]?.total || 0;
        const netSavingsAll = totalIncomeAll - totalExpensesAll - totalContributionsAll;

        // compute existing budgets sum and new total
        const existingBudgets = await Budget.find({ user: userId }).lean();
        const existingSum = existingBudgets.reduce((s, b) => s + (b.budget_amount || 0), 0);
        const newBudgetAmount = Number(budget_amount ?? existingBudget.budget_amount);
        // subtract existing budget amount for this budget from sum
        const newTotalBudgets = existingSum - (existingBudget.budget_amount || 0) + newBudgetAmount;

        if (newTotalBudgets > netSavingsAll) {
            return res.status(400).json({ error: 'Total budgets cannot exceed net savings (all time).' });
        }

        const updated = await Budget.findOneAndUpdate(
            { _id: req.params.id, user: userId },
            req.body,
            { new: true }
        );

        const resp = { message: 'Budget updated', budget: updated };
        if (newTotalBudgets > monthlySavings) {
            resp.warning = { exceedsMonthlySavings: true, message: 'Total monthly budgets exceed monthly savings.' };
        }

        res.json(resp);
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
