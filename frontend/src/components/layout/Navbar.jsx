// src/components/layout/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import NotificationMenu from "./NotificationMenu";
import "./navbar.css";

const Navbar = ({ onToggleSidebar }) => {
    const location = useLocation();

    return (
        <nav className="app-navbar shadow-sm">
            <div className="container-max d-flex align-items-center justify-content-between py-3">
                {/* Left: hamburger (mobile) + logo */}
                <div className="d-flex align-items-center gap-3">
                    {/* Hamburger for small screens */}
                    <button
                        className="btn btn-sm d-md-none"
                        aria-label="Toggle sidebar"
                        onClick={onToggleSidebar}
                        style={{
                            background: "transparent",
                            border: "none",
                            fontSize: 20,
                            color: "var(--color-muted)",
                        }}
                    >
                        <i className="bi bi-list"></i>
                    </button>

                    <Link to="/" className="navbar-logo">
                        <h3 className="m-0 fw-bold" style={{ color: "var(--color-primary)" }}>
                            WealthWise
                        </h3>
                    </Link>
                </div>

                {/* CENTER NAV LINKS (hidden on small) */}
                <div className="d-none d-md-flex gap-4 nav-links-center">
                    <Link to="/" className={`nav-link-app ${location.pathname === "/" ? "active" : ""}`}>Dashboard</Link>
                    <Link to="/expenses" className={`nav-link-app ${location.pathname === "/expenses" ? "active" : ""}`}>Expenses</Link>
                    <Link to="/income" className={`nav-link-app ${location.pathname === "/income" ? "active" : ""}`}>Income</Link>
                    <Link to="/goals" className={`nav-link-app ${location.pathname === "/goals" ? "active" : ""}`}>Goals</Link>
                    <Link to="/budgets" className={`nav-link-app ${location.pathname === "/budgets" ? "active" : ""}`}>Budgets</Link>
                </div>

                {/* Right: notifications + profile */}
                <div className="d-flex align-items-center">
                    <NotificationMenu />
                    <ProfileMenu />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
