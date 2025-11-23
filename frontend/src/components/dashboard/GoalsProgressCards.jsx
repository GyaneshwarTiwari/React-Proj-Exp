import React from "react";

const GoalsProgressCards = ({ goals }) => {
    if (!goals || goals.length === 0) return <div>No goals found</div>;

    return (
        <div className="row g-3">
            {goals.map((goal, index) => (
                <div className="col-md-6" key={index}>
                    <div className="app-card p-3">
                        <h6 className="fw-semibold">{goal.title}</h6>

                        <div className="d-flex justify-content-between mb-1">
                            <small className="text-muted">
                                {goal.current_amount
                                    ? `₹${goal.current_amount} / ₹${goal.target_amount}`
                                    : ""}
                            </small>
                            <small className="fw-semibold">
                                {goal.progress_percent}%
                            </small>
                        </div>

                        {/* Progress bar */}
                        <div className="progress" style={{ height: "10px" }}>
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                    width: `${goal.progress_percent}%`,
                                    backgroundColor:
                                        goal.progress_percent >= 100
                                            ? "#10B981"
                                            : goal.progress_percent >= 70
                                                ? "#6366F1"
                                                : "#0EA5E9",
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GoalsProgressCards;
