'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { fetchUserCart } from '@/lib/actions/userActions';
import { getImageUrl } from '@/lib/utils/imageUtils';

const ViewUserCartModal = ({ isOpen, onClose, userId, userName }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchCartData();
    } else {
      setCartItems([]);
      setError(null);
    }
  }, [isOpen, userId]);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchUserCart(userId);
      if (response.success && response.data) {
        // Convert items array to display format
        const items = response.data.items || [];
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error fetching user cart:', err);
      setError(err.message || 'Failed to fetch cart items');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Clean product object to remove MongoDB IDs
  const cleanProductObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
      return obj.map(cleanProductObject);
    }
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_id' || key === '__v' || key === 'productId' || key === 'categoryId' || key === 'subcategory' || key === 'brandIds') {
        continue;
      }
      if (typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)) {
        continue; // Skip MongoDB ID strings
      }
      if (typeof value === 'object' && value !== null) {
        cleaned[key] = cleanProductObject(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  const getProductName = (item) => {
    if (item.productId) {
      if (typeof item.productId === 'object') {
        return item.productId.title || item.productId.name || 'Unknown Product';
      }
    }
    return 'Unknown Product';
  };

  const getProductImage = (item) => {
    if (item.productId && typeof item.productId === 'object') {
      const images = item.productId.images || [];
      if (images.length > 0) {
        return getImageUrl(images[0]);
      }
    }
    return null;
  };

  const getProductPrice = (item) => {
    if (item.price && item.price > 0) {
      return item.price;
    }
    if (item.productId && typeof item.productId === 'object' && item.productId.price) {
      return item.productId.price;
    }
    return 0;
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = getProductPrice(item);
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
      <div className="bg-white bg-opacity-95 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Cart Items - {userName || 'User'}
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
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No items in cart</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => {
                    const product = cleanProductObject(item.productId || {});
                    const productName = getProductName(item);
                    const productImage = getProductImage(item);
                    const price = getProductPrice(item);
                    const quantity = item.quantity || 1;
                    const total = price * quantity;

                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={productName}
                                className="w-16 h-16 object-cover rounded"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{productName}</p>
                              {product.sku && (
                                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-700">{quantity}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-gray-700">₹{Number(price).toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="font-medium text-gray-900">₹{Number(total).toLocaleString()}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan="3" className="py-4 px-4 text-right font-semibold text-gray-900">
                      Grand Total:
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-lg text-indigo-600">
                      ₹{Number(calculateTotal()).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
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

