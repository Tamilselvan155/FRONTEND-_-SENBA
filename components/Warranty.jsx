'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileCheck, Settings, Shield, XCircle, AlertTriangle } from 'lucide-react';
import BackButton from './BackButton';

export default function Warranty() {
  const sections = [
    {
      icon: Calendar,
      title: 'Warranty period',
      content: 'Valid for up to 24 months from the date of purchase, contingent on correct installation and use.'
    },
    {
      icon: FileCheck,
      title: 'Proof of purchase',
      content: 'A valid copy of the sales receipt and warranty card is required for any warranty claim.'
    },
    {
      icon: Settings,
      title: 'Installation',
      content: 'Installation must be done according to the manufacturer\'s manual and may require validation by a certified service technician.'
    },
    {
      icon: Shield,
      title: 'Warranty coverage',
      content: 'The warranty covers only manufacturing defects.'
    },
    {
      icon: XCircle,
      title: 'Exclusions',
      content: 'The warranty typically does not cover electrical parts, damage from mishandling, foreign objects, or improper chemical use.'
    },
    {
      icon: AlertTriangle,
      title: 'Voided warranty',
      content: 'The warranty will be voided if any servicing is performed by an unauthorized technician.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              <span className="text-[#7C2A47]">WARRANTY CONDITIONS</span>
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#7C2A47] to-[#E6A02A] mx-auto rounded-full mb-4"></div>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Please review the following warranty conditions for your Senba Pumps & Motors products.
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
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 sm:p-8 border border-amber-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900 mb-2">
                  Important Notice
                </h2>
                <p className="text-base text-gray-700 leading-relaxed text-left break-words">
                  Please ensure you retain your original purchase receipt and warranty card. These documents are essential for processing any warranty claims. For warranty inquiries or claims, please contact us using the information provided in our Contact page.
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
            For warranty claims or inquiries, please visit our{' '}
            <a href="/contact" className="text-[#7C2A47] hover:underline font-medium">
              Contact page
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

