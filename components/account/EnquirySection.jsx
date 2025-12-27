'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

const EnquirySection = () => {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Enquiries</h2>
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No enquiries yet</p>
        <p className="text-sm text-gray-500 mt-2">Your product enquiries will appear here</p>
        <button
          onClick={() => router.push('/enquiry')}
          className="mt-4 px-4 py-2 bg-[#7C2A47] text-white text-sm font-medium rounded-lg hover:bg-[#6a2340] transition-colors"
        >
          Create New Enquiry
        </button>
      </div>
    </div>
  );
};

export default EnquirySection;


