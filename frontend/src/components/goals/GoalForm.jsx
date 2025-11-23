import React, { useState } from "react";
import Modal from "../ui/Modal";

const GoalForm = ({ open, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        target_amount: "",
    });

    const handleSubmit = () => {
        if (!form.title || !form.target_amount) return;
        onSubmit(form);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Create Goal"
            submitLabel="Create"
        >
            <div className="mb-3">
                <label>Goal Title</label>
                <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label>Description (optional)</label>
                <textarea
                    className="form-control"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label>Target Amount</label>
                <input
                    type="number"
                    className="form-control"
                    value={form.target_amount}
                    onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
                />
            </div>
        </Modal>
    );
};

export default GoalForm;
