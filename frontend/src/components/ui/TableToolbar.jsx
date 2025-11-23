import React from "react";

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
    categoryOptions = null,
}) => {
    const defaultCategories = ["Food", "Travel", "Health", "Shopping", "Utilities"];
    const categories = Array.isArray(categoryOptions) ? categoryOptions : defaultCategories;
    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            {/* Filters */}
            <div className="d-flex flex-wrap gap-2">
                <input
                    type="date"
                    className="form-control"
                    style={{ width: 150 }}
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />

                <input
                    type="date"
                    className="form-control"
                    style={{ width: 150 }}
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />

                <select
                    className="form-select"
                    style={{ width: 150 }}
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
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                        if (!setFilters || !filters) return;
                        const cleared = Object.keys(filters).reduce((acc, k) => {
                            acc[k] = "";
                            return acc;
                        }, {});
                        setFilters(cleared);
                    }}
                >
                    Clear Filters
                </button>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2 mt-2 mt-md-0">
                {showExport && (
                    <>
                        {onExportPdf && (
                            <button className="btn btn-outline-secondary" onClick={onExportPdf}>
                                Export PDF
                            </button>
                        )}
                        {onExportExcel && (
                            <button className="btn btn-outline-secondary" onClick={onExportExcel}>
                                Export Excel
                            </button>
                        )}
                        {/* legacy single export handler */}
                        {!onExportPdf && !onExportExcel && onExport && (
                            <button className="btn btn-outline-secondary" onClick={onExport}>
                                Export
                            </button>
                        )}
                    </>
                )}
                {showImport && (
                    <button className="btn btn-outline-primary" onClick={onImport}>
                        Import
                    </button>
                )}
                <button className="btn btn-primary" onClick={onAdd}>
                    + Add
                </button>
            </div>
        </div>
    );
};

export default TableToolbar;
