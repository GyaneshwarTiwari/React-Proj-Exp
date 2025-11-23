// server/services/notificationService.js
// Creates Notification documents, emits real-time events via Socket.io (if available),
// and sends transactional emails (simple nodemailer integration).
// For heavier production use, replace the direct nodemailer sends with a background job queue.

const Notification = require('../models/Notification');
const User = require('../models/User');
const nodemailer = require('nodemailer');

let io;
try {
    // socket.js is optional at this stage; if present it should export getIo()
    // Example socket.js: module.exports.getIo = () => ioInstance;
    io = require('../socket').getIo();
} catch (err) {
    // socket not set up yet — that's fine
    io = null;
}

// Simple nodemailer transporter (expects SMTP env vars)
const createTransporter = () => {
    // If no SMTP config, return null so we skip email sending
    if (!process.env.EMAIL_SMTP_HOST) return null;

    return nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST,
        port: process.env.EMAIL_SMTP_PORT ? Number(process.env.EMAIL_SMTP_PORT) : 587,
        secure: process.env.EMAIL_SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_SMTP_USER,
            pass: process.env.EMAIL_SMTP_PASS
        }
    });
};

const transporter = createTransporter();

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

    // 3) Send email if requested and transporter is configured
    if (sendEmail && transporter) {
        try {
            const user = await User.findById(userId).select('email name notificationPreferences');
            if (user && user.email) {
                // Respect user-level preferences (if they opt-out, skip)
                if (user.notificationPreferences && user.notificationPreferences.notifyByEmail === false) {
                    // skip sending
                } else {
                    await transporter.sendMail({
                        from: process.env.EMAIL_FROM || `"Wealthwise" <no-reply@wealthwise.example>`,
                        to: user.email,
                        subject: title,
                        text: `${message}\n\nDetails: ${JSON.stringify(metadata || {})}`
                    });
                }
            }
        } catch (emailErr) {
            // In production, enqueue this failure for a retry pipeline.
            console.error('Email send error (notificationService):', emailErr);
        }
    }

    // 4) Push notification sending is left as a placeholder (web-push / third-party)
    if (sendPush) {
        // TODO: integrate pushService.enqueueSend(userId, payload)
    }

    return notif;
}

module.exports = {
    createAndDeliver
};