// src/components/dashboard/CategoryPieChart.jsx
import React from "react";
import { Pie } from "react-chartjs-2";

const COLORS = [
    "#6366F1",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#0EA5E9",
    "#8B5CF6",
    "#14B8A6",
];

const normalize = (data) => {
    // Accept backend array [{ _id: "Food", total: 200 }, ...]
    if (Array.isArray(data)) {
        const labels = data.map((d) => d._id || d.label || "Unknown");
        const values = data.map((d) => d.total || d.value || 0);
        return { labels, values };
    }

    // Accept object mapping { Food: 200, Travel: 100 }
    if (data && typeof data === "object") {
        const labels = Object.keys(data);
        const values = Object.values(data);
        return { labels, values };
    }

    return { labels: [], values: [] };
};

const CategoryPieChart = ({ data }) => {
    const { labels, values } = normalize(data);

    if (!labels.length) return <div>No category data</div>;

    const chartData = {
        labels,
        datasets: [
            {
                label: "Expense Share",
                data: values,
                backgroundColor: COLORS.slice(0, labels.length),
                borderWidth: 1,
            },
        ],
    };


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right",
                align: "center",
                labels: {
                    boxWidth: 18,
                    padding: 12,
                },
            },
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
        },
    };


    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                minHeight: "320px",
                maxWidth: "320px",
                maxHeight: "320px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default CategoryPieChart;
