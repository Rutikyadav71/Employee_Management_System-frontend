import axios from 'axios';

const API_URL = 'https://ry-ems-backend.onrender.com/employees';

/**
 * NOTE:
 * Although we are using `emp_id` as the actual DB primary key,
 * the backend exposes it as `id` in the REST API endpoints for simplicity.
 */

export const getEmployees = () => axios.get(API_URL);

export const addEmployee = (emp) => axios.post(API_URL, emp);

export const updateEmployee = (empId, emp) => axios.put(`${API_URL}/${empId}`, emp);

export const deleteEmployee = (empId) => axios.delete(`${API_URL}/${empId}`);

