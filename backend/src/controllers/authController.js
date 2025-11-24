// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to create JWT
function createToken(userId) {
    const payload = { id: userId };
    const opts = { expiresIn: process.env.JWT_EXPIRES_IN || '7d' };
    return jwt.sign(payload, process.env.JWT_SECRET, opts);
}

exports.signup = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Prevent duplicate email
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = await User.create({ email, password, name });

        return res.status(201).json({ message: 'User registered successfully', user: { id: user._id, email: user.email } });
    } catch (err) {
        // handle unique index errors or pass to error middleware
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = createToken(user._id);

        return res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/v1/auth/password
exports.changePassword = async (req, res, next) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) return res.status(401).json({ error: 'Not authenticated' });

        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'currentPassword and newPassword are required' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await user.matchPassword(currentPassword);
        if (!match) return res.status(400).json({ error: 'Current password is incorrect' });

        user.password = newPassword;
        await user.save();

        return res.json({ message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
};
