// src/components/dashboard/MonthlyTrendChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";

const MonthlyTrendChart = ({ months = [], trend = {} }) => {
    // trend expected shape: { expenses: [], income: [], contributions: [] }
    // months expected to be an array of labels (strings)
    const labels = Array.isArray(months) && months.length ? months : [];

    const expenses = Array.isArray(trend.expenses) ? trend.expenses : [];
    const income = Array.isArray(trend.income) ? trend.income : [];
    const contributions = Array.isArray(trend.contributions) ? trend.contributions : [];

    // Ensure arrays align with labels length (fill missing with 0)
    const fillToLength = (arr, len) => {
        const a = Array.from(arr || []);
        while (a.length < len) a.push(0);
        return a.slice(0, len);
    };

    const len = labels.length || Math.max(expenses.length, income.length, contributions.length);
    const xLabels = labels.length ? labels : Array.from({ length: len }, (_, i) => `M${i + 1}`);

    const chartData = {
        labels: xLabels,
        datasets: [
            {
                label: "Expenses",
                data: fillToLength(expenses, xLabels.length),
                borderColor: "#EF4444",
                backgroundColor: "rgba(239,68,68,0.12)",
                tension: 0.3,
                fill: true,
            },
            {
                label: "Income",
                data: fillToLength(income, xLabels.length),
                borderColor: "#10B981",
                backgroundColor: "rgba(16,185,129,0.12)",
                tension: 0.3,
                fill: true,
            },
            {
                label: "Contributions",
                data: fillToLength(contributions, xLabels.length),
                borderColor: "#6366F1",
                backgroundColor: "rgba(99,102,241,0.12)",
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            tooltip: { mode: "index", intersect: false }
        },
        interaction: { mode: "index", intersect: false },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { callback: (v) => `₹${v}` },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default MonthlyTrendChart;
