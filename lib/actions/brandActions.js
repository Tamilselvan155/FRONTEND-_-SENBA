import axiosInstance from '../api/axios';

// Get all brands
export const fetchBrands = async () => {
  try {
    const response = await axiosInstance.get('/brands');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get brands for dropdown
export const fetchBrandsForDropdown = async () => {
  try {
    const response = await axiosInstance.get('/brands/dropdown');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single brand
export const fetchBrandById = async (id) => {
  try {
    const response = await axiosInstance.get(`/brands/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create brand
export const createBrand = async (data) => {
  try {
    const response = await axiosInstance.post('/brands', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update brand
export const updateBrand = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/brands/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete brand
export const deleteBrand = async (id) => {
  try {
    const response = await axiosInstance.delete(`/brands/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

