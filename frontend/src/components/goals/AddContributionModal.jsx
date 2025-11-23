import React, { useState } from "react";
import Modal from "../ui/Modal";

const AddContributionModal = ({ open, onClose, onSubmit, goal }) => {
    const [amount, setAmount] = useState("");

    const handleSubmit = () => {
        if (!amount) return;
        onSubmit(Number(amount));
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title={`Contribute to ${goal.title}`}
            submitLabel="Add Contribution"
        >
            <div className="mb-3">
                <label>Amount</label>
                <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
        </Modal>
    );
};

export default AddContributionModal;
