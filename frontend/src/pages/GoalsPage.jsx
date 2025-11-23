// src/pages/GoalsPage.jsx
import React, { useEffect, useState } from "react";
import {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    deleteContribution,
} from "../services/goalService";

import GoalList from "../components/goals/GoalList";
import GoalForm from "../components/goals/GoalForm";
import EditGoalModal from "../components/goals/EditGoalModal";
import AddContributionModal from "../components/goals/AddContributionModal";
import ContributionListModal from "../components/goals/ContributionListModal";

import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/ui/LoadingSpinner";

import { toast } from "react-toastify";

const GoalsPage = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showContributionModal, setShowContributionModal] = useState(false);
    const [showContributionListModal, setShowContributionListModal] =
        useState(false);

    const [goalToEdit, setGoalToEdit] = useState(null);
    const [goalForContribution, setGoalForContribution] = useState(null);
    const [goalForContributionList, setGoalForContributionList] = useState(null);

    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            setLoading(true);
            const data = await getGoals();
            setGoals(data.goals || data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load goals");
        } finally {
            setLoading(false);
        }
    };

    // CREATE
    const handleAddGoal = async (goalData) => {
        try {
            await createGoal(goalData);
            toast.success("Goal created!");
            setShowAddModal(false);
            loadGoals();
        } catch (err) {
            toast.error("Failed to create goal");
        }
    };

    // UPDATE
    const handleUpdateGoal = async (goalData) => {
        try {
            await updateGoal(goalToEdit._id, goalData);
            toast.success("Goal updated!");
            setShowEditModal(false);
            loadGoals();
        } catch (err) {
            toast.error("Failed to update goal");
        }
    };

    // DELETE
    const handleDeleteGoal = async () => {
        try {
            await deleteGoal(deleteId);
            toast.success("Goal deleted!");
            setDeleteId(null);
            loadGoals();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    // ADD CONTRIBUTION
    const handleContribution = async (amount) => {
        try {
            await contributeToGoal(goalForContribution._id, {
                amount,
                date: new Date().toISOString(),
                category: "Goal Contribution",
                description: "Contribution toward goal",
                transactionType: "contribution",
            });

            toast.success("Contribution added!");
            setShowContributionModal(false);
            loadGoals();
        } catch (err) {
            toast.error("Failed to add contribution");
        }
    };

    // DELETE CONTRIBUTION
    const handleDeleteContribution = async (expenseId) => {
        try {
            await deleteContribution(goalForContributionList._id, expenseId);
            toast.success("Contribution removed!");
            loadGoals();
        } catch (err) {
            toast.error("Failed to remove contribution");
        }
    };

    return (
        <div className="container-max py-4">
            <div className="d-flex justify-content-between mb-3">
                <h3 className="fw-bold">Goals</h3>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    + Add Goal
                </button>
            </div>

            {loading && <LoadingSpinner />}

            {!loading && goals.length === 0 && (
                <EmptyState title="No goals found">Start by creating a goal.</EmptyState>
            )}

            {!loading && goals.length > 0 && (
                <GoalList
                    goals={goals}
                    onEdit={(g) => {
                        setGoalToEdit(g);
                        setShowEditModal(true);
                    }}
                    onDelete={(id) => setDeleteId(id)}
                    onContribute={(g) => {
                        setGoalForContribution(g);
                        setShowContributionModal(true);
                    }}
                    onShowContributions={(g) => {
                        setGoalForContributionList(g);
                        setShowContributionListModal(true);
                    }}
                />
            )}

            {/* Modals */}
            {showAddModal && (
                <GoalForm
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddGoal}
                />
            )}

            {showEditModal && (
                <EditGoalModal
                    open={showEditModal}
                    data={goalToEdit}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleUpdateGoal}
                />
            )}

            {showContributionModal && (
                <AddContributionModal
                    open={showContributionModal}
                    onClose={() => setShowContributionModal(false)}
                    goal={goalForContribution}
                    onSubmit={handleContribution}
                />
            )}

            {showContributionListModal && (
                <ContributionListModal
                    open={showContributionListModal}
                    onClose={() => setShowContributionListModal(false)}
                    goal={goalForContributionList}
                    onDeleteContribution={handleDeleteContribution}
                />
            )}

            <ConfirmDialog
                open={Boolean(deleteId)}
                message="Delete this goal permanently?"
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteGoal}
            />
        </div>
    );
};

export default GoalsPage;
