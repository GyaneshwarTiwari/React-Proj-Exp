// src/pages/ExpensesPage.jsx
import React, { useEffect, useState } from "react";
import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    importExpenses,
    exportExpenses,
} from "../services/expenseService";

import TableToolbar from "../components/ui/TableToolbar";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ExpenseForm from "../components/expenses/ExpenseForm";
import EditExpenseModal from "../components/expenses/EditExpenseModal";
import ImportExpenseModal from "../components/expenses/ImportExpenseModal";

import { toast } from "react-toastify";

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals & State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editExpenseData, setEditExpenseData] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        category: "",
    });

    useEffect(() => {
        loadExpenses();
    }, [filters]);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const data = await getExpenses(filters);
            setExpenses(data.expenses || data); // backend returns { expenses: [...] }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    // CREATE
    const handleAddExpense = async (formData) => {
        try {
            const res = await createExpense(formData);
            toast.success("Expense added!");
            // If backend signals budget exceeded, show a warning toast with details
            const budgetCheck = res?.budgetCheck;
            if (budgetCheck && budgetCheck.exceeded) {
                const spent = budgetCheck.spent || 0;
                const limit = budgetCheck.budget || 0;
                toast.warn(`Budget exceeded for ${formData.category}: ₹${spent} of ₹${limit}`);
            }
            setShowAddModal(false);
            loadExpenses();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add expense");
        }
    };

    // UPDATE
    const handleUpdateExpense = async (formData) => {
        try {
            await updateExpense(editExpenseData._id, formData);
            toast.success("Expense updated!");
            setShowEditModal(false);
            loadExpenses();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update expense");
        }
    };

    // DELETE
    const handleDelete = async () => {
        try {
            await deleteExpense(deleteId);
            toast.success("Expense deleted!");
            setDeleteId(null);
            loadExpenses();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    // IMPORT
    const handleImport = async (bankId) => {
        try {
            await importExpenses(bankId);
            toast.success("Expenses imported!");
            setShowImportModal(false);
            loadExpenses();
        } catch (err) {
            toast.error("Import failed");
        }
    };

    // EXPORT
    const handleExport = async () => {
        try {
            const res = await exportExpenses("excel");
            const blob = new Blob([res.data], { type: res.headers["content-type"] });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "expenses.xlsx";
            a.click();

            toast.success("Exported successfully!");
        } catch (err) {
            toast.error("Export failed");
        }
    };

    const handleExportExcel = async () => {
        try {
            const res = await exportExpenses("excel");
            const blob = new Blob([res.data], { type: res.headers["content-type"] });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "expenses.xlsx";
            a.click();

            toast.success("Excel exported successfully!");
        } catch (err) {
            toast.error("Excel export failed");
        }
    };

    const handleExportPdf = async () => {
        try {
            const res = await exportExpenses("pdf");
            const blob = new Blob([res.data], { type: res.headers["content-type"] });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "expenses.pdf";
            a.click();

            toast.success("PDF exported successfully!");
        } catch (err) {
            toast.error("PDF export failed");
        }
    };

    return (
        <div className="container-max py-4">
            <h3 className="fw-bold mb-4">Expenses</h3>

            {/* Toolbar */}
            <TableToolbar
                onAdd={() => setShowAddModal(true)}
                onImport={() => setShowImportModal(true)}
                onExportPdf={handleExportPdf}
                onExportExcel={handleExportExcel}
                filters={filters}
                setFilters={setFilters}
                showImport={true}
            />

            {/* Loading */}
            {loading && <LoadingSpinner />}

            {/* Empty State */}
            {!loading && expenses.length === 0 && (
                <EmptyState title="No expenses found">
                    Start by adding your first expense.
                </EmptyState>
            )}

            {/* Table */}
            {!loading && expenses.length > 0 && (
                <div className="table-responsive app-card p-3">
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th style={{ width: "120px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((exp) => (
                                <tr key={exp._id}>
                                    <td>{exp.date?.split("T")[0]}</td>
                                    <td>{exp.category}</td>
                                    <td>{exp.description}</td>
                                    <td>₹{exp.amount}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => {
                                                setEditExpenseData(exp);
                                                setShowEditModal(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => setDeleteId(exp._id)}
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

            {/* Modals */}
            {showAddModal && (
                <ExpenseForm
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddExpense}
                />
            )}

            {showEditModal && (
                <EditExpenseModal
                    open={showEditModal}
                    data={editExpenseData}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleUpdateExpense}
                />
            )}

            {showImportModal && (
                <ImportExpenseModal
                    open={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onSubmit={handleImport}
                />
            )}

            {/* Delete Confirm */}
            <ConfirmDialog
                open={Boolean(deleteId)}
                onClose={() => setDeleteId(null)}
                message="Delete this expense permanently?"
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default ExpensesPage;
