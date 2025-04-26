import axios from 'axios';

// Get the current port from the window location
const getPort = () => {
  const port = window.location.port;
  return port ? port : '5000'; // Default to 5000 if no port is specified
};

const API_URL = `http://localhost:${getPort()}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Found Items
export const getFoundItems = async () => {
  try {
    return await api.get('/found-items');
  } catch (error) {
    console.error('Error in getFoundItems:', error);
    throw error;
  }
};

export const createFoundItem = async (itemData) => {
  try {
    return await api.post('/found-items', itemData);
  } catch (error) {
    console.error('Error in createFoundItem:', error);
    throw error;
  }
};

export const getMyReports = async () => {
  try {
    return await api.get('/found-items/my-items');
  } catch (error) {
    console.error('Error in getMyReports:', error);
    throw error;
  }
};

export const updateItemStatus = async (itemId, status) => {
  try {
    return await api.patch(`/found-items/${itemId}/status`, { status });
  } catch (error) {
    console.error('Error in updateItemStatus:', error);
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    return await api.delete(`/found-items/${itemId}`);
  } catch (error) {
    console.error('Error in deleteItem:', error);
    throw error;
  }
};

export const checkForDuplicates = async (itemData) => {
  try {
    return await api.post('/found-items/check-duplicates', itemData);
  } catch (error) {
    console.error('Error in checkForDuplicates:', error);
    throw error;
  }
};