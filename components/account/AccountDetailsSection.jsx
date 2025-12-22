'use client';

import React from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';

const AccountDetailsSection = ({ userData }) => {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Account Details</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Basic Info - Left Side */}
          <div className="space-y-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-900 truncate">
                  {userData.name ? userData.name.toLowerCase().replace(/\s+/g, '') : userData.email?.split('@')[0] || 'N/A'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-900">{userData.name || 'Not set'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-900 truncate">{userData.email || 'N/A'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-900">
                  {userData.createdAt 
                    ? userData.createdAt.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Other Details - Right Side */}
          <div className="space-y-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Account Information</h3>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Account Role
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Shield className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-900 capitalize">{userData.role || 'User'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Account Status
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  userData.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {userData.status ? userData.status.charAt(0).toUpperCase() + userData.status.slice(1) : 'Active'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Last Login
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-900">
                  {userData.lastLoginAt 
                    ? new Date(userData.lastLoginAt).toLocaleString('en-US')
                    : 'Not available'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsSection;

