import React, { useEffect } from "react";
import "./modal.css";

const Modal = ({
    open,
    title,
    children,
    onClose,
    onSubmit,
    submitLabel = "Save",
    size = "md",
}) => {
    // Close modal on ESC key
    useEffect(() => {
        const esc = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", esc);
        return () => document.removeEventListener("keydown", esc);
    }, [onClose]);

    if (!open) return null;

    return (
        <div className="app-modal-overlay" onClick={onClose}>
            <div
                className={`app-modal app-modal-${size}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="app-modal-header">
                    <h5 className="m-0">{title}</h5>
                    <button className="btn-close" onClick={onClose} />
                </div>

                <div className="app-modal-body">{children}</div>

                <div className="app-modal-footer">
                    <button className="btn btn-light" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={onSubmit}>
                        {submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
