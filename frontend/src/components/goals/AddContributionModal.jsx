// src/components/goals/AddContributionModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const AddContributionModal = ({ open, onClose, onSubmit, goal }) => {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setAmount("");
            setError("");
        }
    }, [open]);

    const validate = () => {
        if (!amount) {
            setError("Amount is required");
            return false;
        }

        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Contribution must be greater than 0");
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        setAmount(e.target.value);
        // Clear error immediately when user types
        if (error) setError("");
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(Number(amount));
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title={`Contribute to ${goal?.title || 'Goal'}`}
            submitLabel="Add Contribution"
        >
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Contribution Amount</label>
                <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">₹</span>
                    <input
                        type="number"
                        className={`form-control border-start-0 ps-0 ${error ? "is-invalid" : ""}`}
                        value={amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                        autoFocus
                    />
                    {error && (
                        <div className="invalid-feedback ms-2">{error}</div>
                    )}
                </div>
                <div className="form-text text-muted" style={{ fontSize: "0.75rem" }}>
                    Every rupee counts! Adding this will update your goal progress.
                </div>
            </div>
        </Modal>
    );
};

export default AddContributionModal;