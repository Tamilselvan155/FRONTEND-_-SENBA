'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const EnquiryPage = () => {
  const enquiries = useSelector((state) => state.enquiry.enquiries);

  if (!enquiries || enquiries.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">Enquiries</h2>
        <p className="text-slate-500">No enquiries have been submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">📋 All Enquiries</h2>

      <div className="space-y-8">
        {enquiries.map((enquiry, index) => (
          <div key={index} className="border p-6 rounded-xl shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-2">🙋 {enquiry.userName}</h3>
            <p className="text-sm text-slate-500 mb-4">📱 {enquiry.userMobile}</p>

            <div className="space-y-3">
              {enquiry.items.map((item, i) => (
                <div key={i} className="border p-3 rounded-md bg-slate-50">
                  <p>🛍 <strong>Product:</strong> {item.name}</p>
                  <p>💰 <strong>Price:</strong> ₹{item.price}</p>
                  <p>📦 <strong>Quantity:</strong> {item.quantity}</p>
                  <p>🔗 <strong>Product Link:</strong>{' '}
                    <Link
                      href={item.link || '#'}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      View Product
                    </Link>
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-slate-600">
              <p>🧾 <strong>Total Price:</strong> ₹{enquiry.totalPrice}</p>
              <p>📦 <strong>Total Items:</strong> {enquiry.totalQuantity}</p>
              <p>🕒 <strong>Time:</strong> {new Date(enquiry.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnquiryPage;
