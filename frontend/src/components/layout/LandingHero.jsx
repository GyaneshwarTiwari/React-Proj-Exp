import React from "react";
import { Link } from "react-router-dom";

const LandingHero = () => {
    return (
        <section className="landing-hero py-5">
            <div className="container-max text-center py-5">

                <h1 className="fw-bold" style={{ fontSize: "3rem", color: "var(--color-primary)" }}>
                    Take Control of Your Money
                </h1>

                <p className="mt-3 mb-4" style={{ fontSize: "1.25rem", color: "var(--color-muted)" }}>
                    Track your daily expenses, plan budgets, reach your goals, and transform your financial life.
                </p>

                <div className="d-flex justify-content-center gap-3">
                    <Link to="/auth/signup" className="btn btn-primary px-4 py-2">
                        Get Started
                    </Link>
                    <Link to="/auth/login" className="btn btn-outline-primary px-4 py-2">
                        Login
                    </Link>
                </div>

                {/* Illustration */}
                <img
                    src="https://cdn.dribbble.com/users/331265/screenshots/14737191/media/8e80139df052404c1e51a140f64e5683.png"
                    alt="Dashboard preview"
                    className="img-fluid mt-5 hero-image"
                />
            </div>
        </section>
    );
};

export default LandingHero;
