import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('https://joyful-bravery-production.up.railway.app/api/leaves');
      setLeaves(res.data);
    } catch (err) {
      console.error('Error fetching leave requests', err);
    }
  };
  

  const updateStatus = async (id, status) => {
  try {
    const res = await axios.put(`https://joyful-bravery-production.up.railway.app/api/leaves/${id}`, {
      status: status  
    });
    const updatedLeaves = leaves.map((leave) =>
      leave.id === id ? { ...leave, status: res.data.status } : leave
    );
    setLeaves(updatedLeaves);
  } catch (err) {
    console.error("Error updating leave status", err);
  }
};



  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold text-primary">Leave Management</h2>
      {leaves.length === 0 ? (
        <div className="alert alert-info">No leave requests available.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Employee ID</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.employeeId}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`badge ${leave.status === 'APPROVED' ? 'bg-success' : leave.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2 btn-success-custom"
                      onClick={() => updateStatus(leave.id, 'APPROVED')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger btn-success-custom"
                      onClick={() => updateStatus(leave.id, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
