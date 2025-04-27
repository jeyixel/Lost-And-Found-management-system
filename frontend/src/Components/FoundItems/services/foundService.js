import axios from 'axios';

const API_URL = 'http://localhost:5000/found-items';

// Found Items Management
export const foundService = {
  // Get all found items
  getAllItems: async () => {
    return await axios.get(API_URL);
  },

  // Get my reported items
  getMyReports: async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not logged in');
    }
    return await axios.get(`${API_URL}/my-reports?userId=${userId}`);
  },

  // Report a new found item
  reportItem: async (itemData) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not logged in');
    }
    return await axios.post(API_URL, { ...itemData, finder: userId });
  },

  // Update item
  updateItem: async (itemId, itemData) => {
    return await axios.put(`${API_URL}/${itemId}`, itemData);
  },

  // Get item details
  getItemDetails: async (itemId) => {
    return await axios.get(`${API_URL}/${itemId}`);
  },

  // Delete item
  deleteItem: async (itemId) => {
    return await axios.delete(`${API_URL}/${itemId}`);
  },

  // Send notification
  sendNotification: async (notificationData) => {
    return await axios.post(`${API_URL}/notify`, notificationData);
  }
}; 