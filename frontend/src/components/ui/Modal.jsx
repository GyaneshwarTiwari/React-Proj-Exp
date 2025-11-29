import React, { useEffect } from 'react';

const Modal = ({ open, onClose, onSubmit, title, submitLabel = "Save", children }) => {
    // Prevent scrolling on the body when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1050 }}
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                style={{ zIndex: 1055 }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow-lg border-0 rounded-4">
                        <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                            <h5 className="modal-title fw-bold">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body p-4">
                            {children}
                        </div>

                        <div className="modal-footer border-top-0 pt-0 px-4 pb-4">
                            <button
                                type="button"
                                className="btn btn-light rounded-pill px-4"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary rounded-pill px-4"
                                onClick={onSubmit}
                            >
                                {submitLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;