'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, loginSuccess, loginFailure, clearError } from '@/lib/features/login/authSlice';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { assets } from '@/assets/assets';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('admin'); // 'user' or 'admin'

  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    dispatch(loginRequest());

    try {
      // Use general login endpoint that handles both admin and user
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: userType, // Send the selected tab (admin or user)
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If response is not JSON, it might be an HTML error page
        throw new Error('Server returned an invalid response. Please check if the backend is running.');
      }

      if (response.ok && data.success) {
        // Verify that the user's role matches the selected tab
        if (data.user.role !== userType) {
          const errorMessage = `Please use the ${data.user.role === 'admin' ? 'Admin' : 'User'} tab to login.`;
          dispatch(loginFailure(errorMessage));
          toast.error(errorMessage);
          setIsSubmitting(false);
          return;
        }

        dispatch(loginSuccess({ email: formData.email, ...data.user }));
        
        // Store token if provided
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        toast.success('Login successful!');
        
        // Redirect based on user role - use window.location for immediate redirect
        if (data.user.role === 'admin') {
          // Use window.location for immediate redirect to prevent showing user dashboard
          window.location.href = '/admin';
        } else if (data.user.role === 'user') {
          // User stays on homepage (/) which will now show ecommerce content
          router.replace('/');
          router.refresh();
        } else {
          router.replace('/');
          router.refresh();
        }
      } else {
        const errorMessage = data.message || 'Invalid email or password';
        dispatch(loginFailure(errorMessage));
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'An error occurred. Please try again.';
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Prevent body scroll when login page is mounted
    document.body.style.overflow = 'hidden';
    return () => {
      // Restore body scroll when component unmounts
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex bg-gray-50 overflow-hidden">
      {/* Left Side - Promotional Section */}
      <div className="hidden lg:flex lg:w-1/3 bg-blue-900 relative overflow-hidden h-full">
        <div className="relative z-10 flex flex-col px-12 py-16 w-full h-full">
          {/* Logo - Centered at top */}
          <div className="flex justify-center mb-8 pt-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-5 shadow-xl flex items-center justify-center">
              <img 
                src={assets.gs_logo?.src || assets.gs_logo} 
                alt="Senba Pumps & Motors Logo" 
                className="object-contain"
                style={{ 
                  display: 'block', 
                  width: '140px', 
                  height: '140px',
                  maxWidth: '140px',
                  maxHeight: '140px'
                }}
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Content Section - Centered vertically */}
          <div className="flex-1 flex flex-col justify-center items-center min-h-0 text-center">
            {/* Main Heading */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Your E-Commerce Command Center
            </h1>

            {/* Description */}
            <p className="text-white text-base mb-8 max-w-lg leading-relaxed">
              Join a network of industry leaders. Whether you're managing product inventory, optimizing sales strategies, or tracking customer orders, our platform provides the tools you need for success.
            </p>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white text-base">Real-time Product Management</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white text-base">Advanced Analytics Dashboard</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white text-base">24/7 Support & Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/3 flex flex-col justify-center px-8 sm:px-12 lg:px-16 bg-gray-50 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
              Senba Pumps & Motors
            </h2>
            <p className="text-gray-500 text-base">
              Intelligent E-Commerce Management Platform
            </p>
          </div>

          {/* User Type Selector */}
          <div className="mb-6">
            <div className="inline-flex p-1 bg-gray-100 rounded-lg shadow-inner">
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  userType === 'admin'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setUserType('user')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  userType === 'user'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                User
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 mb-6">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. admin@senba.com or +1234567890"
                  autoComplete="username"
                  className={`block w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className={`block w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
