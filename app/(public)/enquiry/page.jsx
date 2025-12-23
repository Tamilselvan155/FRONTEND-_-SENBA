'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { User, Phone, ArrowLeft, Send, MessageCircle, Package, CheckCircle2, Shield, Truck, Award } from 'lucide-react';
import { createEnquiry } from '@/lib/actions/enquiryActions';
import { addEnquiry } from '@/lib/features/enquiry/enquirySlice';
import toast from 'react-hot-toast';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

const EnquiryContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);
  
  const [userName, setUserName] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get product info from URL params
  const productId = searchParams.get('productId');
  const productName = searchParams.get('productName') || 'Product';
  const productPrice = searchParams.get('price') || '0';
  const productImage = searchParams.get('image') || '';
  const quantity = parseInt(searchParams.get('quantity') || '1', 10);

  // Load user info from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('userName');
      const savedMobile = localStorage.getItem('userMobile');
      if (savedName) setUserName(savedName);
      if (savedMobile) setUserMobile(savedMobile);
    }
  }, []);

  // Validate inputs
  const validateInputs = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!userName.trim() || !nameRegex.test(userName)) {
      toast.error('Please enter a valid name (letters only).');
      return false;
    }

    if (!mobileRegex.test(userMobile)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const productLink = typeof window !== 'undefined'
        ? `${window.location.origin}/product/${productId || 'unknown'}`
        : '';

      const items = [{
        id: productId,
        name: productName,
        price: parseFloat(productPrice),
        quantity: quantity,
        link: productLink,
      }];

      const totalPrice = parseFloat(productPrice) * quantity;
      const totalQuantity = quantity;

      const enquiryData = {
        userName,
        userMobile,
        userEmail: email || null,
        items,
        totalPrice,
        totalQuantity,
        contactMethod: 'form',
        createdAt: new Date().toISOString(),
      };

      // Save to Redux
      dispatch(addEnquiry(enquiryData));

      // Save to backend
      await createEnquiry({
        userName,
        userMobile,
        userEmail: email || null,
        items,
        totalPrice,
        totalQuantity,
        contactMethod: 'form',
      });

      // Save to localStorage for future use
      if (typeof window !== 'undefined') {
        localStorage.setItem('userName', userName);
        localStorage.setItem('userMobile', userMobile);
      }

      toast.success('Enquiry submitted successfully!');
      
      // Clear form fields after successful submission
      setUserName('');
      setUserMobile('');
      
      // Redirect back or to home
      setTimeout(() => {
        if (productId) {
          router.push(`/product/${productId}`);
        } else {
          router.push('/');
        }
      }, 1500);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error(error.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle WhatsApp redirect
  const handleWhatsApp = () => {
    if (!validateInputs()) return;

    const productLink = typeof window !== 'undefined'
      ? `${window.location.origin}/product/${productId || 'unknown'}`
      : '';

    let message = `Hello, I'm interested in placing an order. Here are the details:\n\n`;
    message += `🛍 *Product:* ${productName}\n`;
    message += `💰 *Price:* ₹${productPrice}\n`;
    message += `📦 *Quantity:* ${quantity}\n`;
    message += `🖼 *Product Link:* ${productLink}\n\n`;
    message += `🙋 *Name:* ${userName}\n📱 *Mobile:* ${userMobile}\n`;
    message += `\nTotal: ₹${parseFloat(productPrice) * quantity}\n\nPlease let me know the next steps.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '9345795629';
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

    // Save enquiry to backend
    const items = [{
      id: productId,
      name: productName,
      price: parseFloat(productPrice),
      quantity: quantity,
      link: productLink,
    }];

    createEnquiry({
      userName,
      userMobile,
      userEmail: email || null,
      items,
      totalPrice: parseFloat(productPrice) * quantity,
      totalQuantity: quantity,
      contactMethod: 'whatsapp',
    }).catch(error => {
      console.error('Error saving WhatsApp enquiry:', error);
    });
  };

  const totalPrice = parseFloat(productPrice) * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Go Back Button */}
        <div className="mb-6 sm:mb-8">
          <BackButton fallbackUrl="/" />
        </div>

        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#7C2A47]/10 to-[#8d3454]/10 mb-4">
            <Package className="w-8 h-8 text-[#7C2A47]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Confirm Enquiry
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Please provide your details to proceed with your enquiry. We'll get back to you shortly.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Left Column - Product Details */}
          {productId && (
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden transition-all duration-300 hover:shadow-2xl h-full flex flex-col backdrop-blur-sm">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#7C2A47] via-[#8d3454] to-[#7C2A47] px-5 sm:px-6 md:px-8 py-5 sm:py-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                  <div className="relative flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                      <Package size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-0.5">
                        Product Details
                      </h2>
                      <p className="text-xs sm:text-sm text-white/80">Review your selection</p>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col">
                  {/* Product Image */}
                  {productImage && (
                    <div className="mb-6">
                      <div className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 rounded-xl overflow-hidden border-2 border-gray-200/50 shadow-inner flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    {/* Product Name */}
                    <div className="mb-5 sm:mb-6">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                        {productName}
                      </h3>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-4 sm:space-y-5">
                      {/* Quantity */}
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#7C2A47]/10 flex items-center justify-center">
                            <span className="text-lg font-bold text-[#7C2A47]">{quantity}</span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Quantity</p>
                            <p className="text-sm text-gray-700 font-medium">{quantity} {quantity === 1 ? 'item' : 'items'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#7C2A47]/5 to-[#8d3454]/5 rounded-xl border-2 border-[#7C2A47]/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#7C2A47] flex items-center justify-center shadow-md">
                            <span className="text-white text-sm font-bold">₹</span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Unit Price</p>
                            <p className="text-lg sm:text-xl font-bold text-[#7C2A47]">
                              ₹{parseFloat(productPrice).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Total Amount */}
                      {quantity > 1 && (
                        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#7C2A47] to-[#8d3454] rounded-xl shadow-lg">
                          <span className="text-sm sm:text-base font-semibold text-white uppercase tracking-wide">Total Amount</span>
                          <span className="text-2xl sm:text-3xl font-bold text-white">
                            ₹{totalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Column - Contact Information */}
          <div className={`${productId ? 'order-1 lg:order-2' : 'lg:col-span-2'}`}>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden transition-all duration-300 hover:shadow-2xl h-full flex flex-col backdrop-blur-sm">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#7C2A47] via-[#8d3454] to-[#7C2A47] px-5 sm:px-6 md:px-8 py-5 sm:py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 sm:gap-4 mb-2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-0.5">
                        Contact Information
                      </h2>
                      <p className="text-xs sm:text-sm text-white/80">
                        Fill in your details to complete the enquiry
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col">
                <div className="space-y-5 sm:space-y-6 flex-1">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="userName" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2.5 uppercase tracking-wide">
                      Your Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#7C2A47] transition-colors duration-200" />
                      </div>
                      <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(value)) {
                            setUserName(value);
                          }
                        }}
                        placeholder="Enter your full name"
                        required
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#7C2A47]/10 focus:border-[#7C2A47] outline-none transition-all duration-200 text-sm sm:text-base bg-gray-50/50 hover:bg-white hover:border-gray-300 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Mobile Field */}
                  <div>
                    <label htmlFor="userMobile" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2.5 uppercase tracking-wide">
                      Mobile Number <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-[#7C2A47] transition-colors duration-200" />
                      </div>
                      <input
                        type="tel"
                        id="userMobile"
                        value={userMobile}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[0-9]*$/.test(value) && value.length <= 10) {
                            setUserMobile(value);
                          }
                        }}
                        placeholder="Enter your 10-digit mobile number"
                        maxLength={10}
                        required
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#7C2A47]/10 focus:border-[#7C2A47] outline-none transition-all duration-200 text-sm sm:text-base bg-gray-50/50 hover:bg-white hover:border-gray-300 shadow-sm"
                      />
                    </div>
                    <p className="mt-2.5 text-xs text-gray-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      <span>Enter a valid 10-digit mobile number</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 mt-auto">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#7C2A47] to-[#8d3454] text-white font-semibold rounded-xl hover:from-[#6a243d] hover:to-[#7a2d4a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Submit Enquiry</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-[#7C2A47] text-[#7C2A47] font-semibold rounded-xl hover:bg-[#7C2A47] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                  >
                    <MessageCircle size={18} />
                    <span>Contact via WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-[#7C2A47]/5 via-[#8d3454]/5 to-[#7C2A47]/5 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-[#7C2A47]/10 shadow-sm">
          <div className="flex items-start sm:items-center justify-center gap-3">
            <CheckCircle2 size={20} className="text-[#7C2A47] flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-700 text-center leading-relaxed">
              By submitting this form, you agree to our terms and conditions. We'll contact you shortly regarding your enquiry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnquiryPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C2A47] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <EnquiryContent />
    </Suspense>
  );
};

export default EnquiryPage;
