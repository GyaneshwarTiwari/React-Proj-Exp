// src/pages/Auth/LoginPage.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../contexts/AuthContext";
import "../../styles/auth.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await loginUser(form.email, form.password);
            if (res?.token) {
                login(res.token);
                navigate("/");
            }
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="text-center mb-3">
                    <div className="auth-logo">WealthWise</div>
                </div>

                <h2 className="auth-title text-center">Welcome Back</h2>
                <p className="auth-subtitle text-center mb-4">
                    Log in to access your dashboard
                </p>

                {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control auth-input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control auth-input"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="btn btn-primary auth-btn mt-2">
                        Login
                    </button>
                </form>

                <p className="text-center mt-3 auth-switch">
                    Don’t have an account?{" "}
                    <Link to="/auth/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
