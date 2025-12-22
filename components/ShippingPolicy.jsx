'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Package, Globe, AlertTriangle, Navigation } from 'lucide-react';
import BackButton from './BackButton';

export default function ShippingPolicy() {
  const sections = [
    {
      icon: MapPin,
      title: 'Shipping Location Variations',
      content: 'Shipping policy might be differed based on location and company terms.'
    },
    {
      icon: Navigation,
      title: 'Free Shipping - Chennai',
      content: 'Free shipping within 5 km radius from centre of Chennai.'
    },
    {
      icon: Truck,
      title: 'Delivery Methods',
      content: 'Delivered through lorry service or courier based on consumer request.'
    },
    {
      icon: Globe,
      title: 'Free Shipping - Tamilnadu',
      content: 'Free shipping is only within Tamilnadu.'
    },
    {
      icon: AlertTriangle,
      title: 'Shipping Options Changes',
      content: 'Shipping options might be changed based on non-performance caused by events beyond its reasonable control, such as acts of war, strikes, natural disasters or company decision.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          {/* Go Back Button
          <div className="mb-3 sm:mb-4">
            <BackButton fallbackUrl="/" />
          </div> */}

          <div className="text-center mb-4 mt-4 sm:mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              <span className="text-[#7C2A47]">SHIPPING POLICY</span>
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#7C2A47] to-[#E6A02A] mx-auto rounded-full mb-4"></div>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Please review the following shipping policy for your Senba Pumps & Motors orders.
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center shadow-md">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-gray-900 mb-3">
                      {index + 1}. {section.title}
                    </h2>
                    <p className="text-base text-gray-700 leading-relaxed text-left break-words">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 sm:p-8 border border-blue-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900 mb-2">
                  Important Information
                </h2>
                <p className="text-base text-gray-700 leading-relaxed text-left break-words">
                  Shipping charges and delivery times may vary based on your location and the size of your order. For specific shipping inquiries or to request a particular delivery method (lorry service or courier), please contact us using the information provided in our Contact page.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <p className="text-base text-gray-500">
            For shipping inquiries or to request specific delivery methods, please visit our{' '}
            <a href="/contact" className="text-[#7C2A47] hover:underline font-medium">
              Contact page
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

