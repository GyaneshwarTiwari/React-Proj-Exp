// server/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true }, // e.g. 'budget_exceeded', 'goal_milestone', 'goal_achieved'
    title: { type: String, required: true },
    message: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // extra context (category, budget, spent, goalId, etc.)
    read: { type: Boolean, default: false }
}, { timestamps: true });

// Index to quickly fetch unread notifications
notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
