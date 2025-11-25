import axiosInstance from '../api/axios';

// Get all products
export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get('/products');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single product
export const fetchProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create product
export const createProduct = async (data) => {
  try {
    const response = await axiosInstance.post('/products', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update product
export const updateProduct = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

