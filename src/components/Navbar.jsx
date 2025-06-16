import React from 'react';
import { FaBars, FaBell } from 'react-icons/fa';
import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar({ toggleSidebar }) {
  const handleLogout = () => {
    // Toast notification
    const toast = document.getElementById("logout-toast");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 d-flex justify-content-between align-items-center">
        {/* Left: Sidebar Toggle + Logo */}
        <div className="d-flex align-items-center">
          <button className="btn btn-dark me-3" onClick={toggleSidebar}>
            <FaBars size={20} />
          </button>
          <span className="navbar-brand mb-0 h1">
            <Link to="/" className="nav-link text-white">
             EMS
            </Link>
          </span>
        </div>

        {/* Right: Notification + Admin Dropdown */}
        <div className="d-flex align-items-center">
          {/* Notifications */}
          <div className="position-relative me-3">
            <FaBell size={20} color="white" />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              0
            </span>
          </div>

          {/* Admin Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-dark dropdown-toggle d-flex align-items-center"
              id="adminDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://i.pravatar.cc/32?img=12"
                alt="admin"
                className="rounded-circle me-2"
                width="32"
                height="32"
              />
              Admin
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminDropdown">
              <li><a className="dropdown-item" href="#">Profile</a></li>
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Toast Message */}
      <div id="logout-toast" className="toast-custom">
        👋 Logout successful!
      </div>
    </>
  );
}

export default Navbar;
