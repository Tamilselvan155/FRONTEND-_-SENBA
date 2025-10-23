import { createSlice } from '@reduxjs/toolkit';

// Utility function to safely access sessionStorage
const getUsersFromStorage = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(sessionStorage.getItem('users') || '[]');
  }
  return [];
};

// Initialize state
const initialState = {
  email: '', // Stores the email of the logged-in user
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