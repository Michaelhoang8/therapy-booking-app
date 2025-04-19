import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getUsers = () => api.get('/users');

export default {
  getUsers,
};