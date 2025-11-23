// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true, default: '' },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    // Reset password support (optional)
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

    // Notification preferences (simple)
    notificationPreferences: {
        notifyByEmail: { type: Boolean, default: true },
        notifyByPush: { type: Boolean, default: false },
        notifyInApp: { type: Boolean, default: true }
    }
}, { timestamps: true });

// Hash password before save if modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

// Compare given password with hashed
userSchema.methods.matchPassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate reset token (stores raw token and expiry — you may hash the token for extra security)
userSchema.methods.generatePasswordReset = function () {
    const token = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = token;
    // token valid for 1 hour
    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    return token;
};

module.exports = mongoose.model('User', userSchema);