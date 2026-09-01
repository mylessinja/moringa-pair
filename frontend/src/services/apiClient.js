import axios from 'axios';

// Shared axios instance for any authenticated backend call. Attaches the
// JWT saved by authService.js on login/signup, so every request that
// needs `@admin_required` (or any other jwt_required route) works without
// each caller having to remember to set the header itself.
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('moringaPairToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token missing/expired/invalid - clear it so the next request
      // doesn't keep retrying with a dead token.
      localStorage.removeItem('moringaPairToken');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
