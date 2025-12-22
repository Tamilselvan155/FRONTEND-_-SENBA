'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
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
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import OrdersSection from '@/components/account/OrdersSection';
import CollectionsWishlistSection from '@/components/account/CollectionsWishlistSection';
import AccountDetailsSection from '@/components/account/AccountDetailsSection';
import AddressesSection from '@/components/account/AddressesSection';
import EnquirySection from '@/components/account/EnquirySection';
import ContactUsSection from '@/components/account/ContactUsSection';
import BackButton from '@/components/BackButton';

const AccountContent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { email } = useSelector((state) => state.auth);
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
    createdAt: null,
    id: '',
  });
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  

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
                role: user.role || 'user',
                status: user.status || 'active',
                createdAt: user.createdAt ? new Date(user.createdAt) : null,
                id: user.id || user._id || '',
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
                role: data.user.role || 'user',
                status: data.user.status || 'active',
                createdAt: data.user.createdAt ? new Date(data.user.createdAt) : null,
                id: data.user.id || data.user._id || '',
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

  // Check URL params for section navigation
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && ['dashboard', 'orders', 'addresses', 'account', 'collections-wishlist'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);




  const handleSignOutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (apiError) {
          console.log('Logout API call failed, proceeding with client-side logout');
        }
      }

      dispatch(signOut());
      clearAuthData();
      setShowLogoutModal(false);
      setIsLoggingOut(false);
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      toast.error('An error occurred during logout');
    }
  };


  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: Home },
    { id: 'account', label: 'Account Details', icon: User },
  ];

  const getInitials = () => {
    if (userData.name) {
      const names = userData.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (userData.email) {
      return userData.email[0].toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C2A47] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Go Back Button - Top Left Corner */}
        <div className="mb-4 sm:mb-5">
          <BackButton fallbackUrl="/" />
        </div>
        {/* Page Header with Profile */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[#7C2A47] flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold flex-shrink-0">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {userData.name || userData.email || 'User'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">{userData.email}</p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                  <p className="text-xs text-gray-500">
                    {userData.createdAt 
                      ? `Member Since ${userData.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                      : 'Member'}
                  </p>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      userData.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {userData.status ? userData.status.charAt(0).toUpperCase() + userData.status.slice(1) : 'Active'}
                    </span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type:</span>
                    <span className="text-xs text-gray-700 font-medium capitalize">{userData.role || 'User'}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOutClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-auto ml-auto sm:ml-0"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide -mb-px">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeSection === 'dashboard'
                    ? 'border-[#7C2A47] text-[#7C2A47]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveSection('account')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeSection === 'account'
                    ? 'border-[#7C2A47] text-[#7C2A47]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={() => setActiveSection('orders')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeSection === 'orders'
                    ? 'border-[#7C2A47] text-[#7C2A47]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                Orders
              </button>
             
              <button
                onClick={() => setActiveSection('addresses')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeSection === 'addresses'
                    ? 'border-[#7C2A47] text-[#7C2A47]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Home className="h-4 w-4" />
                Addresses
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6">
              {activeSection === 'dashboard' && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Orders Card */}
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 text-left group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#7C2A47]/10 transition-colors">
                          <ShoppingBag className="h-8 w-8 text-gray-600 group-hover:text-[#7C2A47] transition-colors" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">Orders</h3>
                        <p className="text-xs text-gray-600">Check your order status</p>
                      </div>
                    </button>

                    {/* Collections & Wishlist Card */}
                    <button
                      onClick={() => setActiveSection('collections-wishlist')}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 text-left group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#7C2A47]/10 transition-colors">
                          <LayoutGrid className="h-8 w-8 text-gray-600 group-hover:text-[#7C2A47] transition-colors" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">Collections & Wishlist</h3>
                        <p className="text-xs text-gray-600">All your curated product collections</p>
                      </div>
                    </button>

                    {/* Account Details Card */}
                    <button
                      onClick={() => setActiveSection('account')}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 text-left group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#7C2A47]/10 transition-colors">
                          <User className="h-8 w-8 text-gray-600 group-hover:text-[#7C2A47] transition-colors" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">Account Details</h3>
                        <p className="text-xs text-gray-600">Manage your profile information</p>
                      </div>
                    </button>

                    {/* Addresses Card */}
                    <button
                      onClick={() => setActiveSection('addresses')}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 text-left group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#7C2A47]/10 transition-colors">
                          <Home className="h-8 w-8 text-gray-600 group-hover:text-[#7C2A47] transition-colors" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">Addresses</h3>
                        <p className="text-xs text-gray-600">Manage your delivery addresses</p>
                      </div>
                    </button>

                    {/* Enquiry Card */}
                    <button
                      onClick={() => setActiveSection('enquiry')}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 text-left group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#7C2A47]/10 transition-colors">
                          <MessageSquare className="h-8 w-8 text-gray-600 group-hover:text-[#7C2A47] transition-colors" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">Enquiry</h3>
                        <p className="text-xs text-gray-600">Enquiry about our products</p>
                      </div>
                    </button> 

                    {/* Contact Us Card */}
                    <button
                      onClick={() => setActiveSection('contact')}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 text-left group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#7C2A47]/10 transition-colors">
                          <MessageSquare className="h-8 w-8 text-gray-600 group-hover:text-[#7C2A47] transition-colors" />
                        </div>  
                        <h3 className="text-base font-bold text-gray-900 mb-1">Contact Us</h3>
                        <p className="text-xs text-gray-600">Contact us for any questions or concerns</p>
                      </div>
                    </button> 

                      {/* Account Status Card */}
                    {/* <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                          <Shield className="h-8 w-8 text-gray-600" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">Account Status</h3>
                        <p className="text-xs text-gray-600 capitalize">{userData.status || 'Active'}</p>
                      </div>
                    </div> */}

                    {/* Account Type Card */}
                    {/* <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                          <User className="h-8 w-8 text-gray-600" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">Account Type</h3>
                        <p className="text-xs text-gray-600 capitalize">{userData.role || 'User'}</p>
                      </div>
                    </div> */}
                  </div>
                </div>
              )}

              {activeSection === 'account' && (
                <AccountDetailsSection userData={userData} />
              )}

              {activeSection === 'orders' && (
                <OrdersSection />
              )}

              {activeSection === 'enquiry' && (
                <EnquirySection />
              )}

              {activeSection === 'collections-wishlist' && (
                <CollectionsWishlistSection />
              )}

              {activeSection === 'addresses' && (
                <AddressesSection userData={userData} />
              )}

              {activeSection === 'contact' && (
                <ContactUsSection />
              )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => !isLoggingOut && setShowLogoutModal(false)}
          />
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout? You will need to login again to access your account.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-white bg-[#7C2A47] hover:bg-[#6a2340] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Logging out...
                  </>
                ) : (
                  'Yes, Logout'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Success Popup */}
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
              className="w-full bg-[#7C2A47] text-white py-2.5 rounded-lg font-medium hover:bg-[#6a2340] transition"
            >
              Go to Home
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

const Account = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C2A47] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account...</p>
        </div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
};

export default Account;
