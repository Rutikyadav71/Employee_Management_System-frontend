import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import UpdateEmployee from './components/UpdateEmployee';
import LeaveManagement from './components/LeaveManagement';
import LeaveRequestForm from './components/LeaveRequestForm';
import './components/sidebar.css';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        <div className="main-content">
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="p-3">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/add" element={<AddEmployee />} />
              <Route path="/update/:id" element={<UpdateEmployee />} />
              <Route path="/leaves" element={<LeaveManagement />} />
              <Route path="/apply-leave" element={<LeaveRequestForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
