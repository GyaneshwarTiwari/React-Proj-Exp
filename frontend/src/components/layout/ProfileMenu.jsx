// src/components/layout/ProfileMenu.jsx
import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "../../styles/menus.css"; // Shared CSS
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
    const { logout, user } = useContext(AuthContext); // Assuming user object has name/email
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    // Close when clicking outside
    useEffect(() => {
        function handleDown(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleDown);
        return () => document.removeEventListener("mousedown", handleDown);
    }, []);

    // Mock user data if not available in context yet
    const userName = user?.name || "User";
    const userEmail = user?.email || "Manage your account";

    return (
        <div className="position-relative" ref={wrapperRef}>
            <button
                aria-expanded={open}
                aria-label="Profile menu"
                className="menu-trigger-btn"
                onClick={() => setOpen((s) => !s)}
            >
                <i className="bi bi-person-circle" style={{ fontSize: "1.5rem" }}></i>
            </button>

            {open && (
                <div className="dropdown-panel profile-panel">

                    {/* Menu Items */}
                    <div className="py-2">
                        <button className="profile-menu-item" onClick={() => { setOpen(false); navigate('/'); }}>
                            <i className="bi bi-speedometer2"></i>
                            Dashboard
                        </button>

                        <button className="profile-menu-item" onClick={() => { setOpen(false); navigate('/reset-password'); }}>
                            <i className="bi bi-shield-lock"></i>
                            Reset Password
                        </button>

                        <div className="my-1 border-top border-light"></div>

                        <button className="profile-menu-item text-danger" onClick={logout}>
                            <i className="bi bi-box-arrow-right text-danger"></i>
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;