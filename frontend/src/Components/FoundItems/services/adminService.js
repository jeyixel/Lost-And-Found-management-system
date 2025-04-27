import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Admin Found Items Management
export const adminService = {
    getAllItems: async () => {
        try {
            const response = await api.get('/admin/found-items');
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.error || 'Failed to fetch items');
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    },

    reportItem: async (itemData) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user._id) {
                throw new Error('User not logged in');
            }

            const response = await api.post('/admin/found-items', {
                ...itemData,
                finder: user._id
            });
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.error || 'Failed to report item');
        } catch (error) {
            console.error('Error reporting item:', error);
            throw error;
        }
    },

    updateItemStatus: async (itemId, status) => {
        try {
            const response = await api.put(`/admin/found-items/${itemId}/status`, { status });
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.error || 'Failed to update status');
        } catch (error) {
            console.error('Error updating status:', error);
            throw error;
        }
    },

    deleteItem: async (itemId) => {
        try {
            const response = await api.delete(`/admin/found-items/${itemId}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.error || 'Failed to delete item');
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    },

    updateItem: async (itemId, itemData) => {
        try {
            const response = await api.put(`/admin/found-items/${itemId}`, itemData);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.error || 'Failed to update item');
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    }
}; 