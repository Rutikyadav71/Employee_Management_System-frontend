import axiosInstance from './axiosInstance';

const EMP_API_URL = '/api/employees';

/**
 * NOTE:
 * Although we are using `emp_id` as the actual DB primary key,
 * the backend exposes it as `id` in the REST API endpoints for simplicity.
 */

export const getEmployees = () => axiosInstance.get(EMP_API_URL);

export const addEmployee = (emp) => axiosInstance.post(EMP_API_URL, emp);

export const updateEmployee = (empId, emp) =>
  axiosInstance.put(`${EMP_API_URL}/${empId}`, emp);

export const deleteEmployee = (empId) =>
  axiosInstance.delete(`${EMP_API_URL}/${empId}`);

export const searchEmployees = (keyword) => {
  return axiosInstance.get(`${EMP_API_URL}/search?keyword=${encodeURIComponent(keyword)}`);
};

export const deleteMultipleEmployees = (empIds) => {
  return axiosInstance.post(`${EMP_API_URL}/delete-multiple`, empIds);
};

const LEAVE_API_URL = "/api/leaves";

export const getLeaveById = (leaveId) => {
  return axiosInstance.get(`${LEAVE_API_URL}/${leaveId}`);
};

export const getLeavePrediction = (leaveId) => {
  return axiosInstance.get(`${LEAVE_API_URL}/admin/${leaveId}/prediction`);
};
