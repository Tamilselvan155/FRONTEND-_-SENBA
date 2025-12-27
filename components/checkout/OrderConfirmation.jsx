'use client';

import React from 'react';
import { CheckCircle, Package, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const OrderConfirmation = ({ orderData, onContinueShopping }) => {
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  // Calculate estimated delivery date (7-10 business days)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 7);
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return deliveryDate.toLocaleDateString('en-US', options);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600">
          {orderData?.message || 'Your order has been placed and our sales team will contact you soon.'}
        </p>
      </div>

      {orderData?.orderId && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Order ID</p>
          <p className="text-lg font-semibold text-gray-900">{orderData.orderId}</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-left">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-[#7C2A47] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">What's Next?</h3>
              <p className="text-sm text-gray-600">
                You will receive an order confirmation email shortly. Our sales team will contact you to confirm your order details.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[#7C2A47] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Estimated Delivery</h3>
              <p className="text-sm text-gray-600">
                Your order will be delivered by {getEstimatedDelivery()}
              </p>
            </div>
          </div>

          {orderData?.paymentMethod === 'cod' && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#7C2A47] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Payment</h3>
                <p className="text-sm text-gray-600">
                  Please keep cash ready for payment on delivery.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onContinueShopping}
          className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-[#7C2A47] hover:bg-[#6a2340] rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </button>
        <Link
          href="/account?section=orders"
          className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;


