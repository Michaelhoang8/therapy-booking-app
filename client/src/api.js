import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getUsers = () => api.get('/users');
// Add more API calls as needed

export default {
  getUsers,
  // Export other API calls
};