import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    // global error handler — you can hook to a toast system here
    return Promise.reject(err);
  }
);

export default axiosInstance;
