import React from "react";

const GoalList = ({
    goals,
    onEdit,
    onDelete,
    onContribute,
    onShowContributions,
}) => {
    return (
        <div className="row g-4">
            {goals.map((goal) => {
                const percent = goal.progress_percent || 0;
                const achieved = percent >= 100;

                return (
                    <div className="col-md-4" key={goal._id}>
                        <div className="app-card p-3 shadow-sm" style={{ borderRadius: 12 }}>
                            <div className="d-flex justify-content-between">
                                <h5 className="fw-bold">{goal.title}</h5>
                                {achieved && <span className="badge bg-success">Achieved</span>}
                            </div>

                            <p className="text-muted mb-1">{goal.description}</p>

                            <div className="small text-muted">
                                ₹{goal.current_amount} / ₹{goal.target_amount}
                            </div>

                            {/* Progress Bar */}
                            <div className="progress my-2" style={{ height: 8 }}>
                                <div
                                    className={`progress-bar ${achieved ? "bg-success" : "bg-primary"
                                        }`}
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>

                            <div className="d-flex justify-content-between mt-3">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => onEdit(goal)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => onContribute(goal)}
                                >
                                    + Contribute
                                </button>

                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => onShowContributions(goal)}
                                >
                                    History
                                </button>

                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => onDelete(goal._id)}
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

export default GoalList;
