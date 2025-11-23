import api from "../api/api";

export const addIncome = async (data) => {
    const res = await api.post("/income", data);
    return res.data;
};

export const getIncome = async (params = {}) => {
    const res = await api.get("/income", { params });
    return res.data;
};

export const updateIncome = async (id, data) => {
    const res = await api.put(`/income/${id}`, data);
    return res.data;
};

export const deleteIncome = async (id) => {
    const res = await api.delete(`/income/${id}`);
    return res.data;
};
