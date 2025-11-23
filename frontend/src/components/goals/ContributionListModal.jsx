import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { getContributions } from "../../services/goalService";

const ContributionListModal = ({ open, onClose, goal, onDeleteContribution }) => {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        const load = async () => {
            try {
                setLoading(true);
                if (!goal || !goal._id) {
                    setContributions([]);
                    return;
                }
                const res = await getContributions(goal._id);
                setContributions(res.contributions || []);
            } catch (err) {
                console.error('Failed to load contributions', err);
                setContributions([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [open, goal]);

    return (
        <Modal open={open} onClose={onClose} onSubmit={onClose} title="Contribution History" submitLabel="Close">
            {loading && <p>Loading…</p>}
            {!loading && contributions.length === 0 && <p>No contributions yet.</p>}

            {!loading && contributions.length > 0 && (
                <ul className="list-group">
                    {contributions.map((c) => (
                        <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>₹{c.amount}</strong>
                                <div className="small text-muted">{new Date(c.date).toISOString().split("T")[0]}</div>
                            </div>

                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={async () => {
                                    try {
                                        // await parent's delete handler
                                        await onDeleteContribution(c._id);
                                        // refresh contributions list
                                        const res = await getContributions(goal._id);
                                        setContributions(res.contributions || []);
                                    } catch (err) {
                                        console.error('Failed to delete contribution', err);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </Modal>
    );
};

export default ContributionListModal;
