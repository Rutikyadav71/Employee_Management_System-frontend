import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mlData, setMlData] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const isRecentLeave = (startDate) => {
    const leaveDate = new Date(startDate);
    const now = new Date();
    const diffInDays = (now - leaveDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 30; 
  };

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/leaves');

      const recentLeaves = res.data.filter((leave) =>
        isRecentLeave(leave.startDate)
      );

      setLeaves(recentLeaves);
    } catch (err) {
      console.error('Error fetching leave requests', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/leaves/${id}`, {
        status: status
      });

      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === id ? { ...leave, status: res.data.status } : leave
        )
      );
    } catch (err) {
      console.error('Error updating leave status', err);
    }
  };

  const clearFromUI = (id) => {
    setLeaves((prev) => prev.filter((leave) => leave.id !== id));
  };

  const getPrediction = async (leaveId) => {
    setShowModal(true);
    setLoading(true);
    setMlData(null);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/leaves/admin/${leaveId}/prediction`
      );

      setTimeout(() => {
        setMlData(res.data);
        setLoading(false);
      }, 1200);
    } catch (err) {
      setLoading(false);
      setMlData({ error: 'ML Service Unavailable' });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setMlData(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold text-primary">Leave Management</h2>

      {leaves.length === 0 ? (
        <div className="alert alert-info">No leave requests available.</div>
      ) : (
        <div className="table-responsive custom-table-scroll">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Employee ID</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
                <th>ML Insight</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, index) => (
                <tr key={leave.id}>
                  <td>{index + 1}</td>
                  <td>{leave.empId}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span
                      className={`badge ${
                        leave.status === 'APPROVED'
                          ? 'bg-success'
                          : leave.status === 'REJECTED'
                          ? 'bg-danger'
                          : 'bg-warning text-dark'
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="text-nowrap">
                    <button
                      className="btn btn-sm btn-success me-2 px-3 w-50"
                      onClick={() => updateStatus(leave.id, 'APPROVED')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger px-3 w-50"
                      onClick={() => updateStatus(leave.id, 'REJECTED')}
                    >
                      Reject
                    </button>

                    <button
                      className="btn btn-sm btn-secondary px-3 w-50 mt-1"
                      onClick={() => clearFromUI(leave.id)}
                    >
                      Clear
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary px-3 w-75"
                      onClick={() => getPrediction(leave.id)}
                    >
                      Get ML Prediction
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-card">
            <h4 className="fw-bold mb-3 text-center">ML Leave Insight</h4>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary mb-3" />
                <p className="fw-semibold">Analyzing leave data...</p>
              </div>
            ) : mlData?.error ? (
              <div className="alert alert-danger text-center">
                {mlData.error}
              </div>
            ) : (
              <div>
                <p>
                  <strong>Prediction:</strong>{' '}
                  <span
                    className={
                      mlData.prediction === 'APPROVED'
                        ? 'text-success fw-bold'
                        : 'text-danger fw-bold'
                    }
                  >
                    {mlData.prediction}
                  </span>
                </p>

                <p>
                  <strong>Confidence:</strong>{' '}
                  {mlData.confidence.toFixed(2)}%
                </p>

                <p>
                  <strong>Leave days this month:</strong>{' '}
                  {mlData.monthlyLeaveDays}
                </p>

                <p>
                  <strong>Leave days this year:</strong>{' '}
                  {mlData.yearlyLeaveDays}
                </p>

                <p>
                  <strong>Risk Level:</strong>{' '}
                  <span
                    className={`badge ${
                      mlData.riskLevel === 'HIGH'
                        ? 'bg-danger'
                        : mlData.riskLevel === 'MEDIUM'
                        ? 'bg-warning text-dark'
                        : 'bg-success'
                    }`}
                  >
                    {mlData.riskLevel}
                  </span>
                </p>
              </div>
            )}

            <div className="text-center mt-3">
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
