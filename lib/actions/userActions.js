import axiosInstance from '../api/axios';

// Get all users (Admin only)
export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get('/auth/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single user by ID
export const fetchUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/auth/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create user
export const createUser = async (data) => {
  try {
    const response = await axiosInstance.post('/auth/users', data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

// Update user
export const updateUser = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/auth/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/auth/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

// Get user's cart by userId (Admin only)
export const fetchUserCart = async (userId) => {
  try {
    const response = await axiosInstance.get(`/cart/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's enquiries by userId (Admin only)
export const fetchUserEnquiries = async (userId) => {
  try {
    const response = await axiosInstance.get(`/auth/users/${userId}/enquiries`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

