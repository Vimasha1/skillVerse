import axios from 'axios';

const client = axios.create({
  baseURL: '/api',                // ← prepend /api to every call
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

client.interceptors.request.use(
  cfg => {
    const token = localStorage.getItem('token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  },
  err => Promise.reject(err)
);

export default client;
