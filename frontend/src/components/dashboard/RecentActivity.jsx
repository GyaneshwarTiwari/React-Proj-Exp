import React from "react";

const RecentActivity = ({ expenses = [], contributions = [] }) => {
    const hasData = expenses.length > 0 || contributions.length > 0;

    if (!hasData) return <div>No recent activity</div>;

    return (
        <div className="recent-activity">
            {/* Expenses */}
            <div className="mb-3">
                <h6 className="fw-semibold">Recent Expenses</h6>
                {expenses.slice(0, 5).map((e) => (
                    <div key={e._id} className="activity-item">
                        <div>
                            <strong>{e.description}</strong>
                            <div className="small text-muted">
                                {new Date(e.date).toLocaleDateString()}
                                {" • "}
                                {e.category}
                                {e.merchant ? ` • ${e.merchant}` : ''}
                            </div>
                        </div>
                        <div className="text-danger fw-semibold">- ₹{e.amount}</div>
                    </div>
                ))}
            </div>

            {/* Contributions */}
            <div>
                <h6 className="fw-semibold">Recent Goal Contributions</h6>
                {contributions.slice(0, 2).map((c) => (
                    <div key={c._id} className="activity-item">
                        <div>
                            <strong>{c.goal?.title || 'Unknown Goal'}</strong>
                            <div className="small text-muted">
                                {new Date(c.date).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="text-primary fw-semibold">+ ₹{c.amount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
