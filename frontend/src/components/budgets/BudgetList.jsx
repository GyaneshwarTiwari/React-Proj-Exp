import React from "react";

const BudgetList = ({ budgets, onEdit, onDelete }) => {
    return (
        <div className="row g-4">
            {budgets.map((b) => {
                const percent = Math.round((b.spent / b.budget_amount) * 100) || 0;

                let barColor = "bg-primary";
                if (percent >= 70 && percent < 100) barColor = "bg-indigo";
                if (percent >= 100) barColor = "bg-danger";

                return (
                    <div className="col-md-4" key={b._id}>
                        <div className="app-card p-3 shadow-sm" style={{ borderRadius: 12 }}>
                            <h5 className="fw-bold">{b.category}</h5>

                            <div className="text-muted small">
                                ₹{b.spent} / ₹{b.budget_amount}
                            </div>

                            <div className="progress my-2" style={{ height: 8 }}>
                                <div
                                    className={`progress-bar ${barColor}`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>

                            {percent >= 100 && (
                                <div className="text-danger small fw-semibold">
                                    Budget exceeded!
                                </div>
                            )}

                            <div className="d-flex justify-content-between mt-3">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => onEdit(b)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => onDelete(b._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BudgetList;
