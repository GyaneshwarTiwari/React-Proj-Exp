// src/components/goals/GoalForm.jsx
import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const GoalForm = ({ open, onClose, onSubmit }) => {
    const initialState = {
        title: "",
        description: "",
        target_amount: "",
    };

    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            setForm(initialState);
            setErrors({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const validate = () => {
        const newErrors = {};

        // 1. Title Validation
        if (!form.title.trim()) {
            newErrors.title = "Goal title is required";
        }

        // 2. Amount Validation
        if (!form.target_amount) {
            newErrors.target_amount = "Target amount is required";
        } else if (Number(form.target_amount) <= 0) {
            newErrors.target_amount = "Target amount must be greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        // Clear error immediately on type
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(form);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Create Financial Goal"
            submitLabel="Create Goal"
        >
            {/* Title */}
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Goal Title</label>
                <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                        <i className="bi bi-flag"></i>
                    </span>
                    <input
                        type="text"
                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                        placeholder="e.g. New Car, Europe Trip, Emergency Fund"
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        autoFocus
                    />
                    {errors.title && (
                        <div className="invalid-feedback ms-2">{errors.title}</div>
                    )}
                </div>
            </div>

            {/* Target Amount */}
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Target Amount</label>
                <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">₹</span>
                    <input
                        type="number"
                        className={`form-control border-start-0 ps-0 ${errors.target_amount ? "is-invalid" : ""}`}
                        placeholder="0.00"
                        value={form.target_amount}
                        onChange={(e) => handleChange("target_amount", e.target.value)}
                        min="1"
                    />
                    {errors.target_amount && (
                        <div className="invalid-feedback ms-2">{errors.target_amount}</div>
                    )}
                </div>
            </div>

            {/* Description
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Description (Optional)</label>
                <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Why are you saving for this?"
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                />
            </div> */}
        </Modal>
    );
};

export default GoalForm;