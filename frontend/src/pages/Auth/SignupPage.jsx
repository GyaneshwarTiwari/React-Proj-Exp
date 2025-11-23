// src/pages/Auth/SignupPage.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser, loginUser } from "../../services/authService";
import { AuthContext } from "../../contexts/AuthContext";
import "../../styles/auth.css";

const SignupPage = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await signupUser(form.email, form.password, form.name);
            if (res?.message === "User registered successfully") {
                // login instantly
                const loginRes = await loginUser(form.email, form.password);
                login(loginRes.token);
                navigate("/");
            }
        } catch (err) {
            setError("Could not create account. Try again.");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="text-center mb-3">
                    <div className="auth-logo">WealthWise</div>
                </div>

                <h2 className="auth-title text-center">Create Account</h2>
                <p className="auth-subtitle text-center mb-4">
                    Start your financial journey today
                </p>

                {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control auth-input"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-3 auth-switch">
                    Already have an account?{" "}
                    <Link to="/auth/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
