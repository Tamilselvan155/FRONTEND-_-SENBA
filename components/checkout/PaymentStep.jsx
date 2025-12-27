'use client';

import React, { useState } from 'react';
import { CreditCard, Wallet, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { clearCartAsync, clearCart } from '@/lib/features/cart/cartSlice';
import { createOrder } from '@/lib/actions/orderActions';
import { initializePayment } from '@/lib/utils/paymentGateway';

const PaymentStep = ({
  cartArray,
  totalPrice,
  selectedAddress,
  orderInstructions,
  paymentMethod,
  onPaymentMethodChange,
  onPaymentComplete,
  onBack,
  isPlacingOrder,
  setIsPlacingOrder,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
  const isLoggedIn = typeof window !== 'undefined' && 
    localStorage.getItem('token') && 
    localStorage.getItem('user');

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Prepare order data
      const orderData = {
        items: cartArray.map(item => {
          const productId = item.id || item._id || item.productId;
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
        totalQuantity: cartArray.reduce((sum, item) => sum + (item.quantity || 1), 0),
        address: selectedAddress._id || selectedAddress.id || null,
        notes: orderInstructions || null,
        paymentMethod: paymentMethod,
      };

      // Handle COD payment
      if (paymentMethod === 'cod') {
        if (!isLoggedIn) {
          throw new Error('Please login to place an order');
        }
        
        const result = await createOrder(orderData);
        if (!result || !result.success) {
          throw new Error(result?.message || 'Failed to place order');
        }
        
        // Clear cart
        try {
          await dispatch(clearCartAsync()).unwrap();
        } catch (error) {
          console.error('Error clearing cart:', error);
          dispatch(clearCart());
        }

        toast.success('Order placed successfully!');
        onPaymentComplete({
          success: true,
          orderId: result.data?._id || result.data?.id,
          paymentMethod: 'cod',
          message: 'Your order has been placed successfully. Our sales team will contact you soon.',
        });
      } 
      // Handle Online Payment
      else if (paymentMethod === 'online') {
        if (isLoggedIn) {
          // Initialize payment gateway
          try {
            const paymentResult = await initializePayment({
              amount: totalPrice,
              orderData: orderData,
              onSuccess: async (paymentResponse) => {
                // Payment successful, create order
                const orderWithPayment = {
                  ...orderData,
                  paymentId: paymentResponse.paymentId,
                  paymentStatus: 'completed',
                };

                const result = await createOrder(orderWithPayment);
                if (!result.success) {
                  throw new Error(result.message || 'Failed to place order');
                }

                // Clear cart
                try {
                  await dispatch(clearCartAsync()).unwrap();
                } catch (error) {
                  console.error('Error clearing cart:', error);
                  dispatch(clearCart());
                }

                toast.success('Payment successful! Order placed.');
                onPaymentComplete({
                  success: true,
                  orderId: result.data?._id || result.data?.id,
                  paymentMethod: 'online',
                  paymentId: paymentResponse.paymentId,
                  message: 'Your payment was successful and order has been placed.',
                });
              },
              onFailure: (error) => {
                setIsPlacingOrder(false);
                toast.error(error.message || 'Payment failed. Please try again.');
              },
            });

            if (!paymentResult) {
              throw new Error('Failed to initialize payment');
            }
          } catch (error) {
            console.error('Payment error:', error);
            setIsPlacingOrder(false);
            toast.error(error.message || 'Failed to process payment. Please try again.');
          }
        } else {
          throw new Error('Please login to place an order');
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setIsPlacingOrder(false);
      const errorMessage = error.message || error.toString() || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Method</h2>
        <p className="text-sm text-gray-600">Choose your preferred payment method</p>
      </div>

      <div className="space-y-4 mb-6">
        {/* Cash on Delivery */}
        <div
          onClick={() => onPaymentMethodChange('cod')}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            paymentMethod === 'cod'
              ? 'border-[#7C2A47] bg-[#7C2A47]/5'
              : 'border-gray-200 hover:border-[#7C2A47]/50 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'cod' ? 'border-[#7C2A47]' : 'border-gray-300'
              }`}>
                {paymentMethod === 'cod' && (
                  <div className="w-3 h-3 rounded-full bg-[#7C2A47]"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-5 h-5 text-[#7C2A47]" />
                  <h3 className="font-semibold text-gray-900">Cash on Delivery (COD)</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Pay cash when your order is delivered
                </p>
              </div>
            </div>
            {paymentMethod === 'cod' && (
              <CheckCircle className="w-6 h-6 text-[#7C2A47] flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Online Payment */}
        <div
          onClick={() => onPaymentMethodChange('online')}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            paymentMethod === 'online'
              ? 'border-[#7C2A47] bg-[#7C2A47]/5'
              : 'border-gray-200 hover:border-[#7C2A47]/50 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'online' ? 'border-[#7C2A47]' : 'border-gray-300'
              }`}>
                {paymentMethod === 'online' && (
                  <div className="w-3 h-3 rounded-full bg-[#7C2A47]"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-5 h-5 text-[#7C2A47]" />
                  <h3 className="font-semibold text-gray-900">Online Payment</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Pay securely with credit/debit card or UPI
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">We accept:</span>
                  <span className="text-xs font-medium text-gray-600">Visa</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs font-medium text-gray-600">Mastercard</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs font-medium text-gray-600">UPI</span>
                </div>
              </div>
            </div>
            {paymentMethod === 'online' && (
              <CheckCircle className="w-6 h-6 text-[#7C2A47] flex-shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Order Total */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-900">Total Amount:</span>
          <span className="text-2xl font-bold text-[#7C2A47]">
            {currency}{totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={isPlacingOrder}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || !paymentMethod}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#7C2A47] hover:bg-[#6a2340] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPlacingOrder ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {paymentMethod === 'cod' ? 'Placing Order...' : 'Processing Payment...'}
            </>
          ) : (
            <>
              {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;

