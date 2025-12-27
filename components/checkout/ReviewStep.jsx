'use client';

import React from 'react';
import { MapPin, Edit, Package } from 'lucide-react';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const ReviewStep = ({
  cartArray,
  totalPrice,
  totalSavings,
  selectedAddress,
  orderInstructions,
  onOrderInstructionsChange,
  onContinue,
  onBack,
  onEditAddress,
}) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Order</h2>
        <p className="text-sm text-gray-600">Please review your order details before proceeding</p>
      </div>

      <div className="space-y-6">
        {/* Order Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h3>
            <span className="text-sm text-gray-600">{cartArray.length} item(s)</span>
          </div>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {cartArray.map((item, index) => {
              const itemImages = item.images && Array.isArray(item.images) && item.images.length > 0 
                ? item.images 
                : [];
              const itemImage = itemImages[0] || assets.product_img0 || '';
              const itemTotal = Number(item.price || 0) * (item.quantity || 1);

              return (
                <div key={item.id || item._id || index} className="p-4 flex gap-4">
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    {itemImage ? (
                      <Image
                        src={itemImage}
                        alt={item.name || item.title || 'Product'}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {item.name || item.title || 'Product'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Quantity: {item.quantity || 1}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {currency}{itemTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Address */}
        {selectedAddress && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </h3>
              <button
                onClick={onEditAddress}
                className="text-sm text-[#7C2A47] hover:text-[#8B3A5A] flex items-center gap-1 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-medium text-gray-900 mb-1">{selectedAddress.name}</p>
              <p className="text-sm text-gray-700">{selectedAddress.street}</p>
              <p className="text-sm text-gray-700">
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
              </p>
              <p className="text-sm text-gray-700">{selectedAddress.country}</p>
              <p className="text-sm text-gray-600 mt-2">Phone: {selectedAddress.phone}</p>
            </div>
          </div>
        )}

        {/* Order Instructions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Order Instructions (Optional)
          </label>
          <select
            value={orderInstructions}
            onChange={(e) => onOrderInstructionsChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all"
          >
            <option value="">Select instructions (optional)</option>
            <option value="leave-at-door">Leave at door</option>
            <option value="call-on-arrival">Call on arrival</option>
            <option value="ring-bell">Ring bell</option>
          </select>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900 font-medium">
                {currency}{(totalPrice + totalSavings).toLocaleString()}
              </span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#7C2A47]">Savings:</span>
                <span className="text-[#7C2A47] font-medium">
                  -{currency}{totalSavings.toLocaleString()}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-300 flex justify-between">
              <span className="text-base font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-[#7C2A47]">
                {currency}{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#7C2A47] hover:bg-[#6a2340] rounded-lg transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;


