'use client';

import { ArrowRight, ShoppingCart, Send } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import ModalPopup from './PopupModel';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/features/cart/cartSlice';
import toast from 'react-hot-toast';
import { assets } from '@/assets/assets';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  // 🛒 Add to Cart
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    dispatch(addToCart({ productId: product.id }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleEnquiry = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleSendWhatsApp = ({ userName, userMobile }) => {
    const quantity = product.id || 1;
    const productLink = typeof window !== 'undefined' ? window.location.href : '';

    let message = `
Hi, I'm interested in booking an enquiry for the following product:
 *Product:* ${product.name}
 *Price:* ${currency}${product.price}
 *Quantity:* ${quantity}
 *Product Link:* ${productLink}
`;

    if (userName && userMobile) {
      message += `🙋 *Name:* ${userName}\n📱 *Mobile:* ${userMobile}\n`;
    }

    message += `Please let me know the next steps.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '9345795629';

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <>
      <Link
        href={`/product/${product.id}`}
        className="w-full max-w-[95vw] mx-auto flex flex-col items-center rounded-xl overflow-visible sm:max-w-[348px] md:max-w-[348px] lg:max-w-[284px] bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        {/* Image Container */}
        <div
          className="
            relative w-full 
            h-[430px] 
            sm:h-[340px]   /* 👈 Tablet view */
            md:h-[360px]   /* 👈 Consistent for md range */
            lg:h-[380px]   /* 👈 Desktop view */
            rounded-t-xl overflow-hidden 
            hover:-translate-y-2 
            transition-transform duration-300
          "
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={product.name === "Centrifugal Monobloc" ? assets.CenMono : product.images[0]}
            alt={product.name}
            fill
            className={`object-cover w-full h-full transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100 translate-y-0'
            }`}
          />
        </div>

        {/* Product Info and Options Container - Merged with image */}
        <div className="w-full bg-white rounded-b-xl p-6 border-t border-gray-100 overflow-visible">
          {/* Product Info */}
          <div className="flex justify-center items-center mb-6">
            <p
              className="font-bold text-[18px] sm:text-xl text-center transition-all duration-300 hover:text-[#c31e5a] hover:scale-105 cursor-pointer text-gray-800"
            >
              {product.name}
            </p>
          </div>

          {/* Options Container */}
          <div className="flex justify-center items-center gap-6">
            {/* Add to Cart Button */}
            <div className="relative group">
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="flex items-center justify-center 
                          w-12 h-12 
                          text-gray-600 bg-gray-100
                          hover:text-white
                          hover:bg-[#c31e5a] 
                          rounded-full 
                          transition-all duration-300 transform 
                          shadow-md hover:shadow-lg hover:scale-110"
                title="Add to Cart"
              >
                <ShoppingCart size={20} />
              </button>
            </div>

            {/* Send Enquiry Button */}
            <div className="relative group">
              <button
                onClick={(e) => handleEnquiry(e, product)}
                className="flex items-center justify-center 
                          text-gray-600 bg-gray-100 
                          hover:text-white
                          hover:bg-[#f48638]
                          rounded-lg px-6 py-3 
                          transition-all duration-300 transform
                          shadow-md hover:shadow-lg hover:scale-105"
                title="Send Enquiry"
              >
                <Send size={18} />
                <span className="text-[15px] ml-2 font-medium">Send Enquiry</span>
              </button>
            </div>

            {/* View Details Button */}
            <div className="relative group">
              <button
                className="flex items-center justify-center 
                          w-12 h-12 
                          text-gray-600 bg-gray-100 
                          hover:text-white
                          hover:bg-[rgb(55,50,46)]  
                          rounded-full 
                          transition-all duration-300 transform
                          shadow-md hover:shadow-lg hover:scale-110"
                title="View Details"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </Link>

      <ModalPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={[
          {
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ]}
        totalPrice={product.price}
        totalQuantity={1}
        currency={currency}
        onSendWhatsApp={handleSendWhatsApp}
      />
    </>
  );
};

export default ProductCard;