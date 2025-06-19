import axios from 'axios';

const API_URL = 'https://joyful-bravery-production.up.railway.app/api/employees';


export const getEmployees = () => axios.get(API_URL);
export const addEmployee = (emp) => axios.post(API_URL, emp);
export const updateEmployee = (id, emp) => axios.put(`${API_URL}/${id}`, emp);
export const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`);
