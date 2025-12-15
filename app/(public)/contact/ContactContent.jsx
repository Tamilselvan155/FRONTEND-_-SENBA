'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Headphones, CheckCircle2, Award, MessageSquare, Send } from 'lucide-react';
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

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 md:py-16">
        <div className="w-full">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Contact <span className="text-[#7C2A47]">Us</span>
            </h1>
          </motion.div>

          {/* Introduction Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 sm:mb-10"
          >
            <div className="text-center w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Your Trusted Partner in <span className="text-[#7C2A47]">Pumping Solutions</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-5">
                At Senba Pumps, we're committed to providing exceptional service and support. Whether you need product information, technical assistance, or custom solutions, our experienced team is ready to help you find the perfect pumping solution for your needs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7C2A47]"></div>
                  <span>Product Inquiries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7C2A47]"></div>
                  <span>Technical Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7C2A47]"></div>
                  <span>Custom Solutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7C2A47]"></div>
                  <span>24/7 Customer Service</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Why Contact Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 sm:mb-10"
          >
            {/* <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                Why <span className="text-[#7C2A47]">Contact Us?</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                We're here to help you find the perfect pumping solution for your needs
              </p>
            </div>
             */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-70% mx-auto">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">Product Inquiries</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Get detailed information about our products</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center">
                  <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">Technical Support</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Expert assistance for your technical needs</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">Custom Solutions</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Tailored solutions for your specific requirements</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Highlights Section
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 sm:mb-12"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Why Choose <span className="text-[#7C2A47]">Us?</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Experience the difference with our commitment to excellence
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 group-hover:text-[#7C2A47] transition-colors duration-300">Quick Response</h3>
                <p className="text-[10px] sm:text-xs text-gray-600">Within 24 hours</p>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 group-hover:text-[#7C2A47] transition-colors duration-300">Expert Support</h3>
                <p className="text-[10px] sm:text-xs text-gray-600">Professional guidance</p>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 group-hover:text-[#7C2A47] transition-colors duration-300">Quality Assured</h3>
                <p className="text-[10px] sm:text-xs text-gray-600">Premium products</p>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 group-hover:text-[#7C2A47] transition-colors duration-300">Trusted Brand</h3>
                <p className="text-[10px] sm:text-xs text-gray-600">Industry leader</p>
              </div>
            </div>
          </motion.div> */}
          
         

          {/* Newsletter */}
          <div className="w-full mb-8 sm:mb-10">
            <Newsletter />
          </div>

          {/* Contact Form and Map Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="w-full"
            >
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-6 border border-gray-100 h-full">
                <div className="text-center lg:text-left mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">Send us a Message</h2>
                  <p className="text-xs text-gray-600">Fill out the form below and we'll get back to you as soon as possible</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows="3"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] hover:from-[#6a2340] hover:to-[#7a2a4a] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Google Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 h-full"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.077930690909!2d77.59999031483194!3d11.000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba858bae5bb2581%3A0x2cc379e88968b8cd!2sSenba%20Pumps%20Private%20Limited!5e0!3m2!1sen!2sin!4v1734000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}




