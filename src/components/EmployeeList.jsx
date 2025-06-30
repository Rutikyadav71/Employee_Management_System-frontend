import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../services/EmployeeService.js';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const response = await getEmployees();
    setEmployees(response.data);
  };

  const handleDelete = async (empId) => {
    try {
      await deleteEmployee(empId);
      loadEmployees();
    } catch (err) {
      console.error('Failed to delete employee:', err);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="mb-4 text-primary fw-bold">Employees</h4>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>EmployeeId</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp, index) => (
                  <tr key={emp.empId}>
                    <td>{index + 1}</td>
                    <td>{emp.empId}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.email}</td>
                    <td>{emp.salary}</td>
                    <td className="text-nowrap">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate(`/admin/update/${emp.empId}`)} // ✅ uses empId
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(emp.empId)} // ✅ uses empId
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
