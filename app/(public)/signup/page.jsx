// 'use client';

// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { User, Mail, Lock, CheckCircle2, UserPlus, ArrowRight } from 'lucide-react';
// import {
//   signupRequest,
//   signupSuccess,
//   signupFailure,
// } from '../../../lib/features/login/authSlice';

// const SignUp = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { isLoading, error, users } = useSelector((state) => state.auth);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const { fullName, email, password, confirmPassword } = formData;

//     dispatch(signupRequest());

//     setTimeout(() => {
//       if (!fullName || !email || !password || !confirmPassword) {
//         dispatch(signupFailure('All fields are required'));
//         return;
//       }

//       if (password !== confirmPassword) {
//         dispatch(signupFailure('Passwords do not match'));
//         return;
//       }

//       if (password.length < 8) {
//         dispatch(signupFailure('Password must be at least 8 characters long'));
//         return;
//       }

//       if (users && users.some((user) => user.email === email)) {
//         dispatch(signupFailure('Email already exists'));
//         return;
//       }

//       dispatch(signupSuccess({ fullName, email, password }));
//       setShowSuccess(true);
//     }, 800);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-12 flex items-center justify-center relative overflow-hidden">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8 relative overflow-hidden"
//       >
//         {/* Card Decorative Elements */}
//         <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C2A47]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
//         <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#8B3A5A]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
//         <div className="relative z-10">
//           {/* Header */}
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] mb-4 mx-auto shadow-lg">
//               <UserPlus className="w-7 h-7 text-white" />
//             </div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
//               Create Your Account
//             </h1>
//             <p className="text-xs sm:text-sm text-gray-500">
//               Enter your details to get started
//             </p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs sm:text-sm p-3 rounded mb-5"
//             >
//               {error}
//             </motion.div>
//           )}

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Full Name */}
//             <div>
//               <label
//                 htmlFor="fullName"
//                 className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5"
//               >
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   id="fullName"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   placeholder="John Doe"
//                   required
//                   className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5"
//               >
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="example@gmail.com"
//                   required
//                   className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   required
//                   className="w-full pl-10 pr-16 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 hover:text-[#7C2A47] transition-colors duration-200 font-medium"
//                 >
//                   {showPassword ? 'Hide' : 'Show'}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label
//                 htmlFor="confirmPassword"
//                 className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5"
//               >
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Re-type your password"
//                   required
//                   className="w-full pl-10 pr-16 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 hover:text-[#7C2A47] transition-colors duration-200 font-medium"
//                 >
//                   {showConfirmPassword ? 'Hide' : 'Show'}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] text-white py-2.5 rounded-lg text-sm font-semibold hover:from-[#6a2340] hover:to-[#7a2a4a] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   <span>Creating Account...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Create Account</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="flex items-center my-5">
//             <hr className="flex-grow border-gray-200" />
//             <span className="mx-3 text-xs text-gray-400">Or</span>
//             <hr className="flex-grow border-gray-200" />
//           </div>

//           <p className="text-center text-xs sm:text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link
//               href="/login"
//               className="font-semibold text-[#7C2A47] hover:text-[#8B3A5A] transition-colors inline-flex items-center gap-1"
//             >
//               Sign In Now
//               <ArrowRight className="w-3 h-3" />
//             </Link>
//           </p>
//         </div>
//       </motion.div>

//       {/* Animated Success Popup */}
//       <AnimatePresence>
//         {showSuccess && (
//           <motion.div
//             key="popup"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.3, ease: 'easeOut' }}
//               className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border border-gray-200"
//             >
//               <motion.div
//                 initial={{ rotate: -20, opacity: 0 }}
//                 animate={{ rotate: 0, opacity: 1 }}
//                 transition={{ type: 'spring', stiffness: 200, damping: 10 }}
//                 className="flex justify-center mb-4"
//               >
//                 <CheckCircle2 className="w-14 h-14 text-green-500" />
//               </motion.div>

//               <motion.h2
//                 initial={{ y: -10, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.1 }}
//                 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2"
//               >
//                 Account Created Successfully!
//               </motion.h2>

//               <motion.p
//                 initial={{ y: 10, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="text-gray-500 text-sm sm:text-base mb-6"
//               >
//                 You can now sign in with your credentials
//               </motion.p>

//               <motion.button
//                 initial={{ y: 10, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//                 onClick={() => {
//                   setShowSuccess(false);
//                   router.push('/login');
//                 }}
//                 className="w-full bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] text-white py-2.5 rounded-lg text-sm font-semibold hover:from-[#6a2340] hover:to-[#7a2a4a] transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 Go to Login
//               </motion.button>

//               <motion.div
//                 initial={{ scaleX: 0 }}
//                 animate={{ scaleX: 1 }}
//                 transition={{ delay: 0.4, duration: 2, ease: 'easeInOut' }}
//                 className="mt-5 h-1 bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] rounded-full origin-left"
//               />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default SignUp;

'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, CheckCircle2, UserPlus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  signupRequest,
  signupSuccess,
  signupFailure,
  clearError,
} from '../../../lib/features/login/authSlice';

const SignUp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error, email } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    // Client-side validation
    if (!fullName || !email || !password || !confirmPassword) {
      dispatch(signupFailure('All fields are required'));
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      dispatch(signupFailure('Passwords do not match'));
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      dispatch(signupFailure('Password must be at least 8 characters long'));
      toast.error('Password must be at least 8 characters long');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(signupFailure('Please enter a valid email address'));
      toast.error('Please enter a valid email address');
      return;
    }

    dispatch(signupRequest());

    try {
      // Call the signup API endpoint
      // The backend accepts name, firstName+lastName, or just firstName
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName.trim(), // Send full name directly
          email: email,
          password: password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Server returned an invalid response. Please check if the backend is running.');
      }

      if (response.ok && data.success) {
        // Signup successful
        dispatch(signupSuccess({ 
          name: fullName.trim(),
          email: email, 
          password: password 
        }));

        // Don't auto-login, just show success and redirect to login page with email
        toast.success('Account created successfully! Please login to continue.');
        setShowSuccess(true);
        
        // Redirect to login page with email pre-filled after 2 seconds
        setTimeout(() => {
          setShowSuccess(false);
          router.push(`/login?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        // Signup failed
        const errorMessage = data.message || 'Failed to create account. Please try again.';
        dispatch(signupFailure(errorMessage));
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.message || 'An error occurred. Please try again.';
      dispatch(signupFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-12 flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C2A47]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#8B3A5A]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] mb-4 mx-auto shadow-lg">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Enter your details to get started
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
            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-16 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-[#7C2A47]"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-16 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-[#7C2A47]"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] text-white py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-gray-600 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#7C2A47]">
              Sign In Now
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
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
              <h2 className="text-xl font-semibold mb-2">Account Created!</h2>
              <p className="text-sm text-gray-600 mb-4">
                Redirecting to login page...
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  router.push(`/login?email=${encodeURIComponent(formData.email)}`);
                }}
                className="mt-4 w-full bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Go to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignUp;
