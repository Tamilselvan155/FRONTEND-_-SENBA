'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Headphones, CheckCircle2, Award, MessageSquare, Send, Building2, Globe } from 'lucide-react';
import { toast } from 'react-toastify';
import QuickEnquiryButton from '@/components/QuickEnquiryButton';
import Newsletter from '@/components/Newsletter';

export default function ContactContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Direct Google Sheets Web App URL
  const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyS9_mT07uCbOtlLVsMyx1bW7FTA7TRsu_WEZc1PJOzvHeDRn4FqSKCwVjt3SmOUDPR/exec';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);

    // Send data to Google Sheets (fire and forget)
    fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors', // Bypass CORS - we can't read response but data will be saved
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ name, email, message }),
    }).catch((error) => {
      // Silently handle errors - data might still be saved
      console.log('Fetch completed (no-cors mode)');
    });

    // Show success toast immediately (data is being sent in background)
    toast.success('Thank you for contacting us! Our team will reach you soon.', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
    });
    
    // Clear form
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Quick Enquiry Button - Fixed Position */}
      <QuickEnquiryButton/>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">
              Contact <span className="text-[#7C2A47]">Us</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#7C2A47] to-[#E6A02A] mx-auto rounded-full mb-4"></div>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Get in touch with us for questions or to exercise your rights
            </p>
          </motion.div>

          {/* Contact Details and Form Section */}
          <div className="mb-8 sm:mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {/* Left Side - Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 h-full hover:shadow-2xl transition-shadow duration-300">
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Get in <span className="text-[#7C2A47]">Touch</span>
                      </h2>
                      <p className="text-base text-gray-600">
                        We're here to help! Reach out to us through any of the following channels.
                      </p>
                    </div>

                    {/* Contact Items */}
                    <div className="space-y-4 flex-1">
                      {/* Email Card */}
                      <div className="flex items-start gap-5 p-5 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-[#7C2A47]/30 hover:shadow-md group">
                        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Mail className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-2">Email Address</h3>
                          <a 
                            href="mailto:senbapumpsandmotors@gmail.com"
                            className="text-base text-[#7C2A47] hover:text-[#8B3A5A] hover:underline transition-colors font-medium break-all block mb-2"
                          >
                            senbapumpsandmotors@gmail.com
                          </a>
                          <p className="text-base text-gray-500">We'll respond within 24 hours</p>
                        </div>
                      </div>

                      {/* Address Card */}
                      <div className="flex items-start gap-5 p-5 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-[#7C2A47]/30 hover:shadow-md group">
                        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <MapPin className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-2">Postal Address</h3>
                          <p className="text-base text-gray-700 leading-relaxed mb-2 text-left break-words">
                            15/29, Thambuchetty Street,<br />
                            Near Rayapuram Bridge,<br />
                            Chennai-600001
                          </p>
                          <p className="text-base text-gray-500">Visit us during business hours</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 h-full hover:shadow-2xl transition-shadow duration-300">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 mb-6">
                    Send Us a <span className="text-[#7C2A47]">Message</span>
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-2">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                          Your Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-base font-semibold text-gray-700 mb-2">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        placeholder="Tell us how we can help you..."
                        rows="5"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] hover:from-[#6a2340] hover:to-[#7a2a4a] text-white px-6 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-full"
          >
            <Newsletter />
          </motion.div>
        </div>
      </div>
    </div>
  );
}




