// src/pages/IncomePage.jsx
import React, { useEffect, useState } from "react";
import {
    getIncome,
    addIncome,
    updateIncome,
    deleteIncome,
} from "../services/incomeService";

import TableToolbar from "../components/ui/TableToolbar";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import IncomeForm from "../components/income/IncomeForm";
import EditIncomeModal from "../components/income/EditIncomeModal";

import { toast } from "react-toastify";

const IncomePage = () => {
    const [incomeList, setIncomeList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editIncomeData, setEditIncomeData] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        category: "",
    });

    useEffect(() => {
        loadIncome();
    }, [filters]);

    const loadIncome = async () => {
        try {
            setLoading(true);
            const data = await getIncome(filters);
            setIncomeList(data.income || data); // backend returns { income: [...] }
        } catch (err) {
            toast.error("Failed to load income");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // CREATE
    const handleAddIncome = async (formData) => {
        try {
            await addIncome(formData);
            toast.success("Income added!");
            setShowAddModal(false);
            loadIncome();
        } catch (err) {
            toast.error("Failed to add income");
        }
    };

    // UPDATE
    const handleUpdateIncome = async (formData) => {
        try {
            await updateIncome(editIncomeData._id, formData);
            toast.success("Income updated!");
            setShowEditModal(false);
            loadIncome();
        } catch (err) {
            toast.error("Failed to update");
        }
    };

    // DELETE
    const handleDelete = async () => {
        try {
            await deleteIncome(deleteId);
            toast.success("Income deleted!");
            setDeleteId(null);
            loadIncome();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="container-max py-4">
            <h3 className="fw-bold mb-4">Income</h3>

            {/* Toolbar */}
            <TableToolbar
                onAdd={() => setShowAddModal(true)}
                filters={filters}
                setFilters={setFilters}
                categoryOptions={["Salary", "Freelancing", "Bonus", "Interest", "Gift", "Other"]}
                showImport={false}
                showExport={false}
            />

            {loading && <LoadingSpinner />}

            {/* Empty State */}
            {!loading && incomeList.length === 0 && (
                <EmptyState title="No income added yet">
                    Start by adding your income source.
                </EmptyState>
            )}

            {/* Table */}
            {!loading && incomeList.length > 0 && (
                <div className="table-responsive app-card p-3">
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Source</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th style={{ width: 120 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomeList.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.date?.split("T")[0]}</td>
                                    <td>{item.description}</td>
                                    <td>{item.category}</td>
                                    <td>₹{item.amount}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => {
                                                setEditIncomeData(item);
                                                setShowEditModal(true);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => setDeleteId(item._id)}
                                        >
                                            Del
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Income Modal */}
            {showAddModal && (
                <IncomeForm
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddIncome}
                />
            )}

            {/* Edit Income Modal */}
            {showEditModal && (
                <EditIncomeModal
                    open={showEditModal}
                    data={editIncomeData}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleUpdateIncome}
                />
            )}

            {/* Confirm Delete */}
            <ConfirmDialog
                open={Boolean(deleteId)}
                onClose={() => setDeleteId(null)}
                message="Delete this income entry?"
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default IncomePage;
