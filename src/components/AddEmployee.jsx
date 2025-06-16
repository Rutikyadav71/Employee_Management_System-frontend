import React, { useState } from 'react';
import { addEmployee } from '../services/EmployeeService.js';
import { useNavigate } from 'react-router-dom';

function AddEmployee() {
  const [employee, setEmployee] = useState({ name: '', department: '', salary: '', email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmployee(employee);
      navigate('/employees');
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '600px' }}>
        <h4 className="mb-4 text-primary fw-bold">Add Employee</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              value={employee.name}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Enter name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              name="department"
              value={employee.department}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Enter department"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Salary</label>
            <input
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Enter salary"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              value={employee.email}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Enter email"
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
