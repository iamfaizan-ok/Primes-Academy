import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('primes_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const reqUrl = error.config?.url || '';
      const isLoginRequest = reqUrl.includes('/login') || reqUrl.includes('/auth/admin/login') || reqUrl.includes('/auth/student/login');
      if (!isLoginRequest) {
        localStorage.removeItem('primes_auth_token');
        localStorage.removeItem('primes_user_role');
        localStorage.removeItem('primes_user_profile');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

