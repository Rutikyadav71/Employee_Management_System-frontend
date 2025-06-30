import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", form);
      const emp = res.data;

      if (emp.role !== "USER") {
        setMessage("❌ This login is for employees only.");
        setLoading(false);
        return;
      }

      localStorage.setItem("empId", emp.empId);
      localStorage.setItem("role", emp.role);
      localStorage.setItem("name", emp.name);
      localStorage.setItem("email", emp.email);         
      localStorage.setItem("department", emp.department); 
      localStorage.setItem("salary", emp.salary);       

      navigate("/user/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
        <h3 className="text-center text-primary mb-4">Employee Login</h3>

        {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <span
                className="input-group-text bg-white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Are you an admin?{" "}
            <Link to="/admin/auth" className="text-decoration-none">
              Go to Admin Login
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
