import api from "../api/api";

export const loginUser = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
};

export const signupUser = async (email, password, name) => {
    const res = await api.post("/auth/signup", { email, password, name });
    return res.data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
    const res = await api.patch('/auth/password', { currentPassword, newPassword });
    return res.data;
};
