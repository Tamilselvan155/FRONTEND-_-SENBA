'use client';

import React, { useState } from 'react';
import { X, PhoneCall, User,MessageCircle , Phone} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addEnquiry } from '@/lib/features/enquiry/enquirySlice';
import toast from 'react-hot-toast';

const ModalPopup = ({
  isOpen,
  onClose,
  items = [],
  totalPrice = 0,
  totalQuantity = 0,
  currency = '₹',
  onSendWhatsApp,
  showInitialForm = false,
}) => {
  const [showForm, setShowForm] = useState(showInitialForm);
  const [userName, setUserName] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const dispatch = useDispatch();

  // 🧠 Validate name and mobile before submitting
  const validateInputs = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!userName.trim() || !nameRegex.test(userName)) {
      toast.error('Please enter a valid name (letters only).');
      return false;
    }

    if (!mobileRegex.test(userMobile)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return false;
    }

    return true;
  };

  const handleSubmitEnquiry = () => {
    if (!validateInputs()) return;

    const enhancedItems = items.map((item) => {
      const productLink =
        typeof window !== 'undefined'
          ? `${window.location.origin}/product/${item.id || item.slug || 'unknown'}`
          : '';
      return { ...item, link: productLink };
    });

    const enquiryData = {
      userName,
      userMobile,
      items: enhancedItems,
      totalPrice,
      totalQuantity,
      createdAt: new Date().toISOString(),
    };

    dispatch(addEnquiry(enquiryData));

    toast.success('Enquiry submitted successfully!');

    // Reset form
    setShowForm(false);
    setUserName('');
    setUserMobile('');
    onClose();
  };

  const handleSendWhatsApp = () => {
    const enhancedItems = items.map((item) => {
      const productLink =
        typeof window !== 'undefined'
          ? `${window.location.origin}/product/${item.id || item.slug || 'unknown'}`
          : '';
      return { ...item, link: productLink };
    });

    let message = `Hello, I'm interested in placing an order. Here are the details:\n\n`;
    enhancedItems.forEach((item, index) => {
      message += `Item ${index + 1}:\n`;
      message += `🛍 *Product:* ${item.name}\n`;
      message += `💰 *Price:* ${currency}${item.price}\n`;
      message += `📦 *Quantity:* ${item.quantity}\n`;
      message += `🖼 *Product Link:* ${item.link}\n\n`;
    });

    if (userName && userMobile) {
      message += `🙋 *Name:* ${userName}\n📱 *Mobile:* ${userMobile}\n`;
    }

    message += `\nTotal: ${currency}${totalPrice}\nTotal Items: ${totalQuantity}\n\nPlease let me know the next steps.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '9345795629';
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

    setShowForm(false);
    setUserName('');
    setUserMobile('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.5)]"
        onClick={() => {
          onClose();
          setShowForm(false);
          setUserName('');
          setUserMobile('');
        }}
      ></div>

      <div className="relative bg-white w-full max-w-[350px] md:max-w-md p-6 rounded-2xl shadow-xl z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[rgb(55,50,46)]">Confirm Enquiry</h2>
          <button
            onClick={() => {
              onClose();
              setShowForm(false);
              setUserName('');
              setUserMobile('');
            }}
          >
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Please choose how you'd like to proceed with your enquiry.
        </p>

        {showForm && (
          <div className="space-y-4 mb-4">

  {/* 🟩 Name field */}
  <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#c31e5a]-500 transition">
    <User className="text-[#c31e5a]-500 mr-3" size={20} />
    <input
      type="text"
      placeholder="Your Name"
      value={userName}
      onChange={(e) => {
        const value = e.target.value;
        if (/^[A-Za-z\s]*$/.test(value)) {
          setUserName(value);
        }
      }}
      className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
    />
  </div>

  {/* 🟩 Mobile number field */}
  <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#c31e5a]-500 transition">
    <Phone className="text-[#c31e5a]-500 mr-3" size={20} />
    <input
      type="tel"
      placeholder="Mobile Number"
      value={userMobile}
      onChange={(e) => {
        const value = e.target.value;
        if (/^[0-9]*$/.test(value) && value.length <= 10) {
          setUserMobile(value);
        }
      }}
      maxLength={10}
      className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
    />
  </div>

</div>
        )}

        <div className={`flex ${showForm ? 'justify-center' : 'justify-end'} gap-3`}>
          {!showForm ? (
            <>
              <button
                onClick={handleSendWhatsApp}
                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
             
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-green-400"
            >
              <path d="M12.001 2.003a9.94 9.94 0 00-9.941 9.94c0 1.753.46 3.416 1.335 4.896l-1.41 5.153 5.286-1.386a9.946 9.946 0 004.73 1.205h.001a9.94 9.94 0 009.94-9.94 9.935 9.935 0 00-9.941-9.868zm0 18.163a8.19 8.19 0 01-4.168-1.142l-.299-.178-3.133.822.837-3.058-.195-.314a8.18 8.18 0 01-1.268-4.385 8.195 8.195 0 018.195-8.193 8.174 8.174 0 018.193 8.192 8.196 8.196 0 01-8.192 8.194zm4.7-6.113c-.257-.128-1.515-.746-1.75-.83-.235-.085-.406-.128-.577.128s-.662.829-.812 1.002c-.15.17-.3.192-.556.064-.256-.128-1.082-.4-2.06-1.273-.762-.68-1.277-1.523-1.428-1.78-.15-.256-.016-.395.113-.523.116-.115.257-.3.385-.448.128-.15.17-.256.257-.427.085-.17.042-.32-.021-.448-.063-.128-.576-1.393-.789-1.905-.206-.495-.416-.428-.577-.436-.15-.009-.32-.011-.492-.011a.948.948 0 00-.687.321c-.234.256-.9.877-.9 2.14 0 1.262.922 2.48 1.05 2.65.127.17 1.817 2.773 4.404 3.888.616.266 1.096.425 1.47.544.617.196 1.18.168 1.622.102.495-.073 1.515-.62 1.728-1.219.213-.6.213-1.114.15-1.219-.064-.105-.234-.17-.491-.3z"/>
          </svg>
                WhatsApp
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                <User size={16} />
                Add Form
              </button>
            </>
          ) : (
            <button
              onClick={handleSubmitEnquiry}
              className="flex items-center gap-2 px-5 py-2 bg-[#f48638] text-white rounded hover:bg-[#f48638]-700 transition"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalPopup;
