'use client';

import React, { useState, useEffect } from 'react';
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
  Mail,
  Calendar,
  Shield,
  Plus,
  Edit,
  Trash2,
  Phone,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Account = () => {
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
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    isDefault: false,
  });
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 5;

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
    if (section && ['dashboard', 'orders', 'addresses', 'account'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Fetch addresses when addresses section is active
  useEffect(() => {
    if (activeSection === 'addresses') {
      fetchAddresses();
    }
  }, [activeSection]);

  // Fetch orders when orders section is active
  useEffect(() => {
    if (activeSection === 'orders') {
      fetchOrders();
    }
  }, [activeSection]);

  // Reset pagination when orders change
  useEffect(() => {
    setOrdersPage(1);
  }, [orders.length]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingAddresses(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAddresses(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingOrders(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setOrders(data.data || []);
        }
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      name: userData.name || '',
      email: userData.email || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
      isDefault: false,
    });
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name || '',
      email: address.email || '',
      phone: address.phone || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.zip || '',
      country: address.country || 'India',
      isDefault: address.isDefault || false,
    });
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Address deleted successfully');
        fetchAddresses();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const url = editingAddress
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/addresses/${editingAddress._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/addresses`;

      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressForm),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(editingAddress ? 'Address updated successfully' : 'Address added successfully');
        setShowAddressModal(false);
        setEditingAddress(null);
        fetchAddresses();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
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
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#7C2A47] flex items-center justify-center text-white text-2xl font-semibold">
              {getInitials()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {userData.name || userData.email || 'User Name'}
              </h1>
              <p className="text-gray-600 mt-1">{userData.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                {userData.createdAt 
                  ? `Member Since ${userData.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                  : 'Member'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Navigation Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#7C2A47] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Right Column - Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeSection === 'dashboard' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-[#7C2A47]" />
                        <h3 className="font-medium text-gray-900">Account Status</h3>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{userData.status || 'Active'}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-[#7C2A47]" />
                        <h3 className="font-medium text-gray-900">Account Type</h3>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{userData.role || 'User'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'account' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Details</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info - Left Side */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                          </label>
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">
                              {userData.name ? userData.name.toLowerCase().replace(/\s+/g, '') : userData.email?.split('@')[0] || 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{userData.name || 'Not set'}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{userData.email || 'N/A'}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Member Since
                          </label>
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">
                              {userData.createdAt 
                                ? userData.createdAt.toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Other Details - Right Side */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Role
                          </label>
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <Shield className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900 capitalize">{userData.role || 'User'}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Status
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              userData.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {userData.status ? userData.status.charAt(0).toUpperCase() + userData.status.slice(1) : 'Active'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Login
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="text-gray-900 text-sm">
                              {userData.lastLoginAt 
                                ? new Date(userData.lastLoginAt).toLocaleString('en-US')
                                : 'Not available'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Orders</h2>
                  
                  {loadingOrders ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C2A47] mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No orders yet</p>
                      <p className="text-sm text-gray-500 mt-2">Your order history will appear here</p>
                    </div>
                  ) : (
                    <div>
                      {/* Calculate paginated orders */}
                      {(() => {
                        const ordersStartIndex = (ordersPage - 1) * ordersPerPage;
                        const ordersEndIndex = ordersStartIndex + ordersPerPage;
                        const paginatedOrders = orders.slice(ordersStartIndex, ordersEndIndex);
                        const totalOrdersPages = Math.ceil(orders.length / ordersPerPage);
                        
                        return (
                          <>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order Placed</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Items</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Quantity</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {paginatedOrders.map((order, orderIndex) => {
                                    const orderDate = new Date(order.createdAt);
                                    const formattedDate = orderDate.toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    });
                                    const formattedTime = orderDate.toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                    });
                                    
                                    const statusColors = {
                                      pending: 'bg-yellow-100 text-yellow-800',
                                      confirmed: 'bg-blue-100 text-blue-800',
                                      shipped: 'bg-purple-100 text-purple-800',
                                      delivered: 'bg-green-100 text-green-800',
                                      cancelled: 'bg-red-100 text-red-800',
                                    };
                                    
                                    const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800';
                                    
                                    return (
                                      <tr key={order._id || orderIndex} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                          <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                            <div>
                                              <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
                                              <p className="text-xs text-gray-500">{formattedTime}</p>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="py-4 px-4">
                                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColor}`}>
                                            {order.status || 'pending'}
                                          </span>
                                        </td>
                                        <td className="py-4 px-4">
                                          <div className="space-y-2">
                                            {order.items && order.items.length > 0 ? (
                                              order.items.slice(0, 3).map((item, itemIndex) => {
                                                const productName = item.name || (item.productId && typeof item.productId === 'object' 
                                                  ? (item.productId.title || item.productId.name) 
                                                  : 'Unknown Product');
                                                const quantity = Number(item.quantity || 1);
                                                
                                                return (
                                                  <div key={itemIndex} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <span className="font-medium">{productName}</span>
                                                    <span className="text-gray-500">× {quantity}</span>
                                                  </div>
                                                );
                                              })
                                            ) : (
                                              <span className="text-sm text-gray-500">No items</span>
                                            )}
                                            {order.items && order.items.length > 3 && (
                                              <p className="text-xs text-gray-500">+{order.items.length - 3} more item(s)</p>
                                            )}
                                          </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                          <span className="text-sm font-medium text-gray-900">{order.totalQuantity || 0}</span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                          <span className="text-sm font-semibold text-[#7C2A47]">₹{Number(order.totalPrice || 0).toLocaleString()}</span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            
                            {/* Pagination */}
                            {totalOrdersPages > 1 && (
                              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                  Showing {ordersStartIndex + 1} to {Math.min(ordersEndIndex, orders.length)} of {orders.length} orders
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setOrdersPage(prev => Math.max(1, prev - 1))}
                                    disabled={ordersPage === 1}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Previous
                                  </button>
                                  <span className="text-sm text-gray-700">
                                    Page {ordersPage} of {totalOrdersPages}
                                  </span>
                                  <button
                                    onClick={() => setOrdersPage(prev => Math.min(totalOrdersPages, prev + 1))}
                                    disabled={ordersPage === totalOrdersPages}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Next
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Addresses</h2>
                    <button
                      onClick={handleAddAddress}
                      className="flex items-center gap-2 px-4 py-2 bg-[#7C2A47] text-white rounded-lg hover:bg-[#6a2340] transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Address
                    </button>
                  </div>

                  {loadingAddresses ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C2A47] mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading addresses...</p>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No saved addresses</p>
                      <p className="text-sm text-gray-500 mt-2">Add addresses for faster checkout</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`border rounded-lg p-4 relative ${
                            address.isDefault ? 'border-[#7C2A47] bg-[#7C2A47]/5' : 'border-gray-200'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">{address.name}</h3>
                                  {address.isDefault && (
                                    <span className="bg-[#7C2A47] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{address.email}</p>
                              </div>
                              <div className="flex gap-2 ml-2">
                                <button
                                  onClick={() => handleEditAddress(address)}
                                  className="p-1.5 text-gray-600 hover:text-[#7C2A47] hover:bg-gray-100 rounded transition-colors"
                                  title="Edit address"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAddress(address._id)}
                                  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  title="Delete address"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span>
                                  {address.street}, {address.city}, {address.state} {address.zip}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>{address.country}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{address.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  setEditingAddress(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAddress} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={addressForm.email}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] outline-none"
                    placeholder="India"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] outline-none"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] outline-none"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] outline-none"
                    placeholder="Maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={addressForm.zip}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] outline-none"
                    placeholder="400001"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                      className="w-4 h-4 text-[#7C2A47] border-gray-300 rounded focus:ring-[#7C2A47]"
                    />
                    <span className="text-sm text-gray-700">Set as default address</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#7C2A47] hover:bg-[#6a2340] rounded-lg transition-colors"
                >
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
