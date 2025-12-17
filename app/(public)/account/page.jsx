'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { signOut } from '../../../lib/features/login/authSlice';
import { clearAuthData } from '../../../lib/utils/authUtils';
import {
  LayoutGrid,
  ShoppingBag,
  Home,
  User,
  LogOut,
  CheckCircle,
  X,
} from 'lucide-react';

const Account = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { email } = useSelector((state) => state.auth);
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    createdAt: null,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user data from localStorage or backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First, try to get from localStorage
        if (typeof window !== 'undefined') {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              setUserData({
                name: user.name || '',
                email: user.email || email || '',
                createdAt: user.createdAt ? new Date(user.createdAt) : null,
              });
              setLoading(false);
              return;
            } catch (e) {
              console.error('Error parsing user data from localStorage:', e);
            }
          }
        }

        // If not in localStorage, fetch from backend
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              setUserData({
                name: data.user.name || '',
                email: data.user.email || '',
                createdAt: data.user.createdAt ? new Date(data.user.createdAt) : null,
              });
              // Update localStorage
              localStorage.setItem('user', JSON.stringify(data.user));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email]);

  const handleSignOut = (e) => {
    e.preventDefault();
    dispatch(signOut());
    clearAuthData();
    setShowPopup(true);
    
    // Auto-navigate to login page after 2 seconds
    setTimeout(() => {
      router.push('/');
      router.refresh();
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 relative min-h-screen">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="flex flex-col items-center py-6 sm:py-8 border-b border-gray-100">
          {loading ? (
            <div className="animate-pulse">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-300"></div>
              <div className="mt-3 h-4 w-32 bg-gray-300 rounded"></div>
              <div className="mt-2 h-3 w-24 bg-gray-300 rounded"></div>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl font-semibold">
                {userData.name 
                  ? userData.name.charAt(0).toUpperCase() 
                  : (userData.email ? userData.email.charAt(0).toUpperCase() : 'U')}
              </div>
              <h2 className="mt-2 sm:mt-3 text-base sm:text-lg font-semibold text-gray-900">
                {userData.name || userData.email || 'User Name'}
              </h2>
              {userData.email && userData.name && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{userData.email}</p>
              )}
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {userData.createdAt 
                  ? `Member Since ${userData.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                  : 'Member'}
              </p>
            </>
          )}
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
                router.push('/');
                router.refresh();
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

export default Account;

