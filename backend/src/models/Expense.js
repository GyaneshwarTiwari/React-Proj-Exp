// server/models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, index: true },
    description: { type: String, trim: true, default: '' },
    category: { type: String, required: true, trim: true },
    merchant: { type: String, trim: true, default: '' },
    source: { type: String, enum: ['manual', 'imported'], default: 'manual' },
    transactionType: { type: String, enum: ['expense', 'contribution'], default: 'expense' },
    goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', default: null },

    // externalId for idempotent imports from bank (sparse unique)
    externalId: { type: String, default: undefined }
}, { timestamps: true });

// Index for deduping imported transactions (sparse so manual expenses without externalId don't conflict)
expenseSchema.index({ externalId: 1 }, { unique: true, sparse: true });

// Helpful compound index for queries filtered by user and date range
expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);