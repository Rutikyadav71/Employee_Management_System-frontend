import React, { useEffect, useRef, useState } from "react";
import {
  getEmployees,
  deleteEmployee,
  searchEmployees,
  deleteMultipleEmployees,
} from "../services/EmployeeService.js";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fadeKey, setFadeKey] = useState(0); 

  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const response = await getEmployees();
    setEmployees(response.data);
    setSelectedIds([]);
    setSelectAll(false);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim() === "") {
        loadEmployees();
      } else {
        setLoading(true);
        searchEmployees(searchTerm)
          .then((res) => {
            setEmployees(res.data);
            setFadeKey((k) => k + 1); 
          })
          .catch((err) => console.error("Search failed:", err))
          .finally(() => setLoading(false));
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Ctrl + F → focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDelete = async (empId) => {
    try {
      await deleteEmployee(empId);
      loadEmployees();
    } catch (err) {
      console.error("Failed to delete employee:", err);
    }
  };

  const toggleSelect = (empId) => {
    if (selectedIds.includes(empId)) {
      setSelectedIds(selectedIds.filter((id) => id !== empId));
    } else {
      setSelectedIds([...selectedIds, empId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(employees.map((emp) => emp.empId));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} selected employees?`)) {
      return;
    }

    try {
      await deleteMultipleEmployees(selectedIds);
      loadEmployees();
    } catch (err) {
      console.error("Bulk delete failed:", err);
    }
  };

  const highlightText = (text) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={i} className="bg-warning text-dark px-1 rounded">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-primary fw-bold mb-0">Employees</h4>

          <input
            ref={searchInputRef}
            type="text"
            className="form-control w-50"
            placeholder="🔍 Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchTerm && !loading && employees.length > 0 && (
          <small key={fadeKey} className="text-muted d-block mb-2 fade-counter">
            {employees.length} result{employees.length !== 1 ? "s" : ""} found
          </small>
        )}

        {searchTerm && !loading && employees.length === 0 && (
          <small className="text-danger d-block mb-2">
            No matching results
          </small>
        )}

        {selectedIds.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-semibold text-warning">
              {selectedIds.length} selected
            </span>

            <button
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              onClick={handleDeleteSelected}
            >
              <FaTrash />
            </button>
          </div>
        )}

        {loading && (
          <div
            className="spinner-border spinner-border-sm text-primary mb-2"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        )}

        <div
          className="table-responsive hide-scrollbar"
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        >
          <table className="table table-hover align-middle">
            <thead className="table-light sticky-top">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>#</th>
                <th>EmployeeId</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.length > 0 ? (
                employees.map((emp, index) => (
                  <tr
                    key={emp.empId}
                    className={
                      selectedIds.includes(emp.empId) ? "table-warning" : ""
                    }
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(emp.empId)}
                        onChange={() => toggleSelect(emp.empId)}
                      />
                    </td>

                    <td>{index + 1}</td>
                    <td>{emp.empId}</td>
                    <td>{highlightText(emp.name)}</td>
                    <td>{highlightText(emp.department)}</td>
                    <td>{highlightText(emp.email)}</td>
                    <td>{emp.salary}</td>

                    <td className="text-nowrap">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate(`/admin/update/${emp.empId}`)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(emp.empId)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>
        {`
          .fade-counter {
            animation: fadeIn 0.4s ease-in-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .hide-scrollbar::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }

          .hide-scrollbar {
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
}

export default EmployeeList;
