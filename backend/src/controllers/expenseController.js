// server/controllers/expenseController.js
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');
const bankImportService = require('../services/bankImportService');
const categorizationService = require('../services/categorizationService');


/**
 * GET /expenses
 * Fetch all expenses for logged-in user (with optional filters)
 */
exports.getExpenses = async (req, res, next) => {
    try {
        const userId = req.user._id;


        const { category, from, to, startDate, endDate } = req.query;

        const filter = { user: userId, transactionType: "expense" };

        // optional filters
        if (category) filter.category = category;

        // Support both from/to and startDate/endDate
        let dateFilter = {};
        if (from) dateFilter.$gte = new Date(from);
        if (to) dateFilter.$lte = new Date(to);
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);
        if (Object.keys(dateFilter).length > 0) filter.date = dateFilter;

        const expenses = await Expense.find(filter).sort({ date: -1 });

        return res.json({ expenses });
    } catch (err) {
        next(err);
    }
};

/**
 * Helper: check budget after an expense and create throttle-safe notification
 */
async function checkBudgetAfterExpense(userId, category, expenseDate) {
    // get budget
    const budget = await Budget.findOne({ user: userId, category });
    if (!budget) return null;

    // month window
    const d = expenseDate ? new Date(expenseDate) : new Date();
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

    // aggregate sum
    const agg = await Expense.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId), //user: mongoose.Types.ObjectId(userId), this was giving error
                category,
                transactionType: 'expense',
                date: { $gte: startOfMonth, $lte: endOfMonth }
            }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const spent = (agg[0] && agg[0].total) || 0;

    if (spent > budget.budget_amount) {
        // throttle: only one budget_exceeded per category per day
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const existing = await Notification.findOne({
            user: userId,
            type: 'budget_exceeded',
            'metadata.category': category,
            createdAt: { $gte: oneDayAgo }
        });
        if (existing) return { exceeded: true, spent, budget: budget.budget_amount, notified: false };

        const title = `Budget exceeded for ${category}`;
        const message = `You've spent ₹${spent} of ₹${budget.budget_amount} in ${category} this month.`;

        // Create and deliver notification (email if user prefs allow)
        const user = await (require('../models/User')).findById(userId).select('notificationPreferences');
        const sendEmail = user && user.notificationPreferences && user.notificationPreferences.notifyByEmail;

        await notificationService.createAndDeliver(userId, {
            type: 'budget_exceeded',
            title,
            message,
            metadata: { category, spent, budget: budget.budget_amount },
            sendEmail
        });

        return { exceeded: true, spent, budget: budget.budget_amount, notified: true };
    }

    return { exceeded: false, spent, budget: budget.budget_amount, notified: false };
}

/**
 * POST /expenses
 * create expense (manual) or contribution
 */
exports.addExpense = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { amount, date, description, category, source = 'manual', transactionType = 'expense', goal: goalId } = req.body;

        if (!amount || !date || !category) {
            return res.status(400).json({ error: 'amount, date and category are required' });
        }

        // If contribution to a goal -> perform atomic update
        // Contribution to a goal (NO TRANSACTIONS)
        if (transactionType === "contribution" && goalId) {

            // Validate goal
            const goal = await Goal.findOne({ _id: goalId, user: userId, status: "active" });
            if (!goal) {
                return res.status(400).json({ error: "Goal not found or not active" });
            }

            // Create contribution expense
            const expenseDoc = await Expense.create({
                user: userId,
                amount,
                date,
                description,
                category,
                source,
                transactionType,
                goal: goalId
            });

            // Update goal
            const prevPercent = goal.progress_percent || 0;
            goal.current_amount += amount;
            const progress = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
            goal.progress_percent = progress;
            if (progress >= 100) goal.status = "achieved";

            await goal.save();

            // Notify user about milestone
            const thresholds = goal.notifications?.thresholds || [50, 75, 100];
            for (const t of thresholds) {
                if (prevPercent < t && progress >= t) {
                    await notificationService.createAndDeliver(userId, {
                        type: t === 100 ? "goal_achieved" : "goal_milestone",
                        title: `Goal reached ${t}%: ${goal.title}`,
                        message: `You have reached ${progress}% progress for your goal "${goal.title}".`,
                        metadata: { goalId },
                        sendEmail: goal.notifications?.notifyByEmail
                    });
                }
            }

            return res.status(201).json({
                message: "Contribution added and goal updated",
                expense: expenseDoc,
                goal
            });
        }

        // else: normal expense or income
        try {
            const expense = await Expense.create({
                user: userId,
                amount,
                date,
                description,
                category,
                source,
                transactionType,
                goal: null
            });

            // Check budget if it's an expense
            let budgetCheck = null;
            if (transactionType === 'expense') {
                try {
                    budgetCheck = await checkBudgetAfterExpense(userId, category, new Date(date));
                } catch (e) {
                    // do not fail the request if budget check errors; log and continue
                    console.error('Budget check error:', e);
                }
            }

            return res.status(201).json({ message: 'Expense added successfully', expense, budgetCheck });
        } catch (err) {
            // duplicate externalId for imports results in code 11000
            if (err.code === 11000) {
                return res.status(409).json({ message: 'Duplicate expense (externalId exists), skipped' });
            }
            return next(err);
        }
    } catch (err) {
        next(err);
    }
};

/**
 * POST /expenses/import
 * imports transactions from bank (mocked) and creates expenses idempotently
 */
exports.importExpenses = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { bank_account_id } = req.body;
        if (!bank_account_id) return res.status(400).json({ error: 'bank_account_id is required' });

        const txns = await bankImportService.importFromBank(bank_account_id, userId);
        const results = { created: 0, skipped: 0, errors: 0 };

        for (const txn of txns) {
            try {
                // Categorize if missing
                const category = txn.category || categorizationService.categorize(txn.description, 'Uncategorized');

                // Create expense, idempotency via externalId unique index
                await Expense.create({
                    user: userId,
                    amount: txn.amount,
                    date: txn.date,
                    description: txn.description,
                    category,
                    source: 'imported',
                    transactionType: 'expense',
                    externalId: txn.externalId
                });

                // After creating, check budget
                await checkBudgetAfterExpense(userId, category, new Date(txn.date));

                results.created += 1;
            } catch (err) {
                if (err.code === 11000) {
                    // duplicate externalId — skip
                    results.skipped += 1;
                    continue;
                }
                console.error('Import txn error:', err);
                results.errors += 1;
            }
        }

        return res.status(200).json({ message: 'Expenses import processed', results });
    } catch (err) {
        next(err);
    }
};

exports.updateExpense = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const expenseId = req.params.id;

        const updated = await Expense.findOneAndUpdate(
            { _id: expenseId, user: userId },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.json({ message: "Expense updated", expense: updated });
    } catch (err) {
        next(err);
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const deleted = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: userId
        });

        if (!deleted) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.json({ message: "Expense deleted" });
    } catch (err) {
        next(err);
    }
};