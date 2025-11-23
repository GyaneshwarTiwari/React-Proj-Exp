import React from "react";
import { Link } from "react-router-dom";
import "./PublicNavbar.css"; // optional, but good for styling

const PublicNavbar = () => {
    return (
        <nav className="public-navbar shadow-sm">
            <div className="container-max d-flex align-items-center justify-content-between py-3">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <h3 className="m-0 fw-bold" style={{ color: "var(--color-primary)" }}>
                        WealthWise
                    </h3>
                </Link>

                {/* Nav Links (center, but optional) */}
                <div className="d-none d-md-flex gap-4">
                    <a href="#features" className="public-nav-link">Features</a>
                    <a href="#howitworks" className="public-nav-link">How it works</a>
                    <a href="#about" className="public-nav-link">About</a>
                </div>

                {/* Auth buttons */}
                <div className="d-flex gap-2">
                    <Link to="/auth/login" className="btn btn-outline-primary px-3">
                        Login
                    </Link>
                    <Link to="/auth/signup" className="btn btn-primary px-3">
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
