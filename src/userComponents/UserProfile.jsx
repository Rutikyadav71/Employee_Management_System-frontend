// src/userComponents/UserProfile.js
import React from 'react';

function UserProfile() {
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  const empId = localStorage.getItem('empId');
  const department = localStorage.getItem('department');
  const salary = localStorage.getItem('salary');

  return (
    <div className="container mt-5">
      <h3 className="fw-bold text-primary mb-4">My Profile</h3>
      <div className="card shadow-sm">
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Employee ID:</strong> {empId}</li>
            <li className="list-group-item"><strong>Name:</strong> {name}</li>
            <li className="list-group-item"><strong>Email:</strong> {email}</li>
            <li className="list-group-item"><strong>Department:</strong> {department}</li>
            <li className="list-group-item"><strong>Salary:</strong> ₹{salary}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
