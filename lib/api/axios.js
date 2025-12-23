import axios from 'axios';

// Backend URL is configured in .env file
// Frontend runs on port 3000, Backend API runs on port 3001

// Helper function to normalize base URL (remove trailing slash)
const normalizeBaseURL = (url) => {
  if (!url) return 'http://localhost:3001';
  return url.replace(/\/+$/, ''); // Remove trailing slashes
};

const baseURL = normalizeBaseURL(process.env.NEXT_PUBLIC_API_URL);
const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not set in .env file. Please add it.');
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

