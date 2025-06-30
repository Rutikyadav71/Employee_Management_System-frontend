import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaPlus,
  FaHome,
  FaClipboard,
  FaTimes
} from "react-icons/fa";
import "./Sidebar.css";

function AdminSidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header d-flex justify-content-between align-items-center p-3">
        <h4 className="text-white">EMS</h4>
        <FaTimes
          onClick={toggleSidebar}
          className="text-white d-md-none"
          style={{ cursor: "pointer" }}
        />
      </div>
      <ul className="nav flex-column px-3">
        <li className="nav-item mb-2">
          <Link to="/admin/dashboard" className="nav-link text-white">
            <FaHome className="me-2" /> Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/employees" className="nav-link text-white">
            <FaUsers className="me-2" /> Employees
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/add" className="nav-link text-white">
            <FaPlus className="me-2" /> Add Employee
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/leaves" className="nav-link text-white">
            <FaClipboard className="me-2" /> Manage Leaves
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/apply-leave" className="nav-link text-white">
            <FaClipboard className="me-2" /> Apply Leaves
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
