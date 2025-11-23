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

const ContributionsPieChart = ({ data }) => {
    if (!data || data.length === 0)
        return <div>No contribution data</div>;

    const labels = data.map((g) => g.title);
    const values = data.map((g) => g.total || 0);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Goal Contributions",
                data: values,
                backgroundColor: COLORS.slice(0, labels.length),
                borderWidth: 1,
            },
        ],
    };

    return <Pie data={chartData}
        options={{ responsive: true, plugins: { legend: { position: "bottom" } } }}
    />;
};

export default ContributionsPieChart;
