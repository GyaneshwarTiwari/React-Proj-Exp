// src/components/layout/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar = ({ open = false, onClose = () => { } }) => {
    const location = useLocation();

    const links = [
        { label: "Dashboard", to: "/" },
        { label: "Expenses", to: "/expenses" },
        { label: "Income", to: "/income" },
        { label: "Goals", to: "/goals" },
        { label: "Budgets", to: "/budgets" },
    ];

    return (
        <>
            {/* Mobile-only sidebar overlay */}
            <div
                className={`mobile-sidebar-overlay ${open ? "open" : ""}`}
                onClick={onClose}
            >
                <nav
                    className="mobile-sidebar"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mobile-sidebar-close">
                        <button className="btn btn-sm" onClick={onClose}>
                            ✕
                        </button>
                    </div>

                    <div className="mobile-links">
                        {links.map((item, i) => (
                            <Link
                                key={i}
                                to={item.to}
                                className={`mobile-link ${location.pathname === item.to ? "active" : ""
                                    }`}
                                onClick={onClose}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
