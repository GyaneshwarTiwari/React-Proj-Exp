import React, { useState } from "react";
import Modal from "../ui/Modal";

const EditExpenseModal = ({ open, onClose, onSubmit, data }) => {
    const [form, setForm] = useState({
        amount: data.amount,
        date: data.date.split("T")[0],
        description: data.description,
        merchant: data.merchant || '',
        category: data.category,
    });

    const handleSubmit = () => {
        onSubmit(form);
    };

    return (
        <Modal open={open} onClose={onClose} onSubmit={handleSubmit} title="Edit Expense">
            <div className="mb-3">
                <label>Amount</label>
                <input
                    type="number"
                    className="form-control"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label>Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label>Description</label>
                <input
                    type="text"
                    className="form-control"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label>Merchant</label>
                <input
                    type="text"
                    className="form-control"
                    value={form.merchant}
                    onChange={(e) => setForm({ ...form, merchant: e.target.value })}
                />
            </div>

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
                    <option>Other</option>
                </select>
            </div>
        </Modal>
    );
};

export default EditExpenseModal;
