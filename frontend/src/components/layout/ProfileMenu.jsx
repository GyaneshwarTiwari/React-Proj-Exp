// src/components/layout/ProfileMenu.jsx
import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "./profileMenu.css";
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
    const { logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    // Close when clicking outside or pressing Escape
    useEffect(() => {
        function handleDown(e) {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        function handleKey(e) {
            if (e.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handleDown);
        document.addEventListener("touchstart", handleDown);
        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("mousedown", handleDown);
            document.removeEventListener("touchstart", handleDown);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    return (
        <div className="profile-menu-wrapper" ref={wrapperRef}>
            <button
                aria-expanded={open}
                aria-label="Profile menu"
                className="profile-icon btn-reset"
                onClick={() => setOpen((s) => !s)}
            >
                <i className="bi bi-person-circle" aria-hidden style={{ fontSize: "1.5rem" }}></i>
            </button>

            {open && (
                <div className="profile-dropdown shadow-sm" role="menu">

                    <button className="dropdown-item" onClick={() => { setOpen(false); navigate('/reset-password'); }}>
                        Reset Password
                    </button>
                    <button
                        className="dropdown-item text-danger fw-semibold"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
