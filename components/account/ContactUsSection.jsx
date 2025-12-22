'use client';

import React from 'react';
import { MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

const ContactUsSection = () => {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
          <p className="text-gray-600 mb-6">
            Have questions or concerns? We're here to help! Reach out to us through any of the following methods.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#7C2A47]/10 rounded-lg">
                <Mail className="h-5 w-5 text-[#7C2A47]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                <p className="text-gray-600">support@example.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#7C2A47]/10 rounded-lg">
                <Phone className="h-5 w-5 text-[#7C2A47]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#7C2A47]/10 rounded-lg">
                <MapPin className="h-5 w-5 text-[#7C2A47]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                <p className="text-gray-600">
                  123 Business Street<br />
                  City, State 12345<br />
                  Country
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
          <div className="space-y-2 text-gray-600">
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsSection;

