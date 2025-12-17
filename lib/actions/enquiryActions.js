import axiosInstance from '../api/axios';

// Create enquiry
export const createEnquiry = async (data) => {
  try {
    const response = await axiosInstance.post('/enquiries', data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

// Get all enquiries (Admin only)
export const fetchAllEnquiries = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/enquiries${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's enquiries by userId (Admin only)
export const fetchUserEnquiries = async (userId) => {
  try {
    const response = await axiosInstance.get(`/enquiries/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single enquiry by ID (Admin only)
export const fetchEnquiryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/enquiries/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update enquiry status (Admin only)
export const updateEnquiryStatus = async (id, status, notes = null) => {
  try {
    const response = await axiosInstance.put(`/enquiries/${id}/status`, { status, notes });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

