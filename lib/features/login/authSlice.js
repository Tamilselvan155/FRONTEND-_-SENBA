import { createSlice } from '@reduxjs/toolkit';

// Utility function to safely access sessionStorage
const getUsersFromStorage = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(sessionStorage.getItem('users') || '[]');
  }
  return [];
};

// Utility function to get email from localStorage
const getEmailFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.email || '';
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  }
  return '';
};

// Initialize state
const initialState = {
  email: getEmailFromStorage(), // Load email from localStorage on init
  isLoading: false,
  error: null,
  users: getUsersFromStorage(), // Load users from sessionStorage
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.email = action.payload.email;
      // Persist email to localStorage via user object (already stored in login page)
      // The email is part of the user object stored in localStorage
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    signupRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signupSuccess: (state, action) => {
      state.isLoading = false;
      const newUser = {
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        password: action.payload.password,
      };
      state.users.push(newUser);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('users', JSON.stringify(state.users));
      }
    },
    signupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    forgetPasswordRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    forgetPasswordSuccess: (state) => {
      state.isLoading = false;
    },
    forgetPasswordFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    signOut: (state) => {
      state.email = '';
      state.isLoading = false;
      state.error = null;
      // Clear localStorage (handled by clearAuthData in signout page)
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  forgetPasswordRequest,
  forgetPasswordSuccess,
  forgetPasswordFailure,
  clearError,
  signOut,
} = authSlice.actions;
export default authSlice.reducer;