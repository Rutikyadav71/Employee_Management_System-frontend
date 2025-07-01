import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminAuthPage = () => {
  const [adminExists, setAdminExists] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 🔍 Check if an admin already exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("https://ry-ems-backend.onrender.com/api/admin/exists");
        setAdminExists(res.data.exists);
        if (res.data.exists) setIsLogin(true); // force login mode
      } catch (err) {
        console.error("Error checking admin existence", err);
      }
    };
    checkAdmin();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const url = isLogin
        ? "https://ry-ems-backend.onrender.com/api/admin/login"
        : "https://ry-ems-backend.onrender.com/api/admin/register";

      const res = await axios.post(url, form);
      const data = res.data;

      if (isLogin) {
        // Save to localStorage
        localStorage.setItem("adminEmail", data.email);
        localStorage.setItem("adminName", data.name);
        localStorage.setItem("role", "ADMIN");

        navigate("/admin/dashboard");
      } else {
        setMessage("✅ Admin registered successfully. Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("❌ Admin Auth Error:", err);
      setMessage(err.response?.data || "❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
        <h3 className="text-center text-primary mb-4">
          {isLogin ? "Admin Login" : "Admin Registration"}
        </h3>

        {message && (
          <div
            className={`alert ${
              message.includes("✅") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        {!adminExists || isLogin ? (
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
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
                  placeholder="Enter password"
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
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Registering..."
                : isLogin
                ? "Login"
                : "Register"}
            </button>
          </form>
        ) : (
          <div className="alert alert-info text-center fw-semibold">
            ✅ Admin is already registered. Please login to continue.
          </div>
        )}

        <div className="mt-3 text-center">
          {!adminExists && (
            <button
              className="btn btn-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an admin account? Register"
                : "Already registered? Login"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;
