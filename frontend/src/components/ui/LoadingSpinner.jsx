import React from "react";

const LoadingSpinner = () => (
    <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
    >
        <div className="spinner-border text-primary" role="status"></div>
    </div>
);

export default LoadingSpinner;
