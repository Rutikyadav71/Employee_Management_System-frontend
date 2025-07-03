
import React from 'react';
import { FaBars } from 'react-icons/fa';
import { Link} from 'react-router-dom';
import '../components/Navbar.css';

function UserNavbar({ toggleSidebar }) {
  const userName = localStorage.getItem("name") || "Employee";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <button className="btn btn-dark me-3" onClick={toggleSidebar}>
          <FaBars size={20} />
        </button>
        <span className="navbar-brand mb-0 h1 text-white">
          <Link to="/user/dashboard" className="nav-link text-white">
            EMS
          </Link>
        </span>
      </div>

      <div className="d-flex align-items-center">
        <div className="dropdown">
          <button className="btn btn-dark dropdown-toggle d-flex align-items-center" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="user"
              className="rounded-circle me-2"
              width="32"
              height="32"
            />
            {userName}
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><a className="dropdown-item" href="/user/profile">Profile</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;
