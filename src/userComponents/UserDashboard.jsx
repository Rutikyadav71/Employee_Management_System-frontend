import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const empId = localStorage.getItem('empId'); // stored during login
  const [profile, setProfile] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);

  useEffect(() => {
    fetchEmployeeProfile();
    fetchLeaveHistory();
  }, []);

  const fetchEmployeeProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/employees/${empId}`);
      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchLeaveHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/leaves/employee/${empId}`);
      setLeaveHistory(res.data);
    } catch (err) {
      console.error('Error fetching leave history:', err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-primary">👤 Employee Dashboard</h2>

      {profile ? (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-secondary fw-bold">Profile Details</h5>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Department:</strong> {profile.department}</p>
            <p><strong>Salary:</strong> ₹{profile.salary}</p>
            <p><strong>Employee ID:</strong> {profile.empId}</p>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      <div className="mb-4">
        <Link to="/user/apply-leave" className="btn btn-success">
          📤 Apply for Leave
        </Link>
      </div>

      <h5 className="fw-bold text-primary mb-3">📄 Leave History</h5>
      {leaveHistory.length === 0 ? (
        <div className="alert alert-info">No leave history available.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`badge ${
                      leave.status === 'APPROVED'
                        ? 'bg-success'
                        : leave.status === 'REJECTED'
                        ? 'bg-danger'
                        : 'bg-warning text-dark'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
