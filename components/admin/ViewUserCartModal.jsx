'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, CheckCircle } from 'lucide-react';
import { fetchUserOrders } from '@/lib/actions/userActions';
import { getImageUrl } from '@/lib/utils/imageUtils';

const ViewUserCartModal = ({ isOpen, onClose, userId, userName }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (isOpen && userId) {
      fetchOrdersData();
    } else {
      setOrders([]);
      setError(null);
    }
  }, [isOpen, userId]);
  
  // Reset pagination when orders change
  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('=== ADMIN FETCHING USER ORDERS ===');
      console.log('userId received:', userId);
      console.log('userId type:', typeof userId);
      console.log('userName:', userName);
      
      if (!userId) {
        console.error('No userId provided!');
        setError('User ID is missing');
        setOrders([]);
        return;
      }

      // Ensure userId is a string
      const userIdString = String(userId);
      console.log('Calling API with userId:', userIdString);
      
      const response = await fetchUserOrders(userIdString);
      console.log('API Response:', response);
      console.log('Response success:', response.success);
      console.log('Response data:', response.data);
      console.log('Response count:', response.count);
      
      if (response.success) {
        // Orders are already in the correct format
        const ordersData = response.data || [];
        console.log('Orders data type:', Array.isArray(ordersData) ? 'array' : typeof ordersData);
        console.log('Orders data length:', Array.isArray(ordersData) ? ordersData.length : 'not an array');
        
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        console.log('Orders loaded into state:', ordersData.length, 'orders');
        
        if (ordersData.length === 0) {
          console.warn('⚠️ No orders found for userId:', userIdString);
          console.warn('This could mean:');
          console.warn('1. User has not placed any orders');
          console.warn('2. userId format mismatch between order creation and fetch');
          console.warn('3. Orders were saved with different userId format');
        }
      } else {
        console.error('❌ Fetch orders response not successful:', response);
        setOrders([]);
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('❌ Error fetching user orders:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage = err.message || err.response?.data?.message || err.response?.data?.error || 'Failed to fetch orders';
      setError(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate paginated orders
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = orders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(orders.length / pageSize);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-transparent bg-opacity-50">
      <div className="bg-white bg-opacity-95 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Ordered Items - {userName || 'User'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div>
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
                            <span className="text-sm font-semibold text-indigo-600">₹{Number(order.totalPrice || 0).toLocaleString()}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, orders.length)} of {orders.length} orders
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserCartModal;

