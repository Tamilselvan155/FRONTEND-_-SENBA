'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mail } from 'lucide-react';
import { clearError, forgetPasswordRequest, forgetPasswordSuccess, forgetPasswordFailure } from '../../../lib/features/login/authSlice';
import toast from 'react-hot-toast';
import logo from '@/assets/YUCHII LOGO.png';

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPopup, setShowPopup] = useState(false);
  const [emailOrMobile, setEmailOrMobile] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const identifier = emailOrMobile.trim();

    if (!identifier) {
      toast.error('Please enter email or mobile number');
      return;
    }

    // Determine if input is email or mobile
    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(identifier);
    const isMobile = /^[0-9]{10}$/.test(identifier);

    if (!isEmail && !isMobile) {
      toast.error('Please enter a valid email or 10-digit mobile number');
      return;
    }

    dispatch(forgetPasswordRequest());

    try {
      const requestBody = {};
      if (isEmail) {
        requestBody.email = identifier;
      } else {
        requestBody.mobile = identifier;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(forgetPasswordSuccess());
        toast.success(data.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          router.push('/login');
        }, 2000);
      } else {
        dispatch(forgetPasswordFailure(data.message || 'Failed to send reset link'));
        toast.error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      dispatch(forgetPasswordFailure('An error occurred. Please try again.'));
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-12 flex items-center justify-center relative overflow-hidden">
      {/* FORGOT PASSWORD CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C2A47]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#8B3A5A]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4 mx-auto">
              <Image 
                src={logo} 
                alt="Logo" 
                className="h-16 w-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Forgot Your Password?
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Enter your email or mobile number to reset your password
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs sm:text-sm p-3 rounded mb-5"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Mobile */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="emailOrMobile"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  placeholder="example@gmail.com or 1234567890"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-5 text-xs sm:text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/login" className="font-semibold text-[#7C2A47] hover:text-[#8B3A5A] transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="bg-white rounded-2xl shadow-2xl p-8 text-center"
            >
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Reset Link Sent</h2>
              <p className="text-gray-500">Check your email or mobile for the reset link.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgetPassword;