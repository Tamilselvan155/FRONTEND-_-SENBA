import axiosInstance from '../api/axios';

// Create enquiry
export const createEnquiry = async (data) => {
  try {
    const response = await axiosInstance.post('/enquiries', data);
    if (response.data && response.data.success) {
      return response.data;
    }
    throw new Error(response.data?.message || 'Failed to create enquiry');
  } catch (error) {
    // Extract error message from various possible error formats
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Failed to submit enquiry. Please try again.';
    throw new Error(errorMessage);
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

