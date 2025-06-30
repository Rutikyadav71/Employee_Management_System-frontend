import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const navigate = useNavigate();

  const name = localStorage.getItem('adminName');
  const email = localStorage.getItem('adminEmail');

  const handleLogout = () => {
    localStorage.clear(); // or selectively remove keys
    navigate('/'); // redirect to login page
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary">👤 Admin Profile</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Name:</strong> {name}</li>
            <li className="list-group-item"><strong>Email:</strong> {email}</li>
          </ul>
      </div>
    </div>
      <p>Welcome, Admin!</p>
      <button onClick={handleLogout} className="btn btn-danger mt-3">
        Logout
      </button>
    </div>
  );
};

export default AdminProfile;
