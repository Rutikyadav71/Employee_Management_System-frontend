import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const UserLeaveDetails = () => {
  const { empId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const leaveId = query.get("leaveId"); 

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empId) fetchLeaves();
  }, [empId]);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/leaves/employee/${empId}`,
      );

      let data = res.data || [];

      if (leaveId) {
        data = data.filter((l) => String(l.id) === String(leaveId));
      }

      setLeaves(data);
    } catch (err) {
      console.error("❌ Failed to load leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  if (leaves.length === 0) {
    return (
      <div className="container py-4">
        <div className="alert alert-info">
          No leave records found for this employee.
        </div>

        <button
          className="btn btn-outline-secondary px-4 w-30 w-sm-auto d-inline-flex align-items-center"
          onClick={() => navigate("/user/notifications")}
        >
          ← Back to Notifications
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
        <h4 className="fw-bold mb-0">Your Leave History</h4>

        <button
          className="btn btn-outline-secondary px-4 w-30 w-sm-auto d-inline-flex align-items-center"
          onClick={() => navigate("/user/notifications")}
        >
          ← Back to Notifications
        </button>
      </div>

      {leaves.map((leave) => (
        <div key={leave.id} className="card shadow-sm mb-3">
          <div className="card-body">
            <p>
              <strong>Leave ID:</strong> {leave.id}
            </p>
            <p>
              <strong>Reason:</strong> {leave.reason || "—"}
            </p>
            <p>
              <strong>Start Date:</strong> {leave.startDate}
            </p>
            <p>
              <strong>End Date:</strong> {leave.endDate}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  leave.status === "APPROVED"
                    ? "bg-success"
                    : leave.status === "REJECTED"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                }`}
              >
                {leave.status}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserLeaveDetails;
