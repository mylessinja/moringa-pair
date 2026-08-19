import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // adjust once Role 1 gives you the real base URL

const signUp = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export default { signUp, login };