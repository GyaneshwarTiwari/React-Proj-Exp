const Income = require("../models/Income");

exports.addIncome = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { amount, date, description, category, source } = req.body;

        if (!amount || !date)
            return res.status(400).json({ error: "Amount and date required" });

        const income = await Income.create({
            user: userId,
            amount,
            date,
            description,
            category: category || "General",
            source: source || "manual"
        });

        res.status(201).json({ message: "Income added", income });
    } catch (err) {
        next(err);
    }
};

exports.getIncome = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { category, from, to, startDate, endDate } = req.query;

        const filter = { user: userId };
        if (category) filter.category = category;

        // Support both from/to and startDate/endDate
        let dateFilter = {};
        if (from) dateFilter.$gte = new Date(from);
        if (to) dateFilter.$lte = new Date(to);
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);
        if (Object.keys(dateFilter).length > 0) filter.date = dateFilter;

        const income = await Income.find(filter).sort({ date: -1 });
        res.json({ income });
    } catch (err) {
        next(err);
    }
};

exports.updateIncome = async (req, res, next) => {
    try {
        const { id } = req.params;
        const income = await Income.findById(id);
        if (!income)
            return res.status(404).json({ error: "Income not found" });
        Object.assign(income, req.body);
        await income.save();
        res.json({ message: "Income updated", income });
    } catch (err) {
        next(err);
    }
};

exports.deleteIncome = async (req, res, next) => {
    try {
        const { id } = req.params;
        const income = await Income.findById(id);
        if (!income)
            return res.status(404).json({ error: "Income not found" });
        await income.deleteOne();
        res.json({ message: "Income deleted" });
    } catch (err) {
        next(err);
    }
};
