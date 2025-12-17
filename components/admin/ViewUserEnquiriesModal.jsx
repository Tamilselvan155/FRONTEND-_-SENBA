'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { fetchUserEnquiries } from '@/lib/actions/userActions';

const ViewUserEnquiriesModal = ({ isOpen, onClose, userId, userName }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchEnquiriesData();
    } else {
      setEnquiries([]);
      setError(null);
    }
  }, [isOpen, userId]);

  const fetchEnquiriesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchUserEnquiries(userId);
      if (response.success && response.data) {
        setEnquiries(response.data || []);
      } else {
        setEnquiries([]);
      }
    } catch (err) {
      console.error('Error fetching user enquiries:', err);
      setError(err.message || 'Failed to fetch enquiries');
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
      <div className="bg-white bg-opacity-95 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Enquiries - {userName || 'User'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No enquiries found</p>
              {enquiries.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">Enquiries feature coming soon</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">S.N.</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Message</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enquiry, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">{index + 1}</td>
                      <td className="py-4 px-4">{enquiry.subject || 'N/A'}</td>
                      <td className="py-4 px-4">{enquiry.message || 'N/A'}</td>
                      <td className="py-4 px-4">
                        {enquiry.createdAt
                          ? new Date(enquiry.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            enquiry.status === 'resolved'
                              ? 'bg-green-100 text-green-800'
                              : enquiry.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {enquiry.status || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserEnquiriesModal;

