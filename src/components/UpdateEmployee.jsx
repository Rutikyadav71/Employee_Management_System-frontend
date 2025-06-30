import React, { useState, useEffect } from 'react';
import { updateEmployee, getEmployees } from '../services/EmployeeService.js';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function UpdateEmployee() {
  const [employee, setEmployee] = useState({
    empId: '',
    name: '',
    department: '',
    salary: '',
    email: '',
    password: '',
    role: 'USER'
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await getEmployees();
        const emp = response.data.find((e) => e.empId === parseInt(id));
        if (emp) {
          setEmployee({ ...emp, password: '' });
        } else {
          navigate('/admin/employees');
        }
      } catch (error) {
        console.error('Failed to fetch employee:', error);
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (employee.password && employee.password.length < 6) {
      alert("❌ Password must be at least 6 characters.");
      return;
    }

    try {
      await updateEmployee(employee.empId, employee);
      navigate('/admin/employees');
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-start p-3"
      style={{ height: 'calc(100vh - 70px)', overflowY: 'auto' }}
    >
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '500px' }}>
        <h4 className="mb-4 text-primary fw-bold text-center">Update Employee</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Employee ID</label>
            <input
              name="empId"
              value={employee.empId}
              className="form-control"
              readOnly
            />
          </div>

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
              type="number"
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
              autoComplete="email"
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control pe-5"
                name="password"
                value={employee.password}
                onChange={handleChange}
                placeholder="Leave empty to keep current"
                autoComplete="new-password"
              />
              <span
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "15px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  color: "#495057",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              name="role"
              value={employee.role}
              onChange={handleChange}
              required
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div> */}

          <div className="d-flex justify-content-center mt-4">
            <button type="submit" className="btn btn-success px-4">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateEmployee;
