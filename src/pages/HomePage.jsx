import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // For custom styling

const HomePage = () => {
  return (
    <div className="homepage-container d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
      <div className="text-center mb-4">
        <h1 className="fw-bold text-primary">Employee Management System</h1>
        <p className="text-muted">Manage your employees effectively and securely</p>
      </div>

      <div className="auth-cards d-flex gap-4 flex-wrap justify-content-center">
        {/* Employee Card */}
        <div className="card shadow p-4 home-card text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Employee"
            className="mb-3 rounded-circle"
            width="100"
            height="100"
          />
          <h4 className="mb-3 text-secondary">Employee Portal</h4>
          <p className="text-muted small">
            View profile, apply leave, and track status.
          </p>
          <Link to="/auth/employee" className="btn btn-outline-primary w-100">
            Login as Employee
          </Link>
        </div>

        {/* Admin Card */}
        <div className="card shadow p-4 home-card text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2206/2206368.png"
            alt="Admin"
            className="mb-3 rounded-circle"
            width="100"
            height="100"
          />
          <h4 className="mb-3 text-secondary">Admin Panel</h4>
          <p className="text-muted small">
            Manage employees, leaves, and company data.
          </p>
          <Link to="/auth/admin" className="btn btn-outline-success w-100">
            Login as Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
