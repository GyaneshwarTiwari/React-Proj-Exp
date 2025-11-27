// src/pages/BudgetsPage.jsx
import React, { useEffect, useState } from "react";
import {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
} from "../services/budgetService";

import BudgetList from "../components/budgets/BudgetList";
import BudgetForm from "../components/budgets/BudgetForm";
import EditBudgetModal from "../components/budgets/EditBudgetModal";

import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/ui/LoadingSpinner";

import { toast } from "react-toastify";

const BudgetsPage = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [budgetToEdit, setBudgetToEdit] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        loadBudgets();
    }, []);

    const loadBudgets = async () => {
        try {
            setLoading(true);
            const data = await getBudgets();
            setBudgets(data.budgets || data);
        } catch (err) {
            const msg = err?.response?.data?.error || err?.message || "Failed to load budgets";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // CREATE
    const handleAddBudget = async (formData) => {
        try {
            const res = await createBudget(formData);
            toast.success("Budget created!");
            if (res?.warning?.exceedsMonthlySavings) {
                toast.warn(res.warning.message || 'Total budgets exceed monthly savings');
            }
            setShowAddModal(false);
            loadBudgets();
        } catch (err) {
            const msg = err?.response?.data?.error || err?.message || "Failed to create budget";
            toast.error(msg);
        }
    };

    // EDIT
    const handleUpdateBudget = async (formData) => {
        try {
            const res = await updateBudget(budgetToEdit._id, formData);
            toast.success("Budget updated!");
            if (res?.warning?.exceedsMonthlySavings) {
                toast.warn(res.warning.message || 'Total budgets exceed monthly savings');
            }
            setShowEditModal(false);
            loadBudgets();
        } catch (err) {
            const msg = err?.response?.data?.error || err?.message || "Failed to update budget";
            toast.error(msg);
        }
    };

    // DELETE
    const handleDeleteBudget = async () => {
        try {
            await deleteBudget(deleteId);
            toast.success("Budget deleted!");
            setDeleteId(null);
            loadBudgets();
        } catch (err) {
            const msg = err?.response?.data?.error || err?.message || "Failed to delete";
            toast.error(msg);
        }
    };

    return (
        <div className="container-max py-4">
            <div className="d-flex justify-content-between mb-3">
                <h3 className="fw-bold">Budgets</h3>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    + Add Budget
                </button>
            </div>

            {loading && <LoadingSpinner />}

            {!loading && budgets.length === 0 && (
                <EmptyState title="No budgets added yet">
                    Start by adding a monthly budget category.
                </EmptyState>
            )}

            {!loading && budgets.length > 0 && (
                <BudgetList
                    budgets={budgets}
                    onEdit={(b) => {
                        setBudgetToEdit(b);
                        setShowEditModal(true);
                    }}
                    onDelete={(id) => setDeleteId(id)}
                />
            )}

            {/* Add Budget */}
            {showAddModal && (
                <BudgetForm
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddBudget}
                />
            )}

            {/* Edit Budget */}
            {showEditModal && (
                <EditBudgetModal
                    open={showEditModal}
                    data={budgetToEdit}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleUpdateBudget}
                />
            )}

            {/* Delete Confirm */}
            <ConfirmDialog
                open={Boolean(deleteId)}
                onClose={() => setDeleteId(null)}
                message="Delete this budget?"
                onConfirm={handleDeleteBudget}
            />
        </div>
    );
};

export default BudgetsPage;
