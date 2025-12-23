'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Shield, Lock, Eye, FileText, Users, AlertCircle, DollarSign, CreditCard, AlertTriangle } from 'lucide-react';
import BackButton from './BackButton';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Eye,
      title: 'What information we collect',
      content: 'The types of data we collect depend on how you interact with our Site. Information you provide directly may include contact details and order specifics when you create an account, place an order by communications.'
    },
    {
      icon: FileText,
      title: 'How we use your information',
      content: 'We use your information for processing orders, analysing website activity, marketing, and security. We may also disclose information when legally required.'
    },
    {
      icon: Users,
      title: 'Sharing your personal information',
      content: 'Information may be shared with service providers for tasks like payment processing and shipping, or if legally mandated. We do not sell your personal information.'
    },
    {
      icon: Shield,
      title: 'Your rights',
      content: 'You may have rights regarding your personal information, including access, correction, and deletion, depending on your location. You can opt out of marketing.'
    },
    {
      icon: Lock,
      title: 'Security of your personal data',
      content: 'We take measures to protect your data, though no method is entirely secure.'
    },
    {
      icon: AlertCircle,
      title: 'Changes to this privacy policy',
      content: 'This policy may be updated, with the "Effective Date" revised.'
    }
  ];

  const pricingSections = [
    {
      icon: DollarSign,
      title: 'Pricing',
      content: 'Prices are subject to change without notice and are billed at the rate in effect at the time of the order.'
    },
    {
      icon: CreditCard,
      title: 'Payment terms',
      content: 'Immediate'
    },
    {
      icon: FileText,
      title: 'Service charge',
      content: 'A service charge may be applied to delinquent accounts.'
    },
    {
      icon: AlertTriangle,
      title: 'Force Majeure',
      content: 'The company is not liable for delays or non-performance caused by events beyond its reasonable control, such as acts of war, strikes, or natural disasters.'
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
              <span className="text-[#7C2A47]">PRIVACY POLICY</span>
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#7C2A47] to-[#E6A02A] mx-auto rounded-full mb-4"></div>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              This Privacy Policy describes how Senba Pumps collects, uses, and discloses your Personal Information when you visit, use our services, or make a purchase from senbapumpsandmotors.
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

          {/* Pricing Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 sm:p-8 border border-blue-200"
          >
            <div className="text-center mb-6">
              <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5 text-[#7C2A47]" />
                Pricing Details
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#7C2A47] to-[#E6A02A] mx-auto rounded-full mb-4"></div>
              <p className="text-base text-gray-600">
                Important information regarding pricing and payment terms.
              </p>
            </div>

            <div className="space-y-4">
              {pricingSections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + (0.1 * index) }}
                    className="bg-white rounded-lg p-4 sm:p-5 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-2">
                          {index + 1}. {section.title}
                        </h3>
                        <p className="text-base text-gray-700 leading-relaxed text-left break-words">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gray-50 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200"
          >
            <div className="text-center mb-6">
              <h2 className="text-base font-bold text-gray-900 mb-2">
                7. Contact Us
              </h2>
              <p className="text-base text-gray-600">
                For questions or to exercise rights, contact us at:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#7C2A47]/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#7C2A47]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Email</h3>
                    <a 
                      href="mailto:senbapumpsandmotors@gmail.com"
                      className="text-base text-[#7C2A47] hover:text-[#8B3A5A] hover:underline transition-colors break-all"
                    >
                      senbapumpsandmotors@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Postal Address */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#7C2A47]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#7C2A47]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Postal Address</h3>
                    <p className="text-base text-gray-700 leading-relaxed text-left break-words">
                      15/29, Thambuchetty Street,<br />
                      Near Rayapuram Bridge,<br />
                      Chennai-600001
                    </p>
                  </div>
                </div>
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
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

