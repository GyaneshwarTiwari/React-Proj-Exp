import React, { useState } from "react";
import Modal from "../ui/Modal";

const EditIncomeModal = ({ open, onClose, onSubmit, data }) => {
    const [form, setForm] = useState({
        amount: data.amount,
        date: data.date?.split("T")[0],
        description: data.description,
        category: data.category,
    });

    const handleSubmit = () => {
        onSubmit(form);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Edit Income"
            submitLabel="Save"
        >
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
                <label>Source / Description</label>
                <input
                    type="text"
                    className="form-control"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label>Category</label>
                <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                    <option>Salary</option>
                    <option>Frehoot</option>
                    <option>Bonus</option>
                    <option>Interest</option>
                    <option>Gift</option>
                    <option>Other</option>
                </select>
            </div>
        </Modal>
    );
};

export default EditIncomeModal;
