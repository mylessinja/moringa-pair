import axios from 'axios';

const API_URL =
  (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000').replace(/\/$/, '') +
  '/api';

const storeSession = (data) => {
  if (!data?.access_token) {
    throw new Error('Server did not return an access token. Is the backend running?');
  }
  localStorage.setItem('moringaPairToken', data.access_token);
  if (data.user) {
    localStorage.setItem('moringaPairUser', JSON.stringify(data.user));
  }
  return data.user;
};

const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return storeSession(response.data);
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || !error.response) {
      throw new Error(
        'Cannot reach the API at ' + API_URL + '. Start the Flask backend.'
      );
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
    if (error.code === 'ERR_NETWORK' || !error.response) {
      throw new Error(
        'Cannot reach the API. Start Flask (python3 run.py) then try again.'
      );
    }
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Login failed';
    throw Object.assign(new Error(message), { response: error.response });
  }
};

const googleLogin = async (idToken) => {
  try {
    const response = await axios.post(`${API_URL}/auth/google`, {
      id_token: idToken,
    });
    return storeSession(response.data);
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || !error.response) {
      throw new Error('Cannot reach the API for Google login.');
    }
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Google login failed';
    throw Object.assign(new Error(message), { response: error.response });
  }
};

const logout = () => {
  localStorage.removeItem('moringaPairToken');
  localStorage.removeItem('moringaPairUser');
};

/** True only if we have both user snapshot and JWT */
const hasValidSession = () => {
  return Boolean(localStorage.getItem('moringaPairToken'));
};

export default {
  signUp,
  login,
  logout,
  googleLogin,
  hasValidSession,
  storeSession,
};
