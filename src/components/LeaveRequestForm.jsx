import React, { useState } from 'react';
import axios from 'axios';

const LeaveRequestForm = () => {
  const [form, setForm] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('https://joyful-bravery-production.up.railway.app/api/leaves', form);
      setMessage('Leave request submitted successfully.');
      setForm({ employeeId: '', startDate: '', endDate: '', reason: '' });
    } catch (err) {
      console.error('Error submitting leave request', err);
      setMessage('Failed to submit leave request.');
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '600px' }}>
        <h4 className="mb-4 fw-bold text-primary">Apply for Leave</h4>

        {message && (
          <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="employeeId" className="form-label">Employee ID</label>
            <input
              type="text"
              className="form-control"
              id="employeeId"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              required
              placeholder="Enter your Employee ID"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="reason" className="form-label">Reason</label>
            <textarea
              className="form-control"
              id="reason"
              name="reason"
              rows="3"
              value={form.reason}
              onChange={handleChange}
              required
              placeholder="Reason for leave"
            />
          </div>

          <button type="submit" className="btn btn-success w-100">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
