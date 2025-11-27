import React from "react";

const SummaryCards = ({ totals }) => {
    if (!totals) return null;

    const fmt = (v) => {
        const n = Number(v || 0);
        return n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    };

    const cards = [
        { label: "Total Expenses", value: fmt(totals.totalExpenses), color: "#EF4444" },
        { label: "Total Income", value: fmt(totals.totalIncome), color: "#10B981" },
        { label: "Contributions", value: fmt(totals.totalContributions), color: "#6366F1" },
        { label: "Monthly Savings", value: fmt(totals.monthlySavings), color: "#0EA5E9" },
        { label: "Net Savings (All Time)", value: fmt(totals.netSavings), color: "#0EA5E9" }
    ];

    return (
        <div className="row g-3 mb-4">
            {cards.map((c, i) => (
                <div className="col-6 col-md-3" key={i}>
                    <div className="app-card text-center py-3">
                        <h6 className="fw-semibold" style={{ color: "var(--color-muted)" }}>
                            {c.label}
                        </h6>
                        <h3 className="fw-bold mt-2" style={{ color: c.color }}>
                            ₹{c.value}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
