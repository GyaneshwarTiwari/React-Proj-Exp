// src/App.jsx
import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "./contexts/AuthContext";
import PublicNavbar from "./components/layout/PublicNavbar";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";

import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import IncomePage from "./pages/IncomePage";
import GoalsPage from "./pages/GoalsPage";
import BudgetsPage from "./pages/BudgetsPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const App = () => {
  const auth = useContext(AuthContext);
  const token = auth?.token || null;
  const loading = auth?.loading ?? false;
  const isLoggedIn = Boolean(token);

  // Sidebar open state for small screens
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div>Loading…</div>
      </div>
    );
  }

  return (
    <Router>
      {/* Toast container (global) */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* NAVBAR */}
      {isLoggedIn ? (
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />
      ) : (
        <PublicNavbar />
      )}

      {/* AUTHENTICATED LAYOUT */}
      {isLoggedIn ? (
        <div>
          {/* Mobile Sidebar */}
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content (no margin-left anymore) */}
          <div
            style={{ width: "100%", minHeight: "80vh" }}
            onClick={() => sidebarOpen && setSidebarOpen(false)}
          >
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/income" element={<IncomePage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Routes>
          </div>
        </div>
      ) : (
        // PUBLIC ROUTES
        <div style={{ minHeight: "80vh" }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>
      )}

      <Footer />
    </Router>
  );
};

export default App;
