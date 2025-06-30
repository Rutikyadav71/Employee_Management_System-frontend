import React, { useState } from "react";
import './App.css'; 
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Common Pages
import HomePage from "./pages/HomePage";
import EmployeeLogin from "./pages/AuthPage";
import AdminAuthPage from "./pages/AdminAuthPage";

// Admin Components
import AdminDashboard from "./components/AdminDashboard";
import AddEmployee from "./components/AddEmployee";
import EmployeeList from "./components/EmployeeList";
import UpdateEmployee from "./components/UpdateEmployee";
import AdminProfile from "./components/AdminProfile";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";
import LeaveManagement from "./components/LeaveManagement";
import LeaveRequestForm from "./components/LeaveRequestForm";

// User Components
import UserDashboard from "./userComponents/UserDashboard";
import UserProfile from "./userComponents/UserProfile";
import UserLeaveRequestForm from "./userComponents/LeaveRequestForm";
import UserNavbar from "./userComponents/UserNavbar";
import UserSidebar from "./userComponents/UserSidebar";

const ProtectedRoute = ({ allowedRole }) => {
  const role = localStorage.getItem("role");
  return role === allowedRole ? <Outlet /> : <Navigate to="/" />;
};

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="app-container ">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 998,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        />
      )}

      <div className="flex-grow-1 d-flex flex-column">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <div className="main-content p-3 flex-grow-1">
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="add" element={<AddEmployee />} />
            <Route path="update/:id" element={<UpdateEmployee />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="apply-leave" element={<LeaveRequestForm />} />
            <Route path="leaves" element={<LeaveManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const UserLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="app-container d-flex" style={{ height: "100vh", overflow: "hidden", paddingBottom: "2rem" }}>
      <UserSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 998,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        />
      )}

      <div className="flex-grow-1 d-flex flex-column">
        <UserNavbar toggleSidebar={toggleSidebar} />
        <div className="main-content p-3 flex-grow-1">
          <Routes>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="apply-leave" element={<UserLeaveRequestForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/employee" element={<EmployeeLogin />} />
        <Route path="/auth/admin" element={<AdminAuthPage />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Route>

        {/* User Routes */}
        <Route element={<ProtectedRoute allowedRole="USER" />}>
          <Route path="/user/*" element={<UserLayout />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
