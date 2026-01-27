import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function UserNotifications() {
  const empId = localStorage.getItem("empId");
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empId) {
      fetchNotifications();
    }
  }, [empId]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/notifications");

      const userNotifs = res.data.filter(
        (n) =>
          n.message.toLowerCase().includes("leave") &&
          n.message.includes(`Emp ID: ${empId}`),
      );

      setNotifications(userNotifs);
    } catch (err) {
      console.error("User notification fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      await axios.put("http://localhost:8080/api/notifications/mark-all-read");

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      const match = notif.message.match(/Leave ID:\s*(\d+)/);
      const leaveId = match ? match[1] : null;

      if (leaveId) {
        navigate(`/user/leaves/employee/${empId}?leaveId=${leaveId}`);
      } else {
        navigate(`/user/leaves/employee/${empId}`);
      }
    } catch (err) {
      console.error("❌ Failed to mark notifications read:", err);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center text-muted">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Your Leave Notifications</h4>

        <button
          className="btn btn-outline-secondary px-4"
          onClick={() => navigate("/user/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="alert alert-light text-center text-muted">
          No leave notifications yet.
        </div>
      ) : (
        <div className="list-group shadow-sm">
          {notifications.map((n) => (
            <button
              key={n.id}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                n.read ? "text-muted" : "fw-semibold"
              }`}
              onClick={() => handleNotificationClick(n)}
            >
              <span>{n.message}</span>

              {!n.read && (
                <span className="badge bg-primary rounded-pill">New</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserNotifications;
