'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { signOut } from '../../../lib/features/login/authSlice';
import {
  LayoutGrid,
  ShoppingBag,
  Home,
  User,
  LogOut,
  CheckCircle,
  X,
} from 'lucide-react';

const SignOut = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { firstName, lastName } = useSelector((state) => state.auth);

  const [showPopup, setShowPopup] = useState(false);

  const handleSignOut = (e) => {
    e.preventDefault();
    dispatch(signOut());
    setShowPopup(true);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="flex flex-col items-center py-6 sm:py-8 border-b border-gray-100">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl font-semibold">
            {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="mt-2 sm:mt-3 text-base sm:text-lg font-semibold text-gray-900">
            {firstName && lastName ? `${firstName} ${lastName}` : 'User Name'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">Member Since Sep 2020</p>
        </div>

        {/* Menu */}
        <div className="p-3 sm:p-4 space-y-2">
          <button className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-sm sm:text-base">
            <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5" />
            Dashboard
          </button>

          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <span className="text-gray-700 font-medium text-xs sm:text-sm">Orders</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition">
            <Home className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <span className="text-gray-700 font-medium text-xs sm:text-sm">Addresses</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <span className="text-gray-700 font-medium text-xs sm:text-sm">Account Details</span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-red-50 transition text-red-600 font-medium text-xs sm:text-sm"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* ✅ Logout Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-white p-6 rounded-xl shadow-xl text-center max-w-sm mx-auto animate-fade-in">
            <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Signed Out Successfully!
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              You have been signed out. Please sign in again to continue.
            </p>
            <button
              onClick={() => {
                setShowPopup(false);
                router.push('/login');
              }}
              className="w-full bg-[#f48638] text-white py-2.5 rounded-lg font-medium hover:bg-[#c31e5a] transition"
            >
              Go to Sign In
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignOut;
