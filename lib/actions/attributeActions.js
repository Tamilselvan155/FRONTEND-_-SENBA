import axiosInstance from '../api/axios';

// Get all attributes
export const fetchAttributes = async () => {
  try {
    const response = await axiosInstance.get('/attributes');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get attributes for dropdown
export const fetchAttributesForDropdown = async () => {
  try {
    const response = await axiosInstance.get('/attributes/dropdown');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single attribute
export const fetchAttributeById = async (id) => {
  try {
    const response = await axiosInstance.get(`/attributes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create attribute
export const createAttribute = async (data) => {
  try {
    const response = await axiosInstance.post('/attributes', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update attribute
export const updateAttribute = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/attributes/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete attribute
export const deleteAttribute = async (id) => {
  try {
    const response = await axiosInstance.delete(`/attributes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

