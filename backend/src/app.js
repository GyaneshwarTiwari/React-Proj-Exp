// app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes")
const budgetRoutes = require("./routes/budgetRoutes");
const goalsRoutes = require("./routes/goalsRoutes");
const contributionRoutes = require("./routes/contributionRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes");
const exportRoutes = require("./routes/exportRoutes");

// Error middleware
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Mount routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/budgets", budgetRoutes);
app.use("/api/v1/goals", goalsRoutes);
app.use("/api/v1/goals", contributionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/export", exportRoutes);

// Health check route
app.get("/", (req, res) => {
    res.send("Wealthwise API is running...");
});

// Error handler (should be last)
app.use(errorHandler);

module.exports = app;