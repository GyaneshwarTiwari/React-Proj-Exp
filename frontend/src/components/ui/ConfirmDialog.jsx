import React from "react";
import Modal from "./Modal";

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    message = "Are you sure?",
}) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={onConfirm}
            submitLabel="Yes, Delete"
            title="Confirm Action"
            size="sm"
        >
            <p className="mb-0">{message}</p>
        </Modal>
    );
};

export default ConfirmDialog;
