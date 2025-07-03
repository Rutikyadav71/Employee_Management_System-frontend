import React, { useState } from "react";
import axios from "axios";

const LeaveRequestForm = () => {
  const [form, setForm] = useState({
    empId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [leaves, setLeaves] = useState([]);

  // Auto-fill empId from localStorage if available
  // useEffect(() => {
  //   const storedId = localStorage.getItem("empId");
  //   if (storedId) {
  //     setForm((prev) => ({ ...prev, empId: storedId }));
  //   }
  // }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (new Date(form.startDate) > new Date(form.endDate)) {
      setMessage("❌ Start date must be before end date.");
      return;
    }

    try {
      await axios.post("https://ry-ems-backend.onrender.com/api/leaves", form);
      setMessage("✅ Leave request submitted successfully.");
      setForm({ ...form, startDate: "", endDate: "", reason: "" });
      setLeaves([]); // clear previous data
    } catch (err) {
      console.error("Error submitting leave request:", err);
      setMessage("❌ Failed to submit leave request.");
    }
  };

  const fetchHistory = async () => {
    setMessage("");
    try {
      const res = await axios.get(
        `https://ry-ems-backend.onrender.com/api/leaves/employee/${form.empId}`
      );
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leave history:", err);
      setMessage("❌ Failed to fetch leave history.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-center">
        <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "600px" }}>
          <h4 className="mb-4 fw-bold text-primary text-center">
            Apply for Leave
          </h4>

          {message && (
            <div
              className={`alert ${
                message.includes("✅") ? "alert-success" : "alert-danger"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="empId" className="form-label">
                Employee ID
              </label>
              <input
                type="number"
                className="form-control"
                id="empId"
                name="empId"
                value={form.empId}
                // readOnly
              />
            </div>

            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
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
              <label htmlFor="endDate" className="form-label">
                End Date
              </label>
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
              <label htmlFor="reason" className="form-label">
                Reason
              </label>
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

            <div className="d-flex justify-content-center mt-4 gap-2">
              <button type="submit" className="btn btn-success px-4">
                Submit Request
              </button>

              <button
                type="button"
                className="btn btn-outline-primary px-4"
                onClick={fetchHistory}
                disabled={!form.empId}
              >
                View Leave History
              </button>
            </div>
          </form>
        </div>
      </div>

      {leaves.length > 0 && (
        <div className="mt-5 px-2">
          <h5 className="fw-bold text-primary text-center mb-3">
            Leave History for Employee ID: {form.empId}
          </h5>
          <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span
                        className={`badge ${
                          leave.status === "APPROVED"
                            ? "bg-success"
                            : leave.status === "REJECTED"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestForm;
