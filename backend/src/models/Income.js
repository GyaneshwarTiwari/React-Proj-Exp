const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, index: true },
    description: { type: String, trim: true, default: '' },
    category: { type: String, required: true, trim: true },
    source: { type: String, enum: ['manual', 'imported'], default: 'manual' },
    externalId: { type: String, default: undefined }
}, { timestamps: true });

incomeSchema.index({ externalId: 1 }, { unique: true, sparse: true });
incomeSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Income', incomeSchema);
