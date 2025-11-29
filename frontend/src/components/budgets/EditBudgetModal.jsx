// src/components/budgets/EditBudgetModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const EditBudgetModal = ({ open, onClose, onSubmit, data }) => {
  // Initial state
  const [form, setForm] = useState({
    category: "",
    budget_amount: "",
  });

  const [errors, setErrors] = useState({});

  // Sync state with data when modal opens
  useEffect(() => {
    if (open && data) {
      setForm({
        category: data.category || "Food",
        budget_amount: data.budget_amount || "",
      });
      // Clear previous errors
      setErrors({});
    }
  }, [open, data]);

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

    // 2. Category Validation
    if (!form.category) {
      newErrors.category = "Category is required";
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
      title="Edit Budget"
      submitLabel="Save Changes"
    >
      {/* Category Select */}
      <div className="mb-3">
        <label className="form-label small fw-bold text-muted">Category</label>
        <select
          className="form-select"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        // Disable category editing if you want to enforce unique categories
        // disabled={true} 
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
        <label className="form-label small fw-bold text-muted">Monthly Limit</label>
        <div className="input-group">
          <span className="input-group-text bg-light text-muted border-end-0">₹</span>
          <input
            type="number"
            className={`form-control border-start-0 ps-0 ${errors.budget_amount ? "is-invalid" : ""}`}
            value={form.budget_amount}
            onChange={(e) => handleChange("budget_amount", e.target.value)}
            min="0"
          />
          {errors.budget_amount && (
            <div className="invalid-feedback d-block ms-2">
              <i className="bi bi-exclamation-circle me-1"></i>
              {errors.budget_amount}
            </div>
          )}
        </div>
        <div className="form-text text-muted" style={{ fontSize: '0.75rem' }}>
          Updating this will affect your spending progress for the current month.
        </div>
      </div>
    </Modal>
  );
};

export default EditBudgetModal;