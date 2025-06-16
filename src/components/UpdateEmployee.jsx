import React, { useState, useEffect } from 'react';
import { updateEmployee, getEmployees } from '../services/EmployeeService.js';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateEmployee() {
  const [employee, setEmployee] = useState({ name: '', department: '', salary: '', email: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await getEmployees();
        const emp = response.data.find(e => e.id === parseInt(id));
        if (emp) setEmployee(emp);
        else navigate('/');
      } catch (error) {
        console.error("Failed to fetch employee:", error);
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee(id, employee);
      navigate('/employees');
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '600px' }}>
        <h4 className="mb-4 text-primary fw-bold">Update Employee</h4>
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
          <button type="submit" className="btn btn-success w-100">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateEmployee;
