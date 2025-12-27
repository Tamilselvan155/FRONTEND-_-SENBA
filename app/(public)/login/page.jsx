// 'use client';

// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CheckCircle2, Mail, Lock, Shield, ArrowRight } from 'lucide-react';
// import { loginRequest, loginSuccess, loginFailure } from '../../../lib/features/login/authSlice';
// import toast from 'react-hot-toast';

// const Login = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { isLoading, error } = useSelector((state) => state.auth);

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const email = formData.email.trim();
//     const password = formData.password.trim();

//     if (!email || !password) {
//       dispatch(loginFailure('Please enter both email and password'));
//       return;
//     }

//     dispatch(loginRequest());

//     try {
//       // Use the real API endpoint for user login
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: email,
//           password: password,
//           userType: 'user', // Specify user type
//         }),
//       });

//       let data;
//       try {
//         data = await response.json();
//       } catch (jsonError) {
//         throw new Error('Server returned an invalid response. Please check if the backend is running.');
//       }

//       if (response.ok && data.success) {
//         // Verify that the user's role is 'user'
//         if (data.user.role !== 'user') {
//           const errorMessage = `Please use the Admin login page to login as admin.`;
//           dispatch(loginFailure(errorMessage));
//           toast.error(errorMessage);
//           return;
//         }

//         dispatch(loginSuccess({ email: data.user.email, ...data.user }));
        
//         // Store token and user data
//         if (data.token) {
//           localStorage.setItem('token', data.token);
//         }
//         if (data.user) {
//           localStorage.setItem('user', JSON.stringify(data.user));
//         }

//         toast.success('Login successful!');
//         setShowPopup(true);
        
//         setTimeout(() => {
//           setShowPopup(false);
//           router.push('/');
//           router.refresh();
//         }, 2000);
//       } else {
//         const errorMessage = data.message || 'Invalid email or password';
//         dispatch(loginFailure(errorMessage));
//         toast.error(errorMessage);
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       const errorMessage = 'An error occurred. Please try again.';
//       dispatch(loginFailure(errorMessage));
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-12 flex items-center justify-center relative overflow-hidden">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8 relative overflow-hidden"
//       >
//               {/* Card Decorative Elements */}
//               <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C2A47]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
//               <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#8B3A5A]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
              
//               <div className="relative z-10">
//                 {/* Header */}
//                 <div className="text-center mb-6">
//                   <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] mb-4 mx-auto shadow-lg">
//                     <Lock className="w-7 h-7 text-white" />
//                   </div>
//                   <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
//                     Sign In to Your Account
//                   </h1>
//                   <p className="text-xs sm:text-sm text-gray-500">
//                     Enter your credentials to continue
//                   </p>
//                 </div>  

//                 {/* Error Message */}
//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs sm:text-sm p-3 rounded mb-5"
//                   >
//                     {error}
//                   </motion.div>
//                 )}

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label
//                       htmlFor="email"
//                       className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5"
//                     >
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="email"
//                         id="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="example@gmail.com"
//                         required
//                         className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="password"
//                       className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5"
//                     >
//                       Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type={showPassword ? 'text' : 'password'}
//                         id="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         placeholder="Enter your password"
//                         required
//                         className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 hover:text-[#7C2A47] transition-colors duration-200 font-medium"
//                       >
//                         {showPassword ? 'Hide' : 'Show'}
//                       </button>
//                     </div>
//                   </div>

//             <div className="flex items-center justify-between text-xs">
//               <label className="flex items-center">
//                 <input type="checkbox" className="mr-1.5 rounded border-gray-300 text-[#7C2A47] focus:ring-[#7C2A47]" />
//                 <span className="text-gray-600">Remember me</span>
//               </label>
//               <Link href="/forgot_password" className="text-[#7C2A47] hover:text-[#8B3A5A] font-medium transition-colors">
//                 Forgot password?
//               </Link>
//             </div>

//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] text-white py-2.5 rounded-lg text-sm font-semibold hover:from-[#6a2340] hover:to-[#7a2a4a] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
//                   >
//                     {isLoading ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         <span>Signing in...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Sign In</span>
//                         <ArrowRight className="w-4 h-4" />
//                       </>
//                     )}
//                   </button>
//                 </form>

//                 <div className="flex items-center my-5">
//                   <hr className="flex-grow border-gray-200" />
//                   <span className="mx-3 text-xs text-gray-400">Or</span>
//                   <hr className="flex-grow border-gray-200" />
//                 </div>

//                 <p className="text-center text-xs sm:text-sm text-gray-600">
//                   Don't have an account?{' '}
//                   <Link
//                     href="/signup"
//                     className="font-semibold text-[#7C2A47] hover:text-[#8B3A5A] transition-colors inline-flex items-center gap-1"
//                   >
//                     Sign Up Now
//                     <ArrowRight className="w-3 h-3" />
//                   </Link>
//                 </p>
//               </div>
//         </motion.div>

//       {/* Animated Success Popup */}
//       <AnimatePresence>
//         {showPopup && (
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
//                 Login Successful
//               </motion.h2>

//               <motion.p
//                 initial={{ y: 10, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="text-gray-500 text-sm sm:text-base"
//               >
//                 Redirecting to your home page...
//               </motion.p>

