// server/services/notificationService.js
// Creates Notification documents, emits real-time events via Socket.io (if available),
// and sends transactional emails (simple nodemailer integration).
// For heavier production use, replace the direct nodemailer sends with a background job queue.

const Notification = require('../models/Notification');

// We'll resolve io at emit time to avoid the module load-time ordering issue
// where this service is required before socket.init(server) is called.

/**
 * createAndDeliver
 * @param {ObjectId} userId
 * @param {Object} payload { type, title, message, metadata={}, sendEmail=false, sendPush=false }
 * @returns {NotificationDocument}
 */
async function createAndDeliver(userId, payload = {}) {
    const { type, title, message, metadata = {}, sendEmail = false, sendPush = false } = payload;

    // 1) Save to DB
    const notif = await Notification.create({
        user: userId,
        type,
        title,
        message,
        metadata
    });
    console.debug(`[notificationService] created notification for user=${userId} id=${notif._id}`);

    // 2) Emit via Socket.io if available. Resolve getIo() at runtime to handle
    // module load-order where socket may be initialized after this module.
    try {
        const socketModule = require('../socket');
        const runtimeIo = socketModule && typeof socketModule.getIo === 'function' ? socketModule.getIo() : null;
        if (runtimeIo) {
            runtimeIo.to(String(userId)).emit('notification', notif);
            console.debug(`[notificationService] emitted notification to user=${userId}`);
        } else {
            console.debug('[notificationService] socket.io instance not available; skipping emit');
        }
    } catch (emitErr) {
        console.warn('Warning: failed to emit notification via socket:', emitErr.message || emitErr);
    }

    // Email sending removed: notifications are saved to DB and emitted via websocket only.

    // 4) Push notification sending is left as a placeholder (web-push / third-party)
    if (sendPush) {
        // TODO: integrate pushService.enqueueSend(userId, payload)
    }

    return notif;
}

module.exports = {
    createAndDeliver
};