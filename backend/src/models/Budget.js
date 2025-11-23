// server/models/Budget.js
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true, trim: true },
    budget_amount: { type: Number, required: true }
}, { timestamps: true });

// Ensure one budget per user+category
budgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
