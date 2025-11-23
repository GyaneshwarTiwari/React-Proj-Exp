// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";

import SummaryCards from "../components/dashboard/SummaryCards";
import MonthlyTrendChart from "../components/dashboard/MonthlyTrendChart";
import CategoryPieChart from "../components/dashboard/CategoryPieChart";
import CategoryBarChart from "../components/dashboard/CategoryBarChart";
import GoalsProgressCards from "../components/dashboard/GoalsProgressCards";
import ContributionsPieChart from "../components/dashboard/ContributionsPieChart";
import RecentActivity from "../components/dashboard/RecentActivity";

import "../styles/dashboard.css";

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const now = new Date();
    const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

    useEffect(() => {
        loadDashboard(selectedMonth);
    }, [selectedMonth]);

    const loadDashboard = async (monthStr) => {
        setLoading(true);
        try {
            let params = {};
            if (monthStr) {
                const [y, m] = monthStr.split('-');
                params.month = Number(m);
                params.year = Number(y);
            }
            const res = await api.get("/dashboard", { params });
            setData(res.data);
        } catch (err) {
            console.error("Dashboard load error", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4">Loading dashboard…</div>;
    if (!data) return <div className="p-4">No data</div>;

    // Map backend fields to the props our components expect
    const totals = data.summary; // backend returns 'summary'
    const months = data.months; // array of labels
    const monthlyTrend = data.monthlyTrend; // { expenses:[], income:[], contributions:[] }
    const expensesByCategory = data.expensesByCategory; // array of { _id, total }
    const contributionsByGoal = data.contributionsByGoal; // array { title, total }
    const goals = data.goals || [];
    const recentExpenses = data.recentTransactions || [];
    const recentContributions = data.recentContributions || [];

    return (
        <div className="container-max py-4">

            <div className="d-flex align-items-center mb-3">
                <label className="me-2 small text-muted">Month</label>
                <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
            </div>

            {/* Summary Cards */}
            <SummaryCards totals={totals} />

            {/* Monthly Trend Chart */}
            <div className="app-card mb-4">
                <h5 className="fw-semibold mb-3">Monthly Trend</h5>
                <MonthlyTrendChart months={months} trend={monthlyTrend} />
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <div className="app-card dashboard-chart-container">
                        <div style={{ width: '100%', height: '100%' }}>
                            <h5 className="fw-semibold mb-3">Category Distribution</h5>
                            <CategoryPieChart data={expensesByCategory} />
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="app-card dashboard-chart-container">
                        <div style={{ width: '100%', height: '100%' }}>
                            <h5 className="fw-semibold mb-3">Category Spend (Bar)</h5>
                            <CategoryBarChart data={expensesByCategory} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Goals */}
            <div className="app-card mb-4">
                <h5 className="fw-semibold mb-3">Goal Progress</h5>
                <GoalsProgressCards goals={goals} />
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="app-card">
                        <h5 className="fw-semibold mb-3">Contributions Overview</h5>
                        <ContributionsPieChart data={contributionsByGoal} />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="app-card">
                        <h5 className="fw-semibold mb-3">Recent Activity</h5>
                        <RecentActivity
                            expenses={recentExpenses}
                            contributions={recentContributions}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;
