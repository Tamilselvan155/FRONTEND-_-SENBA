'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { clearError, forgetPasswordRequest, forgetPasswordSuccess, forgetPasswordFailure } from '../../../lib/features/login/authSlice';

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error, users } = useSelector((state) => state.auth);
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgetPasswordRequest());

    setTimeout(() => {
      const user = users?.find((u) => u.email === email.trim());
      if (user) {
        dispatch(forgetPasswordSuccess());
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          router.push('/login');
        }, 2000);
      } else {
        dispatch(forgetPasswordFailure('No account found with this email'));
      }
    }, 1000);
  };

  return (
    <div className="bg-white px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Breadcrumbs */}
      <nav className="w-full max-w-7xl mx-auto mb-8 text-sm font-medium text-gray-600">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-[#f48638] hover:text-[#c31e5aff] transition-colors duration-200">
              Home
            </Link>
          </li>
          <li>
            <span className="text-gray-400">&gt;</span>
          </li>
          <li>
            <Link href="/login" className="text-[#f48638] hover:text-[#c31e5aff] transition-colors duration-200">
              Sign In
            </Link>
          </li>
          <li>
            <span className="text-gray-400">&gt;</span>
          </li>
          <li>
            <span className="text-gray-700">Forgot Password</span>
          </li>
        </ol>
      </nav>

      {/* Forget Password Card */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-center text-[#c31e5aff] mb-2">
            Forgot Your Password?
          </h1>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-8">
            Enter your email to reset your password
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-600 text-sm sm:text-base p-3 rounded mb-6 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-[#0F172A] transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0F172A] text-white py-3 rounded-md text-sm sm:text-base font-medium hover:bg-[#0a1220] transition disabled:opacity-60"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600 text-xs sm:text-sm">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#f48638] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Animated Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border border-gray-200"
            >
              <motion.div
                initial={{ rotate: -20, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="flex justify-center mb-4"
              >
                <CheckCircle2 className="w-14 h-14 text-green-500" />
              </motion.div>

              <motion.h2
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl sm:text-2xl font-semibold text-[#0F172A] mb-2"
              >
                Reset Link Sent
              </motion.h2>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-sm sm:text-base"
              >
                Check your email for the reset link.
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 2, ease: 'easeInOut' }}
                className="mt-5 h-1 bg-green-500 rounded-full origin-left"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgetPassword;