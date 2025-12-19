'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { User, Phone, ArrowLeft, Send, MessageCircle, Package, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="space-y-1.5">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              Confirm Enquiry
            </h1>
            <p className="text-sm text-gray-600">
              Please provide your details to proceed with your enquiry.
            </p>
          </div>
        </div>

         <div className="flex justify-center">
           <div className="w-full max-w-5xl">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
               {/* Left Column - Product Details */}
               <div>
                 {productId && (
                   <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                     <div className="bg-gradient-to-r from-[#7C2A47] to-[#8d3454] px-5 sm:px-6 py-3">
                       <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                         <Package size={16} />
                         Product Details
                       </h2>
                     </div>
                     
                     <div className="p-4 sm:p-5">
                       <div className="flex gap-3 sm:gap-4">
                         {productImage && (
                           <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                             <img
                               src={productImage}
                               alt={productName}
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                 e.target.src = '/placeholder-product.png';
                               }}
                             />
                           </div>
                         )}
                         <div className="flex-1 min-w-0">
                           <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                             {productName}
                           </h3>
                           <div className="space-y-2">
                             <div className="flex items-center gap-2 text-xs text-gray-600">
                               <span className="font-medium">Quantity:</span>
                               <span className="bg-gray-100 px-2 py-0.5 rounded-md font-semibold text-gray-900 text-xs">
                                 {quantity}
                               </span>
                             </div>
                             <div className="pt-2 border-t border-gray-200">
                               <div className="flex items-baseline gap-2">
                                 <span className="text-xs text-gray-500">Price:</span>
                                 <span className="text-base sm:text-lg font-bold text-[#7C2A47]">
                                   ₹{parseFloat(productPrice).toLocaleString('en-IN')}
                                 </span>
                                 {quantity > 1 && (
                                   <>
                                     <span className="text-gray-400 text-xs">×</span>
                                     <span className="text-xs text-gray-600">{quantity}</span>
                                     <span className="text-gray-400 text-xs">=</span>
                                     <span className="text-lg sm:text-xl font-bold text-[#7C2A47]">
                                       ₹{totalPrice.toLocaleString('en-IN')}
                                     </span>
                                   </>
                                 )}
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
               </div>

               {/* Right Column - Contact Information */}
               <div>
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
               <div className="bg-gradient-to-r from-[#7C2A47] to-[#8d3454] px-5 sm:px-6 py-3 border-b border-[#7C2A47]-200">
                 <h2 className="text-sm sm:text-base font-bold text-white">
                   Contact Information
                 </h2>
                 <p className="text-xs text-white/90 mt-1">
                   Fill in your details to complete the enquiry
                  </p>
                </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="userName" className="block text-xs font-semibold text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
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
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] outline-none transition-all duration-200 text-sm bg-white hover:border-gray-400"
                    />
                  </div>
                </div>

                {/* Mobile Field */}
                <div>
                  <label htmlFor="userMobile" className="block text-xs font-semibold text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
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
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] outline-none transition-all duration-200 text-sm bg-white hover:border-gray-400"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                    <span>Enter a valid 10-digit mobile number</span>
                  </p>
            </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7C2A47] text-white font-semibold rounded-lg hover:bg-[#6a243d] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] text-sm"
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
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-[#7C2A47] text-[#7C2A47] font-semibold rounded-lg hover:bg-[#7C2A47] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white transform hover:scale-[1.02] active:scale-[0.98] text-sm"
                  >
                    <MessageCircle size={16} />
                    <span>Contact via WhatsApp</span>
                  </button>
                </div>
                 </form>
                 </div>
               </div>
             </div>

             {/* Info Section - Full Width */}
             <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
               <p className="text-xs text-gray-600 text-center leading-relaxed">
                 By submitting this form, you agree to our terms and conditions. We'll contact you shortly regarding your enquiry.
               </p>
             </div>
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


