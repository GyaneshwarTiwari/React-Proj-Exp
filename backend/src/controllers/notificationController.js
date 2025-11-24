const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const limit = Math.min(100, Number(req.query.limit) || 50);
        const skip = Number(req.query.skip) || 0;

        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const unreadCount = await Notification.countDocuments({ user: userId, read: false });

        return res.json({ notifications, unreadCount });
    } catch (err) {
        next(err);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;
        const updated = await Notification.findOneAndUpdate({ _id: id, user: userId }, { $set: { read: true } }, { new: true }).lean();
        if (!updated) return res.status(404).json({ error: 'Notification not found' });
        const unreadCount = await Notification.countDocuments({ user: userId, read: false });
        return res.json({ notification: updated, unreadCount });
    } catch (err) {
        next(err);
    }
};

exports.markAllRead = async (req, res, next) => {
    try {
        const userId = req.user._id;
        await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } });
        return res.json({ message: 'All notifications marked read', unreadCount: 0 });
    } catch (err) {
        next(err);
    }
};

exports.deleteNotification = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;
        const deleted = await Notification.findOneAndDelete({ _id: id, user: userId });
        if (!deleted) return res.status(404).json({ error: 'Notification not found' });
        const unreadCount = await Notification.countDocuments({ user: userId, read: false });
        return res.json({ message: 'Notification deleted', unreadCount });
    } catch (err) {
        next(err);
    }
};

exports.deleteAllNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const result = await Notification.deleteMany({ user: userId });
        return res.json({ message: 'All notifications deleted', deletedCount: result.deletedCount || 0, unreadCount: 0 });
    } catch (err) {
        next(err);
    }
};
