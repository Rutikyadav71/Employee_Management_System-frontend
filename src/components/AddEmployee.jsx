import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    empId: "",
    name: "",
    department: "",
    email: "",
    password: "",
    salary: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (employee.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters.");
      return;
    }

    try {
      await axios.post("https://ry-ems-backend.onrender.com/api/employees", employee);
      setMessage("✅ Employee added successfully.");
      setTimeout(() => navigate("/admin/employees"), 1500);
    } catch (err) {
      console.error("Error adding employee:", err);
      setMessage("❌ Failed to add employee.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start p-3" style={{ height: 'calc(100vh - 70px)', overflowY: 'auto' }}>
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "500px" }}>
        <h4 className="mb-4 fw-bold text-primary text-center">Add New Employee</h4>

        {message && (
          <div
            className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Employee ID</label>
            <input
              type="number"
              className="form-control"
              name="empId"
              value={employee.empId}
              onChange={handleChange}
              required
              placeholder="Enter unique employee ID"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={employee.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              name="department"
              value={employee.department}
              onChange={handleChange}
              required
              placeholder="Enter department"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
              autoComplete="username"
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                name="password"
                value={employee.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
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

          <div className="mb-3">
            <label className="form-label">Salary</label>
            <input
              type="number"
              className="form-control"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              required
              placeholder="Enter salary"
            />
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button type="submit" className="btn btn-primary px-4">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
