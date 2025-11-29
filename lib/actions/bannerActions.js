import axiosInstance from '../api/axios';

// Get all banners
export const fetchBanners = async () => {
  try {
    const response = await axiosInstance.get('/banners');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single banner
export const fetchBannerById = async (id) => {
  try {
    const response = await axiosInstance.get(`/banners/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create banner
export const createBanner = async (data) => {
  try {
    const response = await axiosInstance.post('/banners', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update banner
export const updateBanner = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/banners/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete banner
export const deleteBanner = async (id) => {
  try {
    const response = await axiosInstance.delete(`/banners/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

