import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const empRes = await axios.get('https://ry-ems-backend.onrender.com/api/employees');
      const leaveRes = await axios.get('https://ry-ems-backend.onrender.com/api/leaves');
      setEmployeeCount(empRes.data.length);
      setLeaveCount(leaveRes.data.length);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Employee Management Dashboard</h2>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Total Employees</h5>
              <p className="display-6">{employeeCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Total Leave Requests</h5>
              <p className="display-6">{leaveCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row g-3">
        <div className="col-md-6 col-lg-3">
          <Link to="/admin/employees" className="text-decoration-none">
            <div className="card h-100 text-center border-0 shadow-sm hover-shadow bg-light">
              <div className="card-body">
                <h6 className="card-title">👥 View Employees</h6>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-6 col-lg-3">
          <Link to="/admin/add" className="text-decoration-none">
            <div className="card h-100 text-center border-0 shadow-sm hover-shadow bg-light">
              <div className="card-body">
                <h6 className="card-title">➕ Add Employee</h6>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-6 col-lg-3">
          <Link to="/admin/leaves" className="text-decoration-none">
            <div className="card h-100 text-center border-0 shadow-sm hover-shadow bg-light">
              <div className="card-body">
                <h6 className="card-title">📝 Manage Leaves</h6>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-6 col-lg-3">
          <Link to="/apply-leave" className="text-decoration-none">
            <div className="card h-100 text-center border-0 shadow-sm hover-shadow bg-light">
              <div className="card-body">
                <h6 className="card-title">📤 Apply Leave</h6>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
