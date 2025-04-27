import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createClaim = async (claimData) => {
    try {
        const response = await api.post('/admin/claims', claimData);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to create claim');
        }
        return response.data.data;
    } catch (error) {
        console.error('Error creating claim:', error);
        throw error;
    }
};

export const getAllClaims = async () => {
    try {
        const response = await api.get('/admin/claims');
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to fetch claims');
        }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching claims:', error);
        throw error;
    }
};

export const updateClaimStatus = async (claimId, statusData) => {
    try {
        const response = await api.put(`/admin/claims/${claimId}/status`, statusData);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to update claim status');
        }
        return response.data.data;
    } catch (error) {
        console.error('Error updating claim status:', error);
        throw error;
    }
};

export const deleteClaim = async (claimId) => {
    try {
        const response = await api.delete(`/admin/claims/${claimId}`);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to delete claim');
        }
        return response.data.data;
    } catch (error) {
        console.error('Error deleting claim:', error);
        throw error;
    }
};

export const getUserClaims = async () => {
    try {
        const response = await api.get('/claims/user');
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to fetch user claims');
        }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching user claims:', error);
        throw error;
    }
}; 