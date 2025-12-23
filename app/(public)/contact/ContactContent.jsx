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
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Direct Google Sheets Web App URL
  const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyS9_mT07uCbOtlLVsMyx1bW7FTA7TRsu_WEZc1PJOzvHeDRn4FqSKCwVjt3SmOUDPR/exec';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields.');
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
      body: JSON.stringify({ name, email, mobile, message }),
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
    setMobile('');
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
{/* Right Side - Contact Form */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, delay: 0.3 }}
  className="w-full"
>
  <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100 h-full hover:shadow-2xl transition-shadow duration-300">
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
        Send Us a <span className="text-[#7C2A47]">Message</span>
      </h2>
      <p className="text-gray-600 mt-2">Fill out the form below and we'll get back to you shortly.</p>
    </div>
    
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Email Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 hover:border-gray-300"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 hover:border-gray-300"
            required
          />
        </div>
      </div>
      
      {/* Mobile Number - Full Width */}
      <div className="space-y-2">
        <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700">
          Mobile Number
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            id="mobile"
            placeholder="+1 (555) 000-0000"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            maxLength={15}
            className="w-full border-2 border-gray-200 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 hover:border-gray-300"
          />
        </div>
      </div>
      
      {/* Message - Full Width */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
          Your Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          placeholder="Tell us how we can help you..."
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 hover:border-gray-300 resize-none"
          required
        ></textarea>
        <p className="text-xs text-gray-500 mt-1">Please provide as much detail as possible</p>
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] hover:from-[#6a2340] hover:to-[#7a2a4a] text-white px-6 py-4 rounded-lg font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2 group"
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
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Send Message
          </>
        )}
      </button>
      
      {/* Privacy Notice */}
      <p className="text-xs text-center text-gray-500">
        By submitting this form, you agree to our{" "}
        <a href="/privacy" className="text-[#7C2A47] hover:underline font-medium">
          Privacy Policy
        </a>
      </p>
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




