/**
 * Authentication utility functions
 */

/**
 * Clear all authentication data
 * This function clears Redux state, localStorage, and sessionStorage
 */
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear sessionStorage (if used)
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('users'); // Clear users array if exists
    
    // Clear any other auth-related data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return token !== null && user !== null;
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Get auth token from localStorage
 * @returns {string|null} Token or null
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

