import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { FaBell, FaUsers, FaPlus, FaTasks, FaPaperPlane } from "react-icons/fa";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const empRes = await axios.get("http://localhost:8080/api/employees");
      const leaveRes = await axios.get("http://localhost:8080/api/leaves");
      const notifRes = await axios.get("http://localhost:8080/api/notifications");

      setEmployees(empRes.data);
      setLeaves(leaveRes.data);
      setNotifications(notifRes.data);
      setUnreadCount(notifRes.data.filter(n => !n.read).length);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  const pendingLeaves = leaves.filter(l => l.status === "PENDING").length;

  const leaveStats = {
    APPROVED: leaves.filter(l => l.status === "APPROVED").length,
    PENDING: leaves.filter(l => l.status === "PENDING").length,
    REJECTED: leaves.filter(l => l.status === "REJECTED").length
  };

  const deptStats = Object.values(
    employees.reduce((acc, emp) => {
      acc[emp.department] = acc[emp.department] || { department: emp.department, count: 0 };
      acc[emp.department].count++;
      return acc;
    }, {})
  );

  const today = new Date();
  const hours = today.getHours();
  const greeting = hours < 12 ? "Good Morning" : hours < 17 ? "Good Afternoon" : "Good Evening";
  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "short", day: "numeric"
  });

  const handleDeptClick = (data) => {
    navigate(`/admin/employees?department=${data.department}`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("EMS Dashboard Report", 14, 15);
    doc.text(`Total Employees: ${employees.length}`, 14, 30);
    doc.text(`Pending Leaves: ${pendingLeaves}`, 14, 40);
    doc.text(`Approved Leaves: ${leaveStats.APPROVED}`, 14, 50);
    doc.text(`Rejected Leaves: ${leaveStats.REJECTED}`, 14, 60);
    doc.text(`Generated: ${formattedDate}`, 14, 80);
    doc.save("EMS_Dashboard_Report.pdf");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    const empSheet = XLSX.utils.json_to_sheet(employees);
    const leaveSheet = XLSX.utils.json_to_sheet(leaves);

    XLSX.utils.book_append_sheet(wb, empSheet, "Employees");
    XLSX.utils.book_append_sheet(wb, leaveSheet, "Leaves");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "EMS_Full_Report.xlsx");
  };

  return (
    <div className="container-fluid px-4 py-4 pb-5">

      <div className="d-flex justify-content-between align-items-center mb-4 position-relative">
        <div>
          <h4 className="fw-bold mb-1">{greeting}, Admin 👋</h4>
          <small className="text-muted">{formattedDate}</small>
        </div>

      </div>

      <div className="row g-4 mb-4">
        {[
          ["Total Employees", employees.length, "primary"],
          ["Pending Leaves", pendingLeaves, "warning"],
          ["Approved Leaves", leaveStats.APPROVED, "success"],
          ["Rejected Leaves", leaveStats.REJECTED, "danger"]
        ].map(([label, value, color], i) => (
          <div className="col-md-3" key={i}>
            <div className={`card bg-${color} text-white shadow-sm h-100`}>
              <div className="card-body">
                <h6>{label}</h6>
                <p className="display-6">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Employees by Department</h6>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deptStats} onClick={(e) => e && handleDeptClick(e.activePayload[0].payload)}>
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0d6efd" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Leave Status Breakdown</h6>
              <ul className="list-group">
                <li className="list-group-item">Approved: {leaveStats.APPROVED}</li>
                <li className="list-group-item">Pending: {leaveStats.PENDING}</li>
                <li className="list-group-item">Rejected: {leaveStats.REJECTED}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Recent Activity</h6>
              {notifications.slice(0, 5).map((n, i) => (
                <div key={i} className={`small ${n.read ? "text-muted" : "fw-semibold"}`}>
                  • {n.message}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4 d-flex gap-2 align-items-start">
          <button className="btn btn-outline-primary w-100" onClick={exportPDF}>Export PDF</button>
          <button className="btn btn-outline-success w-100" onClick={exportExcel}>Export Excel</button>
        </div>
      </div>

      <div className="row g-3">
        {[
          ["/admin/employees", "View Employees", <FaUsers size={34} />],
          ["/admin/add", "Add Employee", <FaPlus size={34} />],
          ["/admin/leaves", "Manage Leaves", <FaTasks size={34} />],
          ["/apply-leave", "Apply Leave", <FaPaperPlane size={34} />]
        ].map(([to, label, icon], i) => (
          <div className="col-md-6 col-lg-3" key={i}>
            <Link to={to} className="text-decoration-none">
              <div className="card shadow-sm text-center h-100">
                <div className="card-body d-flex flex-column justify-content-center align-items-center"
                     style={{ minHeight: 140 }}>
                  {icon}
                  <div className="mt-2 fw-semibold">{label}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;