//               <motion.div
//                 initial={{ scaleX: 0 }}
//                 animate={{ scaleX: 1 }}
//                 transition={{ delay: 0.3, duration: 2, ease: 'easeInOut' }}
//                 className="mt-5 h-1 bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] rounded-full origin-left"
//               />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };
// export default Login;
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { loginRequest, loginSuccess, loginFailure } from '@/lib/features/login/authSlice';
import { syncCartAsync, fetchCartAsync } from '@/lib/features/cart/cartSlice';
import toast from 'react-hot-toast';
import logo from '@/assets/YUCHII LOGO.png';

function LoginPageContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: reduxLoading, error: reduxError } = useSelector((state) => state.auth);
  
  // Get email from query params if available (from signup redirect)
  const emailFromParams = searchParams.get('email');
  
  const [formData, setFormData] = useState({ 
    emailOrMobile: emailFromParams || '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Update email if it comes from query params
  useEffect(() => {
    if (emailFromParams) {
      setFormData(prev => ({ ...prev, emailOrMobile: emailFromParams }));
      // Show success message if coming from signup
      toast.success('Account created! Please enter your password to login.');
    }
  }, [emailFromParams]);

  const isLoading = reduxLoading;
  const error = reduxError;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailOrMobile = formData.emailOrMobile.trim();
    const password = formData.password.trim();

    if (!emailOrMobile || !password) {
      dispatch(loginFailure('Please enter both email/mobile and password'));
      return;
    }

    // Determine if input is email or mobile
    // Remove spaces and special characters for mobile validation
    const cleanedInput = emailOrMobile.trim().replace(/[\s\-\(\)]/g, '');
    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailOrMobile);
    const isMobile = /^[0-9]{10}$/.test(cleanedInput);

    if (!isEmail && !isMobile) {
      dispatch(loginFailure('Please enter a valid email or 10-digit mobile number'));
      toast.error('Please enter a valid email or 10-digit mobile number');
      return;
    }

    dispatch(loginRequest());

    try {
      // Use the real API endpoint for user login
      const requestBody = {
        password: password,
        userType: 'user', // Specify user type
      };

      // Add email or mobile based on what was entered
      if (isEmail) {
        requestBody.email = emailOrMobile.toLowerCase().trim();
      } else {
        requestBody.mobile = cleanedInput;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      let data;
      let responseText = '';
      try {
        responseText = await response.text();
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        console.error('Failed to parse response:', jsonError);
        console.error('Response status:', response.status);
        console.error('Response text:', responseText);
        throw new Error('Server returned an invalid response. Please check if the backend is running.');
      }

      if (response.ok && data.success) {
        // Verify that the user's role is 'user'
        if (data.user.role !== 'user') {
          const errorMessage = `Please use the Admin login page to login as admin.`;
          dispatch(loginFailure(errorMessage));
          toast.error(errorMessage);
          return;
        }

        dispatch(loginSuccess({ email: data.user.email, ...data.user }));
        
        // Store token and user data
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Sync cart with backend after login
        try {
          const cartItems = JSON.parse(localStorage.getItem('cart') || '{}').cartItems || {};
          if (Object.keys(cartItems).length > 0) {
            // Sync localStorage cart with backend
            await dispatch(syncCartAsync(cartItems)).unwrap();
          } else {
            // Fetch cart from backend if no local cart
            await dispatch(fetchCartAsync()).unwrap();
          }
        } catch (cartError) {
          console.error('Cart sync error:', cartError);
          // Don't block login if cart sync fails
        }

        toast.success('Login successful!');
        setShowPopup(true);
        
        // Check for redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        
        setTimeout(() => {
          setShowPopup(false);
          if (redirect === 'checkout') {
            router.push('/cart?checkout=true');
          } else {
            router.push('/');
          }
          router.refresh();
        }, 2000);
      } else {
        // Log detailed error information for debugging
        console.error('Login failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          requestBody: { ...requestBody, password: '***' } // Hide password in logs
        });
        
        const errorMessage = data?.message || `Login failed (${response.status}). Please check your credentials.`;
        dispatch(loginFailure(errorMessage));
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'An error occurred. Please try again.';
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-12 flex items-center justify-center relative overflow-hidden">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-gray-600 hover:text-[#7C2A47] transition-colors z-10"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>
      
      {/* LOGIN CARD */}
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
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Enter your credentials to continue
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
                  value={formData.emailOrMobile}
                  onChange={handleChange}
                  placeholder="example@gmail.com or 1234567890"
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
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47]"
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

            {/* Options */}
            <div className="flex justify-between text-xs">
              <label className="flex items-center">
                <input type="checkbox" className="mr-1.5" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot_password" className="text-[#7C2A47] font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-5 text-xs sm:text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              href={searchParams.get('redirect') === 'checkout' ? '/signup?redirect=checkout' : '/signup'} 
              className="font-semibold text-[#7C2A47]"
            >
              Sign Up Now
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
              <h2 className="text-xl font-semibold mb-2">Login Successful</h2>
              <p className="text-gray-500">Redirecting to your home page…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C2A47] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
