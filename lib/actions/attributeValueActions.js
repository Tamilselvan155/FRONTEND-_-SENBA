import axiosInstance from '../api/axios';

// Get all attribute values
export const fetchAttributeValues = async () => {
  try {
    const response = await axiosInstance.get('/attribute-values');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get attribute values by attribute ID
export const fetchAttributeValuesByAttribute = async (attributeId) => {
  try {
    const response = await axiosInstance.get(`/attribute-values/attribute/${attributeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single attribute value
export const fetchAttributeValueById = async (id) => {
  try {
    const response = await axiosInstance.get(`/attribute-values/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create attribute value
export const createAttributeValue = async (data) => {
  try {
    const response = await axiosInstance.post('/attribute-values', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update attribute value
export const updateAttributeValue = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/attribute-values/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete attribute value
export const deleteAttributeValue = async (id) => {
  try {
    const response = await axiosInstance.delete(`/attribute-values/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

