import React from "react";
import LandingHero from "../components/layout/LandingHero";
import "../styles/landing.css";

const LandingPage = () => {
    return (
        <div style={{ background: "var(--color-bg)" }}>
            <LandingHero />

            {/* FEATURES SECTION */}
            <section id="features" className="py-5">
                <div className="container-max text-center">
                    <h2 className="fw-semibold mb-4">Why Choose WealthWise?</h2>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="app-card">
                                <h5 className="fw-semibold">Smart Expense Tracking</h5>
                                <p className="text-muted">
                                    Categorize expenses automatically and understand your spending instantly.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="app-card">
                                <h5 className="fw-semibold">Goal-Based Saving</h5>
                                <p className="text-muted">
                                    Set financial goals and monitor progress with intelligent insights.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="app-card">
                                <h5 className="fw-semibold">Analytics Dashboard</h5>
                                <p className="text-muted">
                                    Visual charts showing trends, categories, and real-time savings progress.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="py-5 bg-surface">
                <div className="container-max text-center">
                    <h2 className="fw-semibold mb-3">Built for Modern Finances</h2>
                    <p style={{ maxWidth: "700px", margin: "0 auto", color: "var(--color-muted)" }}>
                        WealthWise helps you transform the way you think about money—track your expenses,
                        analyze habits, and plan a financially healthy future with ease.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
