// src/components/income/IncomeForm.jsx
import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const IncomeForm = ({ open, onClose, onSubmit }) => {
    // Helper to get today's date
    const getTodayString = () => new Date().toISOString().split('T')[0];

    const initialState = {
        amount: "",
        date: getTodayString(),
        description: "",
        category: "Salary",
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
        const today = getTodayString();

        // 1. Amount Validation
        if (!form.amount) {
            newErrors.amount = "Amount is required";
        } else if (Number(form.amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }

        // 2. Date Validation
        if (!form.date) {
            newErrors.date = "Date is required";
        } else if (form.date > today) {
            newErrors.date = "Date cannot be in the future";
        }

        // 3. Source/Description Validation
        if (!form.description.trim()) {
            newErrors.description = "Source description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
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
            title="Add Income"
            submitLabel="Add Income"
        >
            <div className="row g-3">
                {/* Amount */}
                <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Amount</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light text-muted border-end-0">₹</span>
                        <input
                            type="number"
                            className={`form-control border-start-0 ps-0 ${errors.amount ? "is-invalid" : ""}`}
                            placeholder="0.00"
                            value={form.amount}
                            onChange={(e) => handleChange("amount", e.target.value)}
                            min="0.01"
                            step="0.01"
                        />
                        {errors.amount && <div className="invalid-feedback ms-2">{errors.amount}</div>}
                    </div>
                </div>

                {/* Date */}
                <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Date</label>
                    <input
                        type="date"
                        className={`form-control ${errors.date ? "is-invalid" : ""}`}
                        value={form.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        max={getTodayString()}
                    />
                    {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                </div>

                {/* Category */}
                <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Category</label>
                    <select
                        className="form-select"
                        value={form.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                    >
                        <option value="Salary">Salary</option>
                        <option value="Freelancing">Freelancing</option>
                        <option value="Bonus">Bonus</option>
                        <option value="Interest">Interest</option>
                        <option value="Gift">Gift</option>
                        <option value="Refund">Refund</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Description */}
                <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Source / Description</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light text-muted">
                            <i className="bi bi-wallet2"></i>
                        </span>
                        <input
                            type="text"
                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                            placeholder="e.g. October Salary, Freelance Project"
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />
                        {errors.description && <div className="invalid-feedback ms-2">{errors.description}</div>}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default IncomeForm;