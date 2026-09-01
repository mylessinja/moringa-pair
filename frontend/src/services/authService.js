import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DEMO_USERS = {
  'admin@moringapair.com': {
    password: 'admin123',
    user: { id: 1, name: 'System Admin', email: 'admin@moringapair.com', role: 'admin', status: 'active' },
  },
  'a.byrone@moringapair.com': {
    password: 'mentor123',
    user: { id: 2, name: 'Albert Byrone', email: 'a.byrone@moringapair.com', role: 'mentor', status: 'active' },
  },
  'v.sinja@moringapair.com': {
    password: 'student123',
    user: { id: 6, name: 'Victor Sinja', email: 'v.sinja@moringapair.com', role: 'student', status: 'active' },
  },
};

const isBackendUnreachable = (error) =>
  error.code === 'ERR_NETWORK' || !error.response;

const storeSession = (data) => {
  if (data?.access_token) {
    localStorage.setItem('moringaPairToken', data.access_token);
  }
  if (data?.user) {
    localStorage.setItem('moringaPairUser', JSON.stringify(data.user));
  }
  return data?.user;
};

const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return storeSession(response.data);
  } catch (error) {
    if (isBackendUnreachable(error)) {
      const offlineUser = {
        id: `demo-${Date.now()}`,
        name: userData.name || 'Demo User',
        email: (userData.email || '').toLowerCase(),
        role: userData.role || 'student',
        status: 'active',
      };
      localStorage.setItem('moringaPairUser', JSON.stringify(offlineUser));
      return offlineUser;
    }
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Sign up failed';
    throw Object.assign(new Error(message), { response: error.response });
  }
};

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: (credentials.email || '').trim().toLowerCase(),
      password: credentials.password,
    });
    return storeSession(response.data);
  } catch (error) {
    if (isBackendUnreachable(error)) {
      const normalizedEmail = (credentials.email || '').trim().toLowerCase();
      const demoUser = DEMO_USERS[normalizedEmail];
      if (demoUser && demoUser.password === credentials.password) {
        localStorage.setItem('moringaPairUser', JSON.stringify(demoUser.user));
        return demoUser.user;
      }
      throw new Error('Backend is not running. Try admin@moringapair.com / admin123');
    }
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Login failed';
    throw Object.assign(new Error(message), { response: error.response });
  }
};

const logout = () => {
  localStorage.removeItem('moringaPairToken');
  localStorage.removeItem('moringaPairUser');
};

export default { signUp, login, logout, googleLogin: async () => { throw new Error('Google login not configured'); }};
