// server/controllers/exportController.js
const Expense = require('../models/Expense');
const exportService = require('../services/exportService');

/**
 * GET /export?type=excel|pdf&from=&to=
 */
exports.exportExpenses = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { type = 'excel', from, to } = req.query;
        const q = { user: userId };

        if (from || to) {
            q.date = {};
            if (from) q.date.$gte = new Date(from);
            if (to) q.date.$lte = new Date(to);
        }

        const expenses = await Expense.find(q).sort({ date: -1 }).lean();

        if (type === 'pdf') {
            const buffer = await exportService.buildPdfBuffer(expenses);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="expenses_${Date.now()}.pdf"`);
            return res.send(buffer);
        }

        // default to excel
        const buffer = await exportService.buildExcelBuffer(expenses);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="expenses_${Date.now()}.xlsx"`);
        return res.send(buffer);
    } catch (err) {
        next(err);
    }
};
