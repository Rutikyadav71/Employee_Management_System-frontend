import axios from 'axios';

const EMP_API_URL = 'http://localhost:8080/api/employees';

/**
 * NOTE:
 * Although we are using `emp_id` as the actual DB primary key,
 * the backend exposes it as `id` in the REST API endpoints for simplicity.
 */

export const getEmployees = () => axios.get(EMP_API_URL);

export const addEmployee = (emp) => axios.post(EMP_API_URL, emp);

export const updateEmployee = (empId, emp) =>
  axios.put(`${EMP_API_URL}/${empId}`, emp);

export const deleteEmployee = (empId) =>
  axios.delete(`${EMP_API_URL}/${empId}`);

export const searchEmployees = (keyword) => {
  return axios.get(`${EMP_API_URL}/search?keyword=${encodeURIComponent(keyword)}`);
};

export const deleteMultipleEmployees = (empIds) => {
  return axios.post(`${EMP_API_URL}/delete-multiple`, empIds);
};

const LEAVE_API_URL = "http://localhost:8080/api/leaves";

export const getLeaveById = (leaveId) => {
  return axios.get(`${LEAVE_API_URL}/${leaveId}`);
};

export const getLeavePrediction = (leaveId) => {
  return axios.get(`${LEAVE_API_URL}/admin/${leaveId}/prediction`);
};
