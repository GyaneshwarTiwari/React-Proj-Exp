import React, { useState } from "react";
import Modal from "../ui/Modal";

const ImportExpenseModal = ({ open, onClose, onSubmit }) => {
    const [bankId, setBankId] = useState("");

    const handleSubmit = () => {
        if (!bankId) return;
        onSubmit(bankId);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Import Bank Expenses"
            submitLabel="Import"
        >
            <div className="mb-3">
                <label>Bank Account ID</label>
                <input
                    className="form-control"
                    value={bankId}
                    onChange={(e) => setBankId(e.target.value)}
                    placeholder="Enter bank account ID"
                />
            </div>
        </Modal>
    );
};

export default ImportExpenseModal;
