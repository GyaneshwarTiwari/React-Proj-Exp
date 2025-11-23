// src/components/dashboard/CategoryBarChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";

const COLORS = [
    "#6366F1",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#0EA5E9",
    "#8B5CF6",
];

const normalize = (data) => {
    if (Array.isArray(data)) {
        const labels = data.map((d) => d._id || d.label || "Unknown");
        const values = data.map((d) => d.total || d.value || 0);
        return { labels, values };
    }
    if (data && typeof data === "object") {
        const labels = Object.keys(data);
        const values = Object.values(data);
        return { labels, values };
    }
    return { labels: [], values: [] };
};

const CategoryBarChart = ({ data }) => {
    const { labels, values } = normalize(data);

    if (!labels.length) return <div>No category data</div>;

    const chartData = {
        labels,
        datasets: [
            {
                label: "Amount Spent",
                data: values,
                backgroundColor: COLORS.slice(0, labels.length),
                borderRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: { beginAtZero: true, ticks: { callback: (v) => `₹${v}` } },
        },
        plugins: {
            legend: { display: false },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default CategoryBarChart;
