import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const DEMO_USERS = {
  'admin@moringapair.com': {
    password: 'Admin123!',
    user: {
      id: 'demo-admin-1',
      name: 'Admin User',
      email: 'admin@moringapair.com',
      role: 'admin',
    },
    token: 'demo-admin-token',
  },
  'student@moringapair.com': {
    password: 'Student123!',
    user: {
      id: 'demo-student-1',
      name: 'Student User',
      email: 'student@moringapair.com',
      role: 'student',
    },
    token: 'demo-student-token',
  },
  'mentor@moringapair.com': {
    password: 'Mentor123!',
    user: {
      id: 'demo-mentor-1',
      name: 'Albert Byrone',
      email: 'mentor@moringapair.com',
      role: 'mentor',
    },
    token: 'demo-mentor-token',
  },
};

const normalizeUser = (response) => response?.user || response;
const normalizeToken = (response) => response?.token || response?.accessToken || null;

const signUp = async (userData) => {
  const normalizedEmail = (userData.email || '').toLowerCase();
  const demoUser = DEMO_USERS[normalizedEmail];

  if (demoUser) {
    return { ...demoUser.user, token: demoUser.token };
  }

  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    const user = normalizeUser(response.data);
    return { ...user, token: normalizeToken(response.data) || 'demo-signup-token' };
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message.includes('localhost:5000')) {
      return {
        id: `demo-${Date.now()}`,
        name: userData.name || 'Demo User',
        email: normalizedEmail,
        role: 'student',
        token: 'demo-signup-token',
      };
    }
    throw error;
  }
};

const login = async (credentials) => {
  const normalizedEmail = (credentials.email || '').trim().toLowerCase();
  const demoUser = DEMO_USERS[normalizedEmail];

  if (demoUser && demoUser.password === credentials.password) {
    return { ...demoUser.user, token: demoUser.token };
  }

  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const user = normalizeUser(response.data);
    return { ...user, token: normalizeToken(response.data) || 'demo-login-token' };
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message.includes('localhost:5000')) {
      const fallbackUser = DEMO_USERS[normalizedEmail];
      if (fallbackUser && fallbackUser.password === credentials.password) {
        return { ...fallbackUser.user, token: fallbackUser.token };
      }
      throw new Error('Use one of the demo role accounts shown on the login page.');
    }
    throw error;
  }
};

export default { signUp, login };
