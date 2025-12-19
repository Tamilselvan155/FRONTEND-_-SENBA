'use client'

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { X, CheckCircle, MapPin, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { clearCartAsync } from '@/lib/features/cart/cartSlice';
import { clearCart } from '@/lib/features/cart/cartSlice';
import { createOrder } from '@/lib/actions/orderActions';

const OrderSummary = ({ totalPrice, items }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
  const router = useRouter();
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);
  // Check if user is actually logged in (has token and email)
  const isLoggedIn = typeof window !== 'undefined' && 
    localStorage.getItem('token') && 
    (email || localStorage.getItem('user'));

  // Calculate total quantity from items array
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Fetch user data and default address when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchUserDetails();
    }
  }, [isModalOpen]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Get user data from localStorage or API
      let user = null;
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      // If not in localStorage or need fresh data, fetch from API
      if (token && (!user || !user.name)) {
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success && userData.user) {
            user = userData.user;
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
      }

      setUserData(user);

      // Fetch default address
      if (token) {
        const addressResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/addresses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (addressResponse.ok) {
          const addressData = await addressResponse.json();
          if (addressData.success && addressData.data) {
            const defaultAddr = addressData.data.find(addr => addr.isDefault);
            setDefaultAddress(defaultAddr || null);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkDetailsComplete = () => {
    const hasName = userData?.name && userData.name.trim() !== '';
    const hasEmail = userData?.email && userData.email.trim() !== '';
    const hasAddress = defaultAddress !== null;
    
    return {
      complete: hasName && hasEmail && hasAddress,
      missing: {
        name: !hasName,
        email: !hasEmail,
        address: !hasAddress,
      }
    };
  };

  const handleOrderNow = () => {
    setIsModalOpen(true);
  };

  const handleCompleteDetails = () => {
    setIsModalOpen(false);
    const check = checkDetailsComplete();
    // Navigate to appropriate section based on what's missing
    if (check.missing.address) {
      router.push('/account?section=addresses');
    } else if (check.missing.name || check.missing.email) {
      router.push('/account?section=account');
    } else {
      router.push('/account');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => {
          // Ensure productId is a valid MongoDB ObjectId string
          const productId = item.id || item._id || item.productId;
          if (!productId) {
            console.warn('Item missing productId:', item);
          }
          return {
            productId: productId,
            name: item.name || item.title || 'Product',
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1),
            images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []),
            sku: item.sku || null,
          };
        }),
        totalPrice: Number(totalPrice),
        totalQuantity: Number(totalQuantity),
        address: defaultAddress?._id || null,
      };

      console.log('Order data being sent:', JSON.stringify(orderData, null, 2));

      // Save order to backend if user is logged in
      if (isLoggedIn) {
        try {
          console.log('=== ATTEMPTING TO SAVE ORDER TO BACKEND ===');
          console.log('User logged in:', isLoggedIn);
          console.log('Order data:', JSON.stringify(orderData, null, 2));
          
          const result = await createOrder(orderData);
          console.log('Backend response:', result);
          
          if (!result.success) {
            console.error('Backend returned success:false', result);
            throw new Error(result.message || 'Failed to save order to backend');
          }
          console.log('✅ Order saved to backend successfully!');
          console.log('Order ID:', result.data?._id || result.data?.id);
          console.log('Order userId:', result.data?.userId);
        } catch (error) {
          console.error('❌ Error saving order to backend:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
          const errorMessage = error.message || error.response?.data?.message || 'Failed to save order to backend';
          toast.error(errorMessage);
          // Don't proceed if order save fails - user should know
          throw new Error('Failed to save order. Please try again.');
        }
      } else {
        console.warn('⚠️ User not logged in, skipping backend order save');
      }

      // Also save to localStorage for cart page display
      const orderedItems = {
        items: items.map(item => ({
          ...item,
          orderedAt: new Date().toISOString(),
        })),
        totalPrice,
        totalQuantity,
        orderedAt: new Date().toISOString(),
      };

      // Get existing ordered items from localStorage
      const existingOrders = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('orderedItems') || '[]')
        : [];
      
      // Add new order to the beginning of the array
      existingOrders.unshift(orderedItems);
      
      // Keep only the last 10 orders to avoid localStorage bloat
      const recentOrders = existingOrders.slice(0, 10);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('orderedItems', JSON.stringify(recentOrders));
        // Dispatch custom event to update cart page
        window.dispatchEvent(new Event('orderPlaced'));
      }

      // Clear cart
      if (isLoggedIn) {
        // For logged-in users, clear from backend
        try {
          await dispatch(clearCartAsync()).unwrap();
        } catch (error) {
          console.error('Error clearing cart from backend:', error);
          // Fallback to local clear
          dispatch(clearCart());
        }
      } else {
        // For guest users, clear from local state
        dispatch(clearCart());
      }

      // Clear localStorage cart
      if (typeof window !== 'undefined') {
         localStorage.removeItem('cart');
      }
      
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
      // Don't clear cart if order failed
      return;
    }
  };


  return (
    <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
      <h2 className='text-xl font-medium text-slate-600 mb-4'>Order Summary</h2>

      <div className='flex justify-between mb-2'>
        <p className='text-lg'>Total:</p>
        <p className='font-medium text-xl'>{currency}{totalPrice.toLocaleString()}</p>
      </div>

      <div className='flex justify-between mb-4'>
        <p className='text-lg'>Total Quantity:</p>
        <p className='font-medium text-xl'>{totalQuantity}</p>
      </div>

      <button
        onClick={handleOrderNow}
        className='w-full bg-[#7C2A47] text-white py-2.5 text-lg rounded hover:bg-[#6a243d] active:scale-95 transition-all'
      >
        Order Now
      </button>

      {/* Order Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
            setIsModalOpen(false);
            setOrderPlaced(false);
          }}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 z-50">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C2A47] mx-auto mb-4"></div>
                <p className="text-gray-600">Checking details...</p>
              </div>
            ) : orderPlaced ? (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Order Placed Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your Order Placed and Our Sales Team will contact you soon.
                </p>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setOrderPlaced(false);
                    router.push('/');
                  }}
                  className="w-full bg-[#7C2A47] text-white py-2.5 rounded-lg font-medium hover:bg-[#6a2340] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (() => {
              const check = checkDetailsComplete();
              if (!check.complete) {
                return (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">Complete Your Details</h3>
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setOrderPlaced(false);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-gray-600 mb-4">
                        Please complete the following details to place your order:
                      </p>
                      
                      <div className="space-y-3">
                        {check.missing.name && (
                          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <User className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="text-sm font-medium text-red-900">Name is missing</p>
                              <p className="text-xs text-red-700">Please add your name in account details</p>
                            </div>
                          </div>
                        )}
                        
                        {check.missing.email && (
                          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <Mail className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="text-sm font-medium text-red-900">Email is missing</p>
                              <p className="text-xs text-red-700">Please add your email in account details</p>
                            </div>
                          </div>
                        )}
                        
                        {check.missing.address && (
                          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <MapPin className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="text-sm font-medium text-red-900">Default address is missing</p>
                              <p className="text-xs text-red-700">Please add and set a default address</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setOrderPlaced(false);
                        }}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCompleteDetails}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#7C2A47] hover:bg-[#6a2340] rounded-lg transition-colors"
                      >
                        Complete Details
                      </button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">Confirm Order</h3>
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setOrderPlaced(false);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mb-6 space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Items:</span>
                            <span className="font-medium">{totalQuantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-medium text-lg">{currency}{totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {defaultAddress && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Delivery Address
                          </h4>
                          <p className="text-sm text-gray-700">{defaultAddress.name}</p>
                          <p className="text-sm text-gray-700">{defaultAddress.street}</p>
                          <p className="text-sm text-gray-700">
                            {defaultAddress.city}, {defaultAddress.state} {defaultAddress.zip}
                          </p>
                          <p className="text-sm text-gray-700">{defaultAddress.country}</p>
                          <p className="text-sm text-gray-700 mt-1">Phone: {defaultAddress.phone}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setOrderPlaced(false);
                        }}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
