import axiosInstance from '../api/axios';

// Get all categories
export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get categories for dropdown
export const fetchCategoriesForDropdown = async () => {
  try {
    const response = await axiosInstance.get('/categories/dropdown');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single category
export const fetchCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create category
export const createCategory = async (data) => {
  try {
    const response = await axiosInstance.post('/categories', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update category
export const updateCategory = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete category
export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

