// middlewares/errorMiddleware.js

// For explicit error throwing: next({ statusCode, message })
const errorHandler = (err, req, res, next) => {
    console.error("❌ Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({ error: message });
};

module.exports = { errorHandler };
