import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:5000/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = process.env.ADMIN_TOKEN;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
