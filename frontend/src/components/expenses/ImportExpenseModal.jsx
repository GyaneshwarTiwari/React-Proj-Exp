// src/components/expenses/ImportExpenseModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const ImportExpenseModal = ({ open, onClose, onSubmit }) => {
    const [bankId, setBankId] = useState("");
    const [error, setError] = useState("");

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setBankId("");
            setError("");
        }
    }, [open]);

    const validate = () => {
        // 1. Check if empty
        if (!bankId) {
            setError("Bank Account ID is required");
            return false;
        }

        // 2. Check length (8 to 15 digits)
        if (bankId.length < 8 || bankId.length > 15) {
            setError("Account ID must be between 8 and 15 digits");
            return false;
        }

        // 3. Check numeric (Double safety, though onChange handles it)
        if (!/^\d+$/.test(bankId)) {
            setError("Invalid format. Numbers only.");
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        const value = e.target.value;

        // Input Masking: Only allow digits (prevents negatives/decimals/text)
        if (value === "" || /^\d+$/.test(value)) {
            setBankId(value);
            // Clear error if length is valid
            if (value.length >= 8 && value.length <= 15) {
                setError("");
            }
        }
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(bankId);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Import from Bank"
            submitLabel="Sync Transactions"
        >
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Bank Account ID</label>
                <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                        <i className="bi bi-bank2"></i>
                    </span>
                    <input
                        type="text"
                        inputMode="numeric"
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        value={bankId}
                        onChange={handleChange}
                        placeholder="e.g. 123456789"
                        maxLength={15} // HTML constraint
                    />
                    {error && (
                        <div className="invalid-feedback d-block ms-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {error}
                        </div>
                    )}
                </div>
                <div className="form-text text-muted" style={{ fontSize: "0.75rem" }}>
                    Enter your unique 8-15 digit account identifier.
                </div>
            </div>
        </Modal>
    );
};

export default ImportExpenseModal;