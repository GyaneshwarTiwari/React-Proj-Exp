import React, { useState } from "react";
import Modal from "../ui/Modal";

const EditGoalModal = ({ open, onClose, onSubmit, data }) => {
    const [form, setForm] = useState({
        title: data.title,
        description: data.description,
        target_amount: data.target_amount,
    });

    const handleSubmit = () => {
        onSubmit(form);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Edit Goal"
            submitLabel="Save"
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
                <label>Description</label>
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
                    onChange={(e) =>
                        setForm({ ...form, target_amount: e.target.value })
                    }
                />
            </div>
        </Modal>
    );
};

export default EditGoalModal;
