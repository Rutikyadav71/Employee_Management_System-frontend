import React, { useState } from 'react';
import { FaBars, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function AdminNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleLogout = () => {
    localStorage.clear(); // clear auth
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/auth/admin'); // redirect to admin login
    }, 2000);
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
            <Link to="/admin/dashboard" className="nav-link text-white">
              EMS
            </Link>
          </span>
        </div>

        {/* Right: Notification + Admin Dropdown */}
        <div className="d-flex align-items-center">
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
                src="https://cdn-icons-png.flaticon.com/512/2206/2206368.png"
                alt="admin"
                className="rounded-circle me-2"
                width="32"
                height="32"
              />
              Admin
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminDropdown">
              <li>
                <Link className="dropdown-item" to="/admin/profile">Profile</Link>
              </li>
              <li>
                <Link className="dropdown-item" to="#">Settings</Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Toast Message */}
      {showToast && (
        <div className="toast-custom show">
          👋 Logout successful!
        </div>
      )}
    </>
  );
}

export default AdminNavbar;
