import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaPlus, FaHome, FaSuitcase, FaClipboard, FaTimes } from "react-icons/fa";
import "../components/Sidebar.css";

function UserSidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header d-flex justify-content-between align-items-center p-3">
        <h4 className="text-white">EMS</h4>
        <FaTimes onClick={toggleSidebar} className="text-white d-md-none" style={{ cursor: "pointer" }} />
      </div>
      <ul className="nav flex-column px-3">
        <li className="nav-item mb-2">
          <Link to="/user/dashboard" className="nav-link text-white">
            <FaHome className="me-2" /> Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/user/apply-leave" className="nav-link text-white">
            <FaSuitcase className="me-2" /> Apply Leave
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default UserSidebar;
