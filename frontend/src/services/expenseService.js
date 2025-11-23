import api from "../api/api";

// CREATE expense
export const createExpense = async (expenseData) => {
    const res = await api.post("/expenses", expenseData);
    return res.data;
};

// GET all expenses (with optional filters)
export const getExpenses = async (params = {}) => {
    const res = await api.get("/expenses", { params });
    return res.data;
};

// UPDATE an expense
export const updateExpense = async (id, data) => {
    const res = await api.put(`/expenses/${id}`, data);
    return res.data;
};

// DELETE an expense
export const deleteExpense = async (id) => {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
};

// IMPORT expenses from bank
export const importExpenses = async (bankAccountId) => {
    const res = await api.post("/expenses/import", {
        bank_account_id: bankAccountId,
    });
    return res.data;
};

// EXPORT expenses as PDF or Excel
export const exportExpenses = async (type = "excel") => {
    const res = await api.get(`/export?type=${type}`, {
        responseType: "blob",
    });
    return res;
};


