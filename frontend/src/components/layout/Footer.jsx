import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const location = useLocation();

    // Helper to scroll to section if on home page, or just link to home
    const isHome = location.pathname === '/';

    return (
        <footer className="footer-section pt-5 pb-3 mt-auto">
            <div className="container">
                <div className="row g-4 mb-4">
                    {/* Column 1: Brand & Tagline */}
                    <div className="col-md-5">
                        <Link to="/" className="text-decoration-none">
                            <h5 className="footer-brand mb-3">WealthWise</h5>
                        </Link>
                        <p className="text-muted" style={{ maxWidth: '350px', lineHeight: '1.6' }}>
                            Master your money with simple budgeting, goal tracking, and powerful insights.
                            Your financial freedom starts here.
                        </p>
                    </div>

                    {/* Column 2: Navigation (Only real links) */}
                    <div className="col-md-3 col-6">
                        <h6 className="footer-heading">Navigation</h6>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="footer-link">Home</Link></li>
                            {/* Anchor links work best if you are already on the landing page */}
                            {isHome ? (
                                <>
                                    <li><a href="#features" className="footer-link">Features</a></li>
                                    <li><a href="#about" className="footer-link">About Us</a></li>
                                </>
                            ) : (
                                <li><Link to="/" className="footer-link">Features</Link></li>
                            )}
                            <li><Link to="/auth/login" className="footer-link">Login</Link></li>
                            <li><Link to="/auth/signup" className="footer-link">Create Account</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Social Media (Replaced Newsletter) */}
                    <div className="col-md-4 col-6">
                        <h6 className="footer-heading">Connect with us</h6>
                        <p className="small text-muted mb-3">
                            Follow us for updates and financial tips.
                        </p>
                        <div className="d-flex gap-2">
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon-box">
                                <i className="bi bi-github"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-box">
                                <i className="bi bi-twitter-x"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-box">
                                <i className="bi bi-linkedin"></i>
                            </a>
                            <a href="mailto:support@wealthwise.com" className="social-icon-box">
                                <i className="bi bi-envelope-fill"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <hr className="my-4" style={{ borderColor: '#e2e8f0' }} />

                {/* Bottom Bar */}
                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start">
                        <p className="small text-muted mb-0">
                            &copy; {currentYear} WealthWise. All rights reserved.
                        </p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <p className="small text-muted mb-0">
                            Designed for modern finance.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;