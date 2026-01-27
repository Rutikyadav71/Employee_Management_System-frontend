import React, { useEffect, useState } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import "../components/Navbar.css";

function UserNavbar({ toggleSidebar }) {
  const userName = localStorage.getItem("name") || "Employee";
  const empId = localStorage.getItem("empId"); 

  const navigate = useNavigate(); 

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (empId) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [empId]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/notifications");

      const userNotifs = res.data.filter(
        (n) =>
          n.message.toLowerCase().includes("leave") &&
          n.message.includes(`Emp ID: ${empId}`)
      );

      setNotifications(userNotifs);
      setUnreadCount(userNotifs.filter((n) => !n.read).length);
    } catch (err) {
      console.error("User notification fetch error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const toggleBell = async () => {
    setShowNotifs(!showNotifs);
    if (unreadCount > 0) {
      await axios.put("http://localhost:8080/api/notifications/mark-all-read");
      fetchNotifications();
    }
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

      <div className="d-flex align-items-center position-relative">
        <div className="position-relative me-3">
          <FaBell
            size={20}
            color="white"
            className="cursor-pointer"
            onClick={toggleBell}
          />

          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {unreadCount}
            </span>
          )}

          {showNotifs && (
            <div
              className="position-absolute end-0 mt-2 bg-white shadow rounded p-3"
              style={{ width: 320, zIndex: 2000 }}
            >
              <h6 className="fw-bold mb-2">Leave Notifications</h6>

              {notifications.length === 0 ? (
                <div className="small text-muted">
                  No leave updates yet.
                </div>
              ) : (
                notifications.slice(0, 6).map((n, i) => (
                  <div
                    key={i}
                    className={`small mb-2 cursor-pointer ${
                      n.read ? "text-muted" : "fw-semibold"
                    }`}
                    onClick={() => {
                      setShowNotifs(false);
                      navigate(`/user/leaves/employee/${empId}`);
                    }}
                  >
                    • {n.message}
                  </div>
                ))
              )}

              {notifications.length > 0 && (
                <div className="text-center mt-2">
                  <Link
                    to="/user/notifications"
                    className="small text-primary text-decoration-none"
                    onClick={() => setShowNotifs(false)}
                  >
                    View all
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="dropdown">
          <button
            className="btn btn-dark dropdown-toggle d-flex align-items-center"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="user"
              className="rounded-circle me-2"
              width="32"
              height="32"
            />
            {userName}
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="userDropdown"
          >
            <li>
              <Link className="dropdown-item" to="/user/profile">
                Profile
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;
