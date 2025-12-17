import axiosInstance from '../api/axios';

// Get user's cart
export const fetchCart = async () => {
  try {
    const response = await axiosInstance.get('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add item to cart
export const addItemToCart = async (data) => {
  try {
    const response = await axiosInstance.post('/cart/items', data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

// Update cart item quantity
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await axiosInstance.put(`/cart/items/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

// Remove item from cart (decrease quantity)
export const removeItemFromCart = async (productId) => {
  try {
    const response = await axiosInstance.patch(`/cart/items/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

// Delete item from cart
export const deleteCartItem = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/cart/items/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

// Clear cart
export const clearUserCart = async () => {
  try {
    const response = await axiosInstance.delete('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

// Sync cart (merge localStorage with backend)
export const syncCart = async (cartItems) => {
  try {
    const response = await axiosInstance.post('/cart/sync', { cartItems });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data?.error || error.message;
  }
};

