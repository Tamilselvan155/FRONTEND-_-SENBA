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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Go Back Button - Top Left Corner */}
      <div className="max-w-4xl mx-auto mb-4 sm:mb-5">
        <BackButton fallbackUrl="/" />
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 text-center">
          <div className="inline-block mb-4">
            {/* <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#7C2A47] to-transparent mx-auto mb-4"></div> */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Confirm Enquiry
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              Please provide your details to proceed with your enquiry. We'll get back to you shortly.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-6 items-stretch">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-5 flex">
            {productId && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl w-full flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#7C2A47] via-[#8d3454] to-[#7C2A47] px-6 py-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/5"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Package size={20} className="text-white" />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      Product Details
                    </h2>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                   {/* Product Image */}
                   {productImage && (
                     <div className="mb-5">
                       <div className="w-full h-44 md:h-52 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center">
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-full h-full object-contain p-3"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png';
                          }}
                        />
                      </div>
                    </div>
                  )}

                   {/* Product Name, Quantity and Price in Row */}
                   <div className="mb-5">
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-2">
                       <div className="flex-1 min-w-0">
                         <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                           {productName}
                         </h3>
                    
                       </div>
                       
                       {/* Quantity and Price - Next to Product Name */}
                       <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                         {/* Quantity */}
                         <div className="flex items-center gap-2">
                           <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Quantity</span>
                           <span className="bg-gradient-to-r from-[#7C2A47]/10 to-[#8d3454]/10 px-2 py-1 rounded-md font-bold text-[#7C2A47] text-xs border border-[#7C2A47]/20 min-w-[1.75rem] text-center">
                             {quantity}
                           </span>
                           <span className="text-[10px] text-gray-600">
                             {quantity === 1 ? 'item' : 'items'}
                           </span>
                         </div>

                         {/* Price */}
                         <div className="flex items-baseline gap-1.5">
                           <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Price</span>
                           <span className="text-base sm:text-lg font-bold text-[#7C2A47]">
                             ₹{parseFloat(productPrice).toLocaleString('en-IN')}
                           </span>
                           {quantity > 1 && (
                             <>
                               <span className="text-gray-400 text-xs">×</span>
                               <span className="text-xs text-gray-600 font-medium">{quantity}</span>
                             </>
                           )}
                         </div>
                       </div>
                     </div>
                     
                     {/* Total Amount Row (if quantity > 1) */}
                     {quantity > 1 && (
                       <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200">
                         <span className="text-xs font-semibold text-gray-700">Total Amount</span>
                         <span className="text-base sm:text-lg font-bold text-[#7C2A47]">
                           ₹{totalPrice.toLocaleString('en-IN')}
                         </span>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact Information */}
          <div className="lg:col-span-7 flex">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl w-full flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#7C2A47] via-[#8d3454] to-[#7C2A47] px-6 py-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="relative">
                  <h2 className="text-base sm:text-lg font-bold text-white mb-1">
                    Contact Information
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90">
                    Fill in your details to complete the enquiry
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col">
                <div className="space-y-5 flex-1">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="userName" className="block text-xs font-semibold text-gray-700 mb-2.5 uppercase tracking-wide">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400 group-focus-within:text-[#7C2A47] transition-colors" />
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
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] outline-none transition-all duration-200 text-sm bg-gray-50 hover:bg-white hover:border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Mobile Field */}
                  <div>
                    <label htmlFor="userMobile" className="block text-xs font-semibold text-gray-700 mb-2.5 uppercase tracking-wide">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400 group-focus-within:text-[#7C2A47] transition-colors" />
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
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] outline-none transition-all duration-200 text-sm bg-gray-50 hover:bg-white hover:border-gray-300"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                      <span>Enter a valid 10-digit mobile number</span>
                  </p>
                </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-auto">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#7C2A47] to-[#8d3454] text-white font-semibold rounded-xl hover:from-[#6a243d] hover:to-[#7a2d4a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Enquiry</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 border-2 border-[#7C2A47] text-[#7C2A47] font-semibold rounded-xl hover:bg-[#7C2A47] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] text-sm"
                  >
                    <MessageCircle size={16} />
                    <span>Contact via WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
            </div>

        {/* Benefits Section */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#7C2A47]/10 flex items-center justify-center flex-shrink-0">
                <Truck size={18} className="text-[#7C2A47]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">Free Shipping</p>
                <p className="text-[10px] text-gray-600">Worldwide delivery</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#7C2A47]/10 flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-[#7C2A47]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">Secure Payment</p>
                <p className="text-[10px] text-gray-600">100% secured</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#7C2A47]/10 flex items-center justify-center flex-shrink-0">
                <Award size={18} className="text-[#7C2A47]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">Trusted Brand</p>
                <p className="text-[10px] text-gray-600">Top brands trust us</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-[#7C2A47] flex-shrink-0" />
            <p className="text-xs text-gray-600 text-center leading-relaxed">
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
