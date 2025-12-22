'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Calendar, AlertCircle, Package, CheckCircle, FileText } from 'lucide-react';
import BackButton from './BackButton';

export default function RefundPolicy() {
  const mainSections = [
    {
      icon: RefreshCw,
      title: 'Refund Eligibility',
      content: 'Refund will be applicable for products which has manufacturing defects.'
    },
    {
      icon: Calendar,
      title: 'Refund Time Period',
      content: '7 days liable time from the date of billing.'
    },
    {
      icon: AlertCircle,
      title: 'External Damage at Delivery',
      content: 'External damage at the time of delivery (should have unboxing video and photos).'
    }
  ];

  const termsConditions = [
    {
      icon: CheckCircle,
      title: 'Product Condition',
      content: 'Product should not be damaged by consumer.'
    },
    {
      icon: Package,
      title: 'Packaging Condition',
      content: 'Outer case (box) should be in good condition.'
    },
    {
      icon: FileText,
      title: 'Complete Return',
      content: 'Product spare or accessories inside the box should be returned along with products at the time of refund process.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >


            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                <span className="text-[#7C2A47]">REFUND POLICY</span>
              </h1>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#7C2A47] to-[#E6A02A] mx-auto rounded-full mb-4"></div>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Please review the following refund policy for your Senba Pumps & Motors products.
              </p>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            {/* Main Refund Sections */}
            {mainSections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl hover:border-[#7C2A47]/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center shadow-md">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-base font-bold text-gray-900 mb-3">
                        {section.title}
                      </h2>
                      <p className="text-base text-gray-700 leading-relaxed text-left break-words">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Terms and Conditions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 sm:p-8 border border-blue-200"
            >
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#7C2A47]" />
                  Terms and Conditions
                </h2>
                <p className="text-base text-gray-600 mb-4">
                  The following conditions must be met for a refund to be processed:
                </p>
              </div>

              <div className="space-y-4">
                {termsConditions.map((term, index) => {
                  const IconComponent = term.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 sm:p-5 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-2">
                            {index + 1}. {term.title}
                          </h3>
                          <p className="text-base text-gray-700 leading-relaxed text-left break-words">
                            {term.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 sm:p-8 border border-amber-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-gray-900 mb-2">
                    Important Notice
                  </h2>
                  <p className="text-base text-gray-700 leading-relaxed text-left break-words">
                    For refund requests, please ensure you have all required documentation including unboxing videos and photos (if applicable), original purchase receipt, and ensure the product and packaging are in the required condition. For refund inquiries or to initiate a refund, please contact us using the information provided in our Contact page.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8 sm:mt-12 text-center"
          >
            <p className="text-base text-gray-500">
              For refund requests or inquiries, please visit our{' '}
              <a href="/contact" className="text-[#7C2A47] hover:underline font-medium">
                Contact page
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

