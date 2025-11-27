const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");
const mongoose = require("mongoose");

/**
 * GET /api/v1/dashboard
 * returns summary, expensesByCategory, monthlyTrend, contributionTrend,
 * contributionsByGoal, budgetUsage, goals, recentTransactions, recentContributions
 */
exports.getDashboardOverview = async (req, res, next) => {
    try {
        const userId = req.user._id;
        // Support optional selected month/year via query params. If not provided, default to current month
        const { month: qMonth, year: qYear } = req.query || {};
        let refDate;
        if (qMonth && qYear) {
            const mm = Number(qMonth) - 1; // expected 1-12 from client
            const yy = Number(qYear);
            if (!Number.isNaN(mm) && !Number.isNaN(yy)) {
                refDate = new Date(yy, mm, 1);
            }
        }
        if (!refDate) refDate = new Date();

        const now = refDate;
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        // last 6 months inclusive: current month and 5 previous

        // ---------- 1) Totals this month ----------
        const totalExpensesAgg = await Expense.aggregate([
            {
                $match: Object.assign({
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }, { transactionType: 'expense' })
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalExpenses = totalExpensesAgg[0]?.total || 0;

        const totalIncomeAgg = await Income.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalIncome = totalIncomeAgg[0]?.total || 0;

        const totalContribAgg = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    transactionType: "contribution",
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalContributions = totalContribAgg[0]?.total || 0;

        // ---------- All-time totals for net savings ----------
        const totalExpensesAllAgg = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), transactionType: 'expense' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalExpensesAll = totalExpensesAllAgg[0]?.total || 0;

        const totalIncomeAllAgg = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalIncomeAll = totalIncomeAllAgg[0]?.total || 0;

        const totalContribAllAgg = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), transactionType: 'contribution' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalContributionsAll = totalContribAllAgg[0]?.total || 0;

        // Use all-time totals for net savings display
        // All-time net savings (subtract contributions as well)
        const netSavings = totalIncomeAll - totalExpensesAll - totalContributionsAll;
        const netSavingsAfterGoals = netSavings; // kept for backward compatibility

        // Monthly savings (for the selected/current month) - subtract contributions as well
        const monthlySavings = totalIncome - totalExpenses - totalContributions;

        // ---------- 2) Expenses By Category (this month) ----------
        const expensesByCategory = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    transactionType: "expense",
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: "$category", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } }
        ]);

        // ---------- 2b) Expenses By Merchant (this month) ----------
        const expensesByMerchant = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    transactionType: "expense",
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: "$merchant", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } }
        ]);

        // ---------- 3) Monthly trend for expenses, income, contributions (last 6 months) ----------
        // We'll return arrays keyed by year/month for the last 6 months (chronological)
        const expenseMonthlyAgg = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: sixMonthsAgo, $lte: endOfMonth }
                }
            },
            {
                $project: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                    amount: "$amount",
                    type: "$transactionType"
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month", type: "$type" },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const incomeMonthlyAgg = await Income.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: sixMonthsAgo, $lte: endOfMonth }
                }
            },
            {
                $project: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                    amount: "$amount"
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Build structured trend arrays with 6 elements
        const months = []; // labels in "M/YYYY"
        const expenseTrend = [];
        const incomeTrend = [];
        const contributionTrend = [];

        // create a list of the last 6 month start dates in chronological order
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`; // "YYYY-M"
            months.push({ key, label: `${d.getMonth() + 1}/${d.getFullYear()}` });
        }

        // helper map from agg
        const expenseMap = {};
        for (const item of expenseMonthlyAgg) {
            const k = `${item._id.year}-${item._id.month}`;
            expenseMap[k] = expenseMap[k] || {};
            expenseMap[k][item._id.type] = item.total;
        }

        const incomeMap = {};
        for (const item of incomeMonthlyAgg) {
            const k = `${item._id.year}-${item._id.month}`;
            incomeMap[k] = item.total;
        }

        for (const m of months) {
            const vals = expenseMap[m.key] || {};
            expenseTrend.push(vals.expense || 0);
            contributionTrend.push(vals.contribution || 0);
            incomeTrend.push(incomeMap[m.key] || 0);
        }

        // ---------- 4) Contributions by goal ----------
        const contributionsByGoalAgg = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    transactionType: "contribution"
                }
            },
            {
                $group: {
                    _id: "$goal",
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { total: -1 } }
        ]);

        // Join goal meta (title) for meaningful labels
        const contributionsByGoal = [];
        for (const row of contributionsByGoalAgg) {
            const goalId = row._id;
            let title = "Unknown";
            if (goalId) {
                const g = await Goal.findById(goalId).select("title");
                title = g ? g.title : "Unknown";
            }
            contributionsByGoal.push({ goalId: goalId ? goalId.toString() : null, title, total: row.total });
        }

        // ---------- 5) Budget usage (unchanged but ensure only expense) ----------
        const budgets = await Budget.find({ user: userId });
        const budgetUsage = [];
        for (const b of budgets) {
            const spentAgg = await Expense.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId),
                        category: b.category,
                        transactionType: "expense",
                        date: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            const spent = spentAgg[0]?.total || 0;
            budgetUsage.push({
                category: b.category,
                limit: b.budget_amount,
                spent,
                percent: b.budget_amount ? Math.round((spent / b.budget_amount) * 100) : 0
            });
        }

        // ---------- 6) Goals (list) ----------
        const goals = await Goal.find({ user: userId }).lean();


        // ---------- 7) Recent expenses and recent contributions (separate) ----------
        const recentTransactions = await Expense.find({
            user: userId,
            transactionType: "expense"
        })
            .sort({ date: -1 })
            .limit(5)
            .lean();

        // recent contributions with goal title (limit 2)
        const recentContributionsAgg = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), transactionType: 'contribution' } },
            { $sort: { date: -1 } },
            { $limit: 2 },
            {
                $lookup: {
                    from: 'goals',
                    localField: 'goal',
                    foreignField: '_id',
                    as: 'goal'
                }
            },
            {
                $unwind: {
                    path: '$goal',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    amount: 1,
                    date: 1,
                    goal: { _id: '$goal._id', title: '$goal.title' }
                }
            }
        ]);
        const recentContributions = recentContributionsAgg || [];

        // ---------- Response ----------
        return res.json({
            summary: {
                totalExpenses,
                totalIncome,
                totalContributions,
                monthlySavings,
                netSavings,
                netSavingsAfterGoals
            },
            months: months.map(m => m.label),
            monthlyTrend: {
                expenses: expenseTrend,
                income: incomeTrend,
                contributions: contributionTrend
            },
            expensesByCategory,
            expensesByMerchant,
            contributionsByGoal,
            budgetUsage,
            goals,
            recentTransactions,
            recentContributions
        });
    } catch (err) {
        next(err);
    }
};
