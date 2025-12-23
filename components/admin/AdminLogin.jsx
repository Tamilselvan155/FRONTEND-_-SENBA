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
      // Use admin login endpoint - always send admin as userType
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: 'admin', // Always admin for this page
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Server returned an invalid response. Please check if the backend is running.');
      }

      if (response.ok && data.success) {
        // Verify that the user is an admin
        if (data.user.role !== 'admin') {
          const errorMessage = 'Access denied. Admin privileges required.';
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
        
        // Redirect admin to admin dashboard
        window.location.href = '/admin';
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
    // Allow scrolling on mobile, prevent on desktop
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 1024;
      if (!isMobile) {
        document.body.style.overflow = 'hidden';
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row bg-gray-50 overflow-auto">
      {/* Left Side - Promotional Section */}
      <div className="hidden lg:flex lg:w-1/3 bg-blue-900 relative overflow-hidden h-full">
        <div className="relative z-10 flex flex-col px-6 xl:px-10 2xl:px-12 py-6 xl:py-12 2xl:py-16 w-full h-full overflow-y-auto">
          {/* Logo - Centered at top */}
          <div className="flex justify-center mb-4 xl:mb-6 2xl:mb-8 pt-2 xl:pt-4 2xl:pt-8 flex-shrink-0">
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 xl:p-4 2xl:p-5 shadow-2xl border border-white/20 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <img 
                src={assets.gs_logo?.src || assets.gs_logo} 
                alt="Senba Pumps & Motors Logo" 
                className="object-contain"
                style={{ 
                  display: 'block', 
                  width: '100px', 
                  height: '100px',
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
          <div className="flex-1 flex flex-col justify-center items-center min-h-0 text-center px-2 xl:px-4 py-4">
            {/* Main Heading */}
            <h1 className="text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl font-bold text-white mb-3 xl:mb-4 2xl:mb-6 leading-tight px-2 break-words">
              Your E-Commerce Command Center
            </h1>

            {/* Description */}
            <p className="text-white text-xs xl:text-sm 2xl:text-base mb-4 xl:mb-6 2xl:mb-8 max-w-lg leading-relaxed px-2 break-words">
              Join a network of industry leaders. Whether you're managing product inventory, optimizing sales strategies, or tracking customer orders, our platform provides the tools you need for success.
            </p>

            {/* Features List */}
            <div className="space-y-2 xl:space-y-2.5 2xl:space-y-3 w-full max-w-sm xl:max-w-md px-2 xl:px-4">
              <div className="flex items-start justify-start space-x-2 xl:space-x-3">
                <div className="flex-shrink-0 w-4 h-4 xl:w-5 xl:h-5 bg-white rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-2.5 h-2.5 xl:w-3 xl:h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white text-xs xl:text-sm 2xl:text-base text-left leading-snug">Real-time Product Management</span>
              </div>
              <div className="flex items-start justify-start space-x-2 xl:space-x-3">
                <div className="flex-shrink-0 w-4 h-4 xl:w-5 xl:h-5 bg-white rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-2.5 h-2.5 xl:w-3 xl:h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white text-xs xl:text-sm 2xl:text-base text-left leading-snug">Advanced Analytics Dashboard</span>
              </div>
              <div className="flex items-start justify-start space-x-2 xl:space-x-3">
                <div className="flex-shrink-0 w-4 h-4 xl:w-5 xl:h-5 bg-white rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-2.5 h-2.5 xl:w-3 xl:h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white text-xs xl:text-sm 2xl:text-base text-left leading-snug">24/7 Support & Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/3 flex flex-col justify-center min-h-screen lg:min-h-0 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-md w-full mx-auto">
          {/* Title with Logo on Mobile */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile: Logo and Title Side by Side */}
            <div className="flex items-center gap-3 sm:gap-4 mb-3 lg:hidden">
              <div className="flex-shrink-0">
                <div className="bg-white rounded-xl p-2.5 sm:p-3 shadow-lg border border-gray-100 flex items-center justify-center">
                  <img 
                    src={assets.gs_logo?.src || assets.gs_logo} 
                    alt="Senba Pumps & Motors Logo" 
                    className="object-contain"
                    style={{ 
                      display: 'block', 
                      width: '50px', 
                      height: '50px',
                      maxWidth: '60px',
                      maxHeight: '60px'
                    }}
                    onError={(e) => {
                      console.error('Logo failed to load');
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight">
                  Senba Pumps & Motors
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-tight">
                  <span className="font-semibold text-gray-700">Admin Portal -</span> Intelligent E-Commerce Management Platform
                </p>
              </div>
            </div>
            {/* Desktop: Title Only */}
            <div className="hidden lg:block text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                Senba Pumps & Motors
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                <span className="font-semibold text-gray-700">Admin Portal -</span> Intelligent E-Commerce Management Platform
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-l-4 border-red-500 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-center space-x-2 mb-4 sm:mb-6 shadow-sm animate-in fade-in slide-in-from-top-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium break-words">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4 sm:space-y-5 md:space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. admin@senba.com"
                  autoComplete="username"
                  className={`block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                    errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-white hover:border-gray-400 focus:shadow-md'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`block w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                    errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-white hover:border-gray-400 focus:shadow-md'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            {/* <div className="flex items-center justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div> */}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-11 sm:h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 text-white text-sm sm:text-base font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting || isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm sm:text-base">Signing in...</span>
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
