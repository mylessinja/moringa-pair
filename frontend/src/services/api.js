const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('access_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
  }
}

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
