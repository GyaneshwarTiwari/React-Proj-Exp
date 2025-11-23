import React from "react";

const SummaryCards = ({ totals }) => {
    if (!totals) return null;

    const cards = [
        { label: "Total Expenses", value: totals.totalExpenses, color: "#EF4444" },
        { label: "Total Income", value: totals.totalIncome, color: "#10B981" },
        { label: "Contributions", value: totals.totalContributions, color: "#6366F1" },
        { label: "Net Savings", value: totals.netSavings, color: "#0EA5E9" },
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
