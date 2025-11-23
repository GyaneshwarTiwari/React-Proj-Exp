import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Validate token on load (optional endpoint)
    useEffect(() => {
        const init = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                // If you add /auth/me in backend, enable below:
                // const res = await api.get("/auth/me");
                // setUser(res.data.user);

                setUser({ isLoggedIn: true }); // basic fallback
            } catch (err) {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [token]);

    const login = (tokenStr) => {
        localStorage.setItem("token", tokenStr);
        setToken(tokenStr);
        setUser({ isLoggedIn: true });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        window.location.href = "/auth/login";
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
