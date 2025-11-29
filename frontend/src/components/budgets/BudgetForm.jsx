// src/components/budgets/BudgetForm.jsx
import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const BudgetForm = ({ open, onClose, onSubmit }) => {
    // Initial State
    const initialFormState = {
        category: "Food",
        budget_amount: "",
    };

    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    // Reset form when modal opens/closes
    useEffect(() => {
        if (open) {
            setForm(initialFormState);
            setErrors({});
        }
    }, [open]);

    const validate = () => {
        const newErrors = {};

        // 1. Amount Validation
        if (!form.budget_amount) {
            newErrors.budget_amount = "Budget amount is required";
        } else {
            const amount = Number(form.budget_amount);
            if (amount < 0) {
                newErrors.budget_amount = "Budget cannot be negative";
            } else if (amount === 0) {
                newErrors.budget_amount = "Budget must be greater than zero";
            }
        }

        // 2. Category Validation (Safety check)
        if (!form.category) {
            newErrors.category = "Please select a category";
        }

        setErrors(newErrors);
        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        // Clear error for this field immediately when user types
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
            title="Set Monthly Budget"
            submitLabel="Create Budget"
        >
            {/* Category Select */}
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Category</label>
                <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                >
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Health">Health</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Education">Education</option>
                    <option value="Rent">Rent</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* Amount Input */}
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Limit Amount</label>
                <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">₹</span>
                    <input
                        type="number"
                        className={`form-control border-start-0 ps-0 ${errors.budget_amount ? "is-invalid" : ""}`}
                        value={form.budget_amount}
                        onChange={(e) => handleChange("budget_amount", e.target.value)}
                        min="0"
                    />
                    {/* Bootstrap Invalid Feedback */}
                    {errors.budget_amount && (
                        <div className="invalid-feedback d-block ms-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.budget_amount}
                        </div>
                    )}
                </div>
                <div className="form-text text-muted" style={{ fontSize: '0.75rem' }}>
                    You will get a notification if you exceed this amount.
                </div>
            </div>
        </Modal>
    );
};

export default BudgetForm;