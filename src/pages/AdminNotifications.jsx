import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">All Notifications</h4>

      {loading ? (
        <div className="spinner-border text-primary" />
      ) : notifications.length === 0 ? (
        <div className="alert alert-info">No notifications found.</div>
      ) : (
        <ul className="list-group">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`list-group-item d-flex justify-content-between align-items-start ${
                n.read ? "text-muted" : "fw-semibold"
              }`}
            >
              <div>{n.message}</div>
              <small className="text-muted">
                {new Date(n.createdAt).toLocaleString("en-IN")}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminNotifications;
