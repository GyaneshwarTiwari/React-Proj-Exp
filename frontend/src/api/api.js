import axios from "axios";

const API_BASE =
    process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1";

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

// Auto attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (err) => Promise.reject(err)
);

// Auto logout on 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/auth/login";
        }
        return Promise.reject(err);
    }
);

export default api;