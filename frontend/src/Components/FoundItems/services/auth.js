import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Store token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = () => {
  removeToken();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Add token to axios requests
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
); 