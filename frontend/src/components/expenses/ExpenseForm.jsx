// src/components/expenses/ExpenseForm.jsx
import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const PREDEFINED_MERCHANTS = [
    "Amazon", "Flipkart", "Uber", "Ola", "Zomato", "Swiggy",
    "Starbucks", "McDonalds", "KFC", "Dominos",
    "Netflix", "Spotify", "Apple", "Google",
    "Shell", "Indian Oil", "Reliance Smart", "D-Mart",
    "Apollo Pharmacy", "Local Vendor"
];

const ExpenseForm = ({ open, onClose, onSubmit }) => {
    // Helper to get today's date in YYYY-MM-DD format
    const getTodayString = () => new Date().toISOString().split('T')[0];

    const initialState = {
        amount: "",
        date: getTodayString(),
        description: "",
        merchant: "", // Stores the final merchant name (whether selected or typed)
        category: "Food",
    };

    const [form, setForm] = useState(initialState);
    const [merchantOption, setMerchantOption] = useState(""); // Track dropdown selection
    const [errors, setErrors] = useState({});

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            setForm(initialState);
            setMerchantOption("");
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

        // 3. Merchant Validation
        if (!form.merchant.trim()) {
            newErrors.merchant = "Please select or enter a merchant";
        }

        // 4. Category
        if (!form.category) newErrors.category = "Category is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: null });
    };

    const handleMerchantSelect = (e) => {
        const value = e.target.value;
        setMerchantOption(value);

        if (value === "Other") {
            // Clear merchant so user can type fresh
            setForm({ ...form, merchant: "" });
        } else {
            // Set merchant to the dropdown value
            setForm({ ...form, merchant: value });
            // Clear error if exists
            if (errors.merchant) setErrors({ ...errors, merchant: null });
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
            title="Add New Expense"
            submitLabel="Add Expense"
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

                {/* Merchant Logic */}
                <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Merchant / Store</label>

                    {/* 1. Dropdown Selection */}
                    <div className="input-group">
                        <span className="input-group-text bg-light text-muted">
                            <i className="bi bi-shop"></i>
                        </span>
                        <select
                            className={`form-select ${errors.merchant && merchantOption !== "Other" ? "is-invalid" : ""}`}
                            value={merchantOption}
                            onChange={handleMerchantSelect}
                        >
                            <option value="">-- Select Merchant --</option>
                            {PREDEFINED_MERCHANTS.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                            <option value="Other">Other (Type custom name)</option>
                        </select>
                        {/* Error for dropdown (only if not 'Other') */}
                        {errors.merchant && merchantOption !== "Other" && (
                            <div className="invalid-feedback ms-2">{errors.merchant}</div>
                        )}
                    </div>

                    {/* 2. Custom Input (Only shows if 'Other' is selected) */}
                    {merchantOption === "Other" && (
                        <div className="mt-2 animate-fade-in">
                            <input
                                type="text"
                                className={`form-control ${errors.merchant ? "is-invalid" : ""}`}
                                placeholder="Enter custom merchant name..."
                                value={form.merchant}
                                onChange={(e) => handleChange("merchant", e.target.value)}
                                autoFocus
                            />
                            {errors.merchant && <div className="invalid-feedback">{errors.merchant}</div>}
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Description (Optional)</label>
                    <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Notes about this expense..."
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                </div>
            </div>

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </Modal>
    );
};

export default ExpenseForm;