import React, { useState } from "react";
import Modal from "../ui/Modal";

const BudgetForm = ({ open, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        category: "Food",
        budget_amount: "",
    });

    const handleSubmit = () => {
        if (!form.budget_amount) return;
        onSubmit(form);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Add Budget"
            submitLabel="Create"
        >
            <div className="mb-3">
                <label>Category</label>
                <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                    <option>Food</option>
                    <option>Travel</option>
                    <option>Health</option>
                    <option>Shopping</option>
                    <option>Bills</option>
                    <option>Entertainment</option>
                    <option>Other</option>
                </select>
            </div>

            <div className="mb-3">
                <label>Monthly Budget Amount</label>
                <input
                    type="number"
                    className="form-control"
                    value={form.budget_amount}
                    onChange={(e) => setForm({ ...form, budget_amount: e.target.value })}
                />
            </div>
        </Modal>
    );
};

export default BudgetForm;
