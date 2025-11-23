// server/models/Goal.js
const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
    thresholds: { type: [Number], default: [50, 75, 100] }, // percent thresholds to notify
    notifyByEmail: { type: Boolean, default: true },
    notifyByPush: { type: Boolean, default: false },
    notifyInApp: { type: Boolean, default: true }
}, { _id: false });

const goalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true }, // short description of goal
    target_amount: { type: Number, required: true },
    current_amount: { type: Number, default: 0 },         // denormalized for fast reads
    progress_percent: { type: Number, default: 0 },       // 0..100
    status: { type: String, enum: ['active', 'achieved', 'cancelled'], default: 'active' },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: null },
    notifications: { type: notificationSettingsSchema, default: () => ({}) }
}, { timestamps: true });

// Index for quick lookup of active goals per user
goalSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Goal', goalSchema);