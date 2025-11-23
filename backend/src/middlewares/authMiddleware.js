// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Not authorized, no token" });
        }

        const token = header.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user object to request
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ error: "User not found" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: "Not authorized, token failed" });
    }
};

module.exports = { authMiddleware };
