// src/components/ui/TableToolbar.jsx
import React, { useState, useRef, useEffect } from "react";

const TableToolbar = ({
    onAdd,
    onImport,
    onExport,
    onExportPdf,
    onExportExcel,
    filters,
    setFilters,
    showImport = false,
    showExport = true,
    showMerchants = true,
    categoryOptions = null,
    merchantOptions = null,
}) => {
    const defaultCategories = ["Food", "Travel", "Health", "Shopping", "Bills", "Entertainment", "Education", "Rent", "Other"];
    const categories = Array.isArray(categoryOptions) ? categoryOptions : defaultCategories;

    const defaultMerchants = [
        "Amazon", "Flipkart", "Uber", "Ola", "Zomato", "Swiggy",
        "Starbucks", "McDonalds", "KFC", "Dominos",
        "Netflix", "Spotify", "Apple", "Google",
        "Shell", "Indian Oil", "Reliance Smart", "D-Mart",
        "Apollo Pharmacy", "Local Vendor"
    ];
    const merchants = Array.isArray(merchantOptions) ? merchantOptions : defaultMerchants;

    // State for Export Dropdown
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-3">
            {/* Filters Section */}
            <div className="d-flex flex-wrap gap-2">
                {/* Start Date */}
                <div className="input-group" style={{ width: 160 }}>
                    <span className="input-group-text bg-white text-muted">
                        <i className="bi bi-calendar"></i>
                    </span>
                    <input
                        type={filters.startDate ? "date" : "text"}
                        placeholder="Start Date"
                        className="form-control border-start-0 ps-0"
                        value={filters.startDate}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => {
                            if (!filters.startDate) e.target.type = "text";
                        }}
                        onChange={(e) =>
                            setFilters({ ...filters, startDate: e.target.value })
                        }
                    />
                </div>

                {/* End Date */}
                <div className="input-group" style={{ width: 160 }}>
                    <span className="input-group-text bg-white text-muted">
                        <i className="bi bi-calendar"></i>
                    </span>
                    <input
                        type={filters.endDate ? "date" : "text"}
                        placeholder="End Date"
                        className="form-control border-start-0 ps-0"
                        value={filters.endDate}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => {
                            if (!filters.endDate) e.target.type = "text";
                        }}
                        onChange={(e) =>
                            setFilters({ ...filters, endDate: e.target.value })
                        }
                    />
                </div>

                {/* Category Filter */}
                <select
                    className="form-select"
                    style={{ width: 160 }}
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                {/* Merchant Filter (Conditional) */}
                {showMerchants && (
                    <select
                        className="form-select"
                        style={{ width: 160 }}
                        value={filters.merchant}
                        onChange={(e) => setFilters({ ...filters, merchant: e.target.value })}
                    >
                        <option value="">All Merchants</option>
                        {merchants.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                )}

                {/* Clear Filters Button */}
                <button
                    className="btn btn-light text-muted border"
                    title="Clear Filters"
                    onClick={() => {
                        if (!setFilters || !filters) return;
                        const cleared = Object.keys(filters).reduce((acc, k) => {
                            acc[k] = "";
                            return acc;
                        }, {});
                        setFilters(cleared);
                    }}
                >
                    <i className="bi bi-x-lg"> Clear Filters</i>
                </button>
            </div>

            {/* Actions Section */}
            <div className="d-flex gap-2">
                {showExport && (
                    <div className="btn-group" ref={dropdownRef}>
                        <button
                            type="button"
                            className="btn btn-outline-secondary dropdown-toggle"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-expanded={dropdownOpen}
                        >
                            <i className="bi bi-download me-2"></i>Export
                        </button>

                        {/* React Controlled Dropdown */}
                        <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`} style={{ right: 0, left: 'auto' }}>
                            {onExportPdf && (
                                <li>
                                    <button className="dropdown-item" onClick={() => { onExportPdf(); setDropdownOpen(false); }}>
                                        <i className="bi bi-file-earmark-pdf me-2 text-danger"></i>As PDF
                                    </button>
                                </li>
                            )}
                            {onExportExcel && (
                                <li>
                                    <button className="dropdown-item" onClick={() => { onExportExcel(); setDropdownOpen(false); }}>
                                        <i className="bi bi-file-earmark-spreadsheet me-2 text-success"></i>As Excel
                                    </button>
                                </li>
                            )}
                            {!onExportPdf && !onExportExcel && onExport && (
                                <li>
                                    <button className="dropdown-item" onClick={() => { onExport(); setDropdownOpen(false); }}>
                                        Export File
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {showImport && (
                    <button className="btn btn-outline-primary" onClick={onImport}>
                        <i className="bi bi-cloud-upload me-2"></i>Import
                    </button>
                )}

                <button className="btn btn-primary" onClick={onAdd}>
                    <i className="bi bi-plus-lg me-2"></i>Add
                </button>
            </div>
        </div>
    );
};

export default TableToolbar;