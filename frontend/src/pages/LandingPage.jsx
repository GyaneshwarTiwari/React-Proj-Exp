import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";
import dashimg from '../assets/dashboard.png'
const LandingPage = () => {
    return (
        <div className="landing-wrapper" style={{ overflowX: 'hidden' }}>
            {/* HERO SECTION */}
            <section className="hero-section">
                {/* Background Blobs for ambient color */}
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>

                <div className="container position-relative">
                    <div className="row align-items-center">
                        <div className="col-lg-6 hero-content">
                            <span className="badge bg-light text-primary mb-3 px-3 py-2 rounded-pill fw-bold shadow-sm">
                                🚀 #1 Personal Finance Tool
                            </span>
                            <h1 className="hero-title">
                                Master your money,<br />
                                Design your future.
                            </h1>
                            <p className="hero-subtitle">
                                Stop wondering where your money went. WealthWise gives you
                                the power to track expenses, set smart goals, and visualize
                                your path to financial freedom.
                            </p>
                            <div className="d-flex gap-3">
                                <Link to="/auth/signup" className="btn btn-primary-custom shadow text-white">
                                    Get Started Free
                                </Link>
                                <a href="#features" className="btn btn-outline-custom">
                                    Explore Features
                                </a>
                            </div>
                            <div className="mt-4 pt-3 d-flex align-items-center gap-3">
                                <div className="d-flex">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} style={{
                                            width: 35, height: 35, borderRadius: '50%',
                                            background: '#ddd', border: '2px solid white',
                                            marginLeft: i > 1 ? -10 : 0,
                                            backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                                            backgroundSize: 'cover'
                                        }} />
                                    ))}
                                </div>
                                <span className="text-muted small fw-medium">Trusted by 10,000+ users</span>
                            </div>
                        </div>

                        {/* Abstract Dashboard Visual */}
                        <div className="col-lg-6">
                            <div className="glass-mockup mx-auto">
                                <div className="mockup-header">
                                    <div className="dot dot-red"></div>
                                    <div className="dot dot-yellow"></div>
                                    <div className="dot dot-green"></div>
                                </div>
                                <div className="mockup-body">
                                    <div className="mockup-sidebar"></div>
                                    <img src={dashimg} alt="dashboard" style={{ height: '100%', width: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-5 bg-white">
                <div className="container py-5">
                    <div className="text-center mb-5" style={{ maxWidth: 700, margin: '0 auto' }}>
                        <h6 className="text-primary fw-bold text-uppercase ls-wide">Features</h6>
                        <h2 className="fw-bold display-6 mb-3">Everything you need to grow</h2>
                        <p className="text-muted">Simple yet powerful tools designed to help you make better financial decisions every single day.</p>
                    </div>

                    <div className="row g-4">
                        {/* Feature 1 */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="icon-box icon-blue">
                                    <i className="bi bi-pie-chart-fill"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Smart Analytics</h4>
                                <p className="text-muted">
                                    Visualize your spending habits with intuitive pie charts and monthly trend lines. See exactly where every rupee goes.
                                </p>
                            </div>
                        </div>
                        {/* Feature 2 */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="icon-box icon-purple">
                                    <i className="bi bi-bullseye"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Goal Tracking</h4>
                                <p className="text-muted">
                                    Saving for a car or a vacation? Set a target, track contributions, and see your progress bar fill up in real-time.
                                </p>
                            </div>
                        </div>
                        {/* Feature 3 */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="icon-box icon-green">
                                    <i className="bi bi-shield-check"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Budget Controls</h4>
                                <p className="text-muted">
                                    Set monthly limits for specific categories. Get instant alerts via notifications when you are about to overspend.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-5" id="howitworks" style={{ background: '#f8fafc' }}>
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-5 mb-4 mb-lg-0">
                            <h2 className="fw-bold display-6 mb-4">Start your journey in <br /><span className="text-primary">3 simple steps</span></h2>
                            <p className="text-muted mb-4">You don't need to be a finance expert. WealthWise makes the complex simple.</p>
                            <Link to="/auth/signup" className="btn btn-primary btn-lg rounded-pill px-4">Create Account</Link>
                        </div>
                        <div className="col-lg-7">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="bg-white p-4 rounded-4 shadow-sm text-center h-100">
                                        <div className="display-4 fw-bold text-primary opacity-25 mb-3">01</div>
                                        <h5 className="fw-bold">Sign Up</h5>
                                        <p className="small text-muted">Create your secure account in less than 30 seconds.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="bg-white p-4 rounded-4 shadow-sm text-center h-100 mt-md-4">
                                        <div className="display-4 fw-bold text-primary opacity-25 mb-3">02</div>
                                        <h5 className="fw-bold">Add Data</h5>
                                        <p className="small text-muted">Log your income and daily expenses easily.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="bg-white p-4 rounded-4 shadow-sm text-center h-100 mt-md-5">
                                        <div className="display-4 fw-bold text-primary opacity-25 mb-3">03</div>
                                        <h5 className="fw-bold">Analyze</h5>
                                        <p className="small text-muted">View insights and optimize your savings.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-5">
                <div className="container py-4">
                    <div className="bg-primary text-white rounded-5 p-5 text-center position-relative overflow-hidden">
                        {/* Decorative Circle */}
                        <div className="position-absolute top-0 start-0 translate-middle rounded-circle bg-white opacity-10" style={{ width: 300, height: 300 }}></div>

                        <div className="position-relative z-1">
                            <h2 className="fw-bold mb-3">Ready to take control?</h2>
                            <p className="mb-4 opacity-75 fs-5">Join thousands of users managing their wealth wisely.</p>
                            <Link to="/auth/signup" className="btn btn-light text-primary rounded-pill px-5 py-3 fw-bold shadow hover-lift">
                                Get Started Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;