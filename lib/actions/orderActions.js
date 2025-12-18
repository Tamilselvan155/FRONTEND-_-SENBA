import axiosInstance from '../api/axios';

// Create order
export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

// Get current user's orders
export const fetchMyOrders = async () => {
  try {
    const response = await axiosInstance.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single order
export const fetchOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

