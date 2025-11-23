import React from "react";

const EmptyState = ({ title = "No data available", children }) => {
    return (
        <div className="text-center py-5">
            <div style={{ fontSize: "48px" }}>📦</div>
            <h5 className="fw-semibold mt-3">{title}</h5>
            <p className="text-muted">{children}</p>
        </div>
    );
};

export default EmptyState;
