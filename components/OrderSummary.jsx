'use client'

import React, { useState } from 'react';
import ModalPopup from './PopupModel';

const OrderSummary = ({ totalPrice, items }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  // Calculate total quantity from items array
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSendWhatsApp = ({ userName, userMobile }) => {
    // Get base URL dynamically (e.g., http://localhost:3000 or your deployed URL)
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

    let message = `Hi, I'm interested in booking an enquiry for the following products:\n\n`;

    items.forEach((item) => {
      // Use provided URL if available; otherwise, build from id
      const productLink = item.url || `${baseUrl}/product/${item.id}`;

      message += `🛍️ Product: ${item.name}\n`;
      message += `💰 Price: ${currency}${item.price}\n`;
      message += `📦 Quantity: ${item.quantity}\n`;
      message += `🖼️ Product Link: ${productLink}\n\n`;
    });

    message += `Total: ${currency}${totalPrice.toLocaleString()}\n\n`;

    if (userName && userMobile) {
      message += `🙋 Name: ${userName}\n📱 Mobile: ${userMobile}\n\n`;
    }

    message += `Please let me know the next steps.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "9345795629";

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    setIsModalOpen(false);
  };

  return (
    <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
      <h2 className='text-xl font-medium text-slate-600 mb-4'>Order Summary</h2>

      <div className='flex justify-between mb-2'>
        <p className='text-lg'>Total:</p>
        <p className='font-medium text-xl'>{currency}{totalPrice.toLocaleString()}</p>
      </div>

      <div className='flex justify-between mb-4'>
        <p className='text-lg'>Total Quantity:</p>
        <p className='font-medium text-xl'>{totalQuantity}</p>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className='w-full bg-green-600 text-white py-2.5 text-lg rounded hover:bg-green-700 active:scale-95 transition-all'
      >
        Book Enquiry
      </button>

      <ModalPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={items}
        totalPrice={totalPrice}
        totalQuantity={totalQuantity}
        currency={currency}
        onSendWhatsApp={handleSendWhatsApp}
      />
    </div>
  );
};

export default OrderSummary;
