'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { loginRequest, loginSuccess, loginFailure } from '@/lib/features/login/authSlice';
import toast from 'react-hot-toast';
import Link from 'next/link';

const LoginStep = ({ onLoginSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailOrMobile = formData.emailOrMobile.trim();
    const password = formData.password.trim();

    if (!emailOrMobile || !password) {
      dispatch(loginFailure('Please enter both email/mobile and password'));
      toast.error('Please enter both email/mobile and password');
      return;
    }

    // Determine if input is email or mobile
<<<<<<< HEAD
    // Remove spaces and special characters for mobile validation
    const cleanedInput = emailOrMobile.trim().replace(/[\s\-\(\)]/g, '');
    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailOrMobile);
    const isMobile = /^[0-9]{10}$/.test(cleanedInput);
=======
    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailOrMobile);
    const isMobile = /^[0-9]{10}$/.test(emailOrMobile);
>>>>>>> 2e8628eef17f96febdd1a35e7e6a0e782a90abda

    if (!isEmail && !isMobile) {
      dispatch(loginFailure('Please enter a valid email or 10-digit mobile number'));
      toast.error('Please enter a valid email or 10-digit mobile number');
      return;
    }

    dispatch(loginRequest());
    setIsSubmitting(true);

    try {
      const requestBody = {
        password: password,
        userType: 'user',
      };

      // Add email or mobile based on what was entered
      if (isEmail) {
<<<<<<< HEAD
        requestBody.email = emailOrMobile.toLowerCase().trim();
      } else {
        requestBody.mobile = cleanedInput;
=======
        requestBody.email = emailOrMobile;
      } else {
        requestBody.mobile = emailOrMobile;
>>>>>>> 2e8628eef17f96febdd1a35e7e6a0e782a90abda
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Server returned an invalid response. Please check if the backend is running.');
      }

      if (response.ok && data.success) {
        // Verify that the user's role is 'user'
        if (data.user.role !== 'user') {
          const errorMessage = 'Please use the Admin login page to login as admin.';
          dispatch(loginFailure(errorMessage));
          toast.error(errorMessage);
          setIsSubmitting(false);
          return;
        }

        dispatch(loginSuccess({ email: data.user.email || data.user.mobile, ...data.user }));
        
        // Store token and user data
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        toast.success('Login successful!');
        setIsSubmitting(false);
        onLoginSuccess();
      } else {
        const errorMessage = data.message || 'Invalid email/mobile or password';
        dispatch(loginFailure(errorMessage));
        toast.error(errorMessage);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'An error occurred. Please try again.';
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In to Continue</h2>
        <p className="text-sm text-gray-600">Please login to proceed with checkout</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email or Mobile Number
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleChange}
              placeholder="example@gmail.com or 1234567890"
              className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href="/forgot_password"
            className="text-xs text-[#7C2A47] hover:text-[#8B3A5A] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#7C2A47] hover:bg-[#6a2340] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600 mb-3">
          Don't have an account?
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C2A47] hover:text-[#8B3A5A] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginStep;

