import React from "react";

const Footer = () => {
    return (
        <footer
            className="mt-auto py-3"
            style={{
                background: "var(--color-surface)",
                borderTop: "1px solid rgba(0,0,0,0.05)",
            }}
        >
            <div className="container-max text-center">
                <p className="text-muted m-0">
                    © {new Date().getFullYear()} WealthWise — Manage Smarter.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
