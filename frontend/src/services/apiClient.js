import axios from 'axios';

const rawBase = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000').replace(
  /\/$/,
  ''
);

const apiClient = axios.create({
  baseURL: `${rawBase}/api`,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('moringaPairToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Token missing/invalid — clear so UI can force re-login
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/signup')) {
        console.warn('[api] 401', url, 'token present?', !!localStorage.getItem('moringaPairToken'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
