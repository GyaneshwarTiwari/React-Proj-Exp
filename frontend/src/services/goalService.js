import api from "../api/api";

// CREATE goal
export const createGoal = async (data) => {
    const res = await api.post("/goals", data);
    return res.data;
};

// GET all goals
export const getGoals = async () => {
    const res = await api.get("/goals");
    return res.data;
};

// UPDATE goal
export const updateGoal = async (id, data) => {
    const res = await api.put(`/goals/${id}`, data);
    return res.data;
};

// DELETE goal
export const deleteGoal = async (id) => {
    const res = await api.delete(`/goals/${id}`);
    return res.data;
};

// CONTRIBUTE to goal
export const contributeToGoal = async (goalId, data) => {
    const res = await api.post(`/goals/${goalId}/contribute`, data);
    return res.data;
};

// DELETE a contribution
export const deleteContribution = async (goalId, expenseId) => {
    const res = await api.delete(
        `/goals/${goalId}/contribution/${expenseId}`
    );
    return res.data;
};

// GET contributions for a goal
export const getContributions = async (goalId) => {
    const res = await api.get(`/goals/${goalId}/contributions`);
    return res.data;
};
