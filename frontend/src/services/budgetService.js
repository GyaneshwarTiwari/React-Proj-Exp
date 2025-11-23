import api from "../api/api";

// CREATE / SET budget
export const createBudget = async (data) => {
    const res = await api.post("/budgets", data);
    return res.data;
};

// GET all budgets
export const getBudgets = async () => {
    const res = await api.get("/budgets");
    return res.data;
};

// UPDATE budget
export const updateBudget = async (id, data) => {
    const res = await api.put(`/budgets/${id}`, data);
    return res.data;
};

// DELETE budget
export const deleteBudget = async (id) => {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
};
