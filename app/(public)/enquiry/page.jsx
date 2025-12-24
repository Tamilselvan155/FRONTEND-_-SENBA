'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { User, Phone, ArrowLeft, Send, MessageCircle, Package, CheckCircle2, Shield, Truck, Award, Tag, Layers, ShoppingBag } from 'lucide-react';
import { createEnquiry } from '@/lib/actions/enquiryActions';
import { addEnquiry } from '@/lib/features/enquiry/enquirySlice';
import toast from 'react-hot-toast';
import Link from 'next/link';

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
  const productCategory = searchParams.get('category') || '';
  const productSubCategory = searchParams.get('subcategory') || '';

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
    if (productCategory) {
      message += `📂 *Category:* ${productCategory}\n`;
    }
    if (productSubCategory) {
      message += `📁 *Subcategory:* ${productSubCategory}\n`;
    }
    message += `💰 *Unit Price:* ₹${productPrice}\n`;
    message += `📦 *Quantity:* ${quantity}\n`;
    message += `💵 *Total Amount:* ₹${parseFloat(productPrice) * quantity}\n`;
    message += `🖼 *Product Link:* ${productLink}\n\n`;
    message += `🙋 *Name:* ${userName}\n📱 *Mobile:* ${userMobile}\n`;
    message += `\nPlease let me know the next steps.`;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto">
  
      {/* Header Section */}
      <div className="mb-8 sm:mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Confirm Enquiry
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
          Please provide your details to proceed with your enquiry. We'll get back to you shortly.
        </p>
      </div>
  
      {/* Main Content Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
        <div className="p-6">
  
          {/* Flex Container - Centered */}
          <div className="flex flex-col lg:flex-row lg:justify-center gap-10 items-center">
  
            {/* LEFT — Product Section */}
            {productId && (
              <div className="w-full lg:w-1/3 flex flex-col items-center gap-4">
                {productImage && (
                  <div className="w-full max-w-xs h-52 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.png";
                      }}
                    />
                  </div>
                )}
                <div className="w-full text-center space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {productName}
                    </h3>
                    
                    {/* Category Information */}
                    {(productCategory || productSubCategory) && (
                      <div className="flex flex-col gap-2 items-center">
                        {productCategory && (
                          <div className="flex items-center gap-2 text-sm">
                            <Tag size={14} className="text-[#7C2A47]" />
                            <span className="text-gray-600 font-medium">
                              Category:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {productCategory}
                            </span>
                          </div>
                        )}
                        {productSubCategory && (
                          <div className="flex items-center gap-2 text-sm">
                            <Layers size={14} className="text-[#7C2A47]" />
                            <span className="text-gray-600 font-medium">
                              Subcategory:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {productSubCategory}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Price and Quantity Details */}
                  {/* <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Unit Price
                      </span>
                      <span className="text-base font-bold text-[#7C2A47]">
                        ₹{parseFloat(productPrice).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                        <ShoppingBag size={12} />
                        Quantity
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {quantity}
                      </span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                          Total Amount
                        </span>
                        <span className="text-lg font-bold text-[#7C2A47]">
                          ₹{totalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            )}
  
            {/* RIGHT — Contact Form */}
            <div className="w-full lg:w-2/3 max-w-lg">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-6 text-center lg:text-left">
                Contact Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
  
                {/* Your Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(value)) setUserName(value);
                    }}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] outline-none text-sm"
                  />
                </div>
  
                {/* Mobile */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={userMobile}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]*$/.test(value) && value.length <= 10) {
                        setUserMobile(value);
                      }
                    }}
                    maxLength={10}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] outline-none text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Enter a valid 10-digit mobile number
                  </p>
                </div>
  
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#7C2A47] to-[#8d3454] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50"
                  >
                    Submit Enquiry
                  </button>
  
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 border-2 border-[#7C2A47] text-[#7C2A47] font-semibold rounded-xl hover:bg-[#7C2A47] hover:text-white transition disabled:opacity-50"
                  >
                    Contact via WhatsApp
                  </button>
                </div>
  
              </form>
            </div>
  
          </div>
        </div>
      </div>
  
      {/* Info Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 size={16} className="text-[#7C2A47]" />
          <p className="text-xs text-gray-600 text-center">
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
