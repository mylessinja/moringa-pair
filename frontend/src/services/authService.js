import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Offline fallback only — used when the local Flask backend isn't running.
// Matches the accounts seeded by backend/seed.py so the two stay in sync.
const DEMO_USERS = {
  'admin@moringapair.com': {
    password: 'admin123',
    user: { id: 'demo-admin-1', name: 'System Admin', email: 'admin@moringapair.com', role: 'admin' },
  },
  'a.byrone@moringapair.com': {
    password: 'mentor123',
    user: { id: 'demo-mentor-1', name: 'Albert Byrone', email: 'a.byrone@moringapair.com', role: 'mentor' },
  },
  'v.sinja@moringapair.com': {
    password: 'student123',
    user: { id: 'demo-student-1', name: 'Victor Sinja', email: 'v.sinja@moringapair.com', role: 'student' },
  },
};

const isBackendUnreachable = (error) => error.code === 'ERR_NETWORK' || !error.response;

const storeSession = (data) => {
  if (data?.access_token) {
    localStorage.setItem('moringaPairToken', data.access_token);
  }
  return data?.user;
};

const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return storeSession(response.data);
  } catch (error) {
    if (isBackendUnreachable(error)) {
      return {
        id: `demo-${Date.now()}`,
        name: userData.name || 'Demo User',
        email: (userData.email || '').toLowerCase(),
        role: 'student',
      };
    }
    throw error;
  }
};

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return storeSession(response.data);
  } catch (error) {
    if (isBackendUnreachable(error)) {
      const normalizedEmail = (credentials.email || '').trim().toLowerCase();
      const demoUser = DEMO_USERS[normalizedEmail];
      if (demoUser && demoUser.password === credentials.password) {
        return demoUser.user;
      }
      throw new Error('Backend is not running locally, and no demo account matches those credentials.');
    }
    throw error;
  }
};

export default { signUp, login };
