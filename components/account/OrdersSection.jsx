'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setOrdersPage(1);
  }, [orders.length]);

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

  if (loadingOrders) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C2A47] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No orders yet</p>
        <p className="text-sm text-gray-500 mt-2">Your order history will appear here</p>
      </div>
    );
  }

  const ordersStartIndex = (ordersPage - 1) * ordersPerPage;
  const ordersEndIndex = ordersStartIndex + ordersPerPage;
  const paginatedOrders = orders.slice(ordersStartIndex, ordersEndIndex);
  const totalOrdersPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Orders</h2>
      
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-700">Order Placed</th>
              <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-700">Items</th>
              <th className="text-right py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-700">Total Quantity</th>
              <th className="text-right py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-700">Total Price</th>
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
              
              return (
                <tr key={order._id || orderIndex} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{formattedDate}</p>
                        <p className="text-xs text-gray-500">{formattedTime}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="space-y-1.5">
                      {order.items && order.items.length > 0 ? (
                        order.items.slice(0, 3).map((item, itemIndex) => {
                          const productName = item.name || (item.productId && typeof item.productId === 'object' 
                            ? (item.productId.title || item.productId.name) 
                            : 'Unknown Product');
                          const quantity = Number(item.quantity || 1);
                          
                          return (
                            <div key={itemIndex} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                              <span className="font-medium truncate">{productName}</span>
                              <span className="text-gray-500 whitespace-nowrap">× {quantity}</span>
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-xs sm:text-sm text-gray-500">No items</span>
                      )}
                      {order.items && order.items.length > 3 && (
                        <p className="text-xs text-gray-500">+{order.items.length - 3} more item(s)</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <span className="text-xs sm:text-sm font-medium text-gray-900">{order.totalQuantity || 0}</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <span className="text-xs sm:text-sm font-semibold text-[#7C2A47]">₹{Number(order.totalPrice || 0).toLocaleString()}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
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
    </div>
  );
};

export default OrdersSection;


