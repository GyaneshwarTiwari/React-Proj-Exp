// server/services/notificationService.js
// Creates Notification documents, emits real-time events via Socket.io (if available),
// and sends transactional emails (simple nodemailer integration).
// For heavier production use, replace the direct nodemailer sends with a background job queue.

const Notification = require('../models/Notification');

let io;
try {
    // socket.js is optional at this stage; if present it should export getIo()
    // Example socket.js: module.exports.getIo = () => ioInstance;
    io = require('../socket').getIo();
} catch (err) {
    // socket not set up yet — that's fine
    io = null;
}

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

    // 2) Emit via Socket.io if available
    try {
        if (io) {
            // Emit to a room named after the userId (string)
            io.to(String(userId)).emit('notification', notif);
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