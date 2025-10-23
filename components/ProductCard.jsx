'use client';

import { ArrowRight, ShoppingCart, Send } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import ModalPopup from './PopupModel';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/features/cart/cartSlice';
import toast from 'react-hot-toast';

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
        className="w-full max-w-[95vw] mx-auto flex flex-col items-center rounded-lg overflow-hidden sm:max-w-[348px] md:max-w-[348px] lg:max-w-[284px]"
      >
        {/* Image Container */}
        <div
          className="
            relative w-[84%] 
            h-[430px] 
            sm:h-[340px] sm:w-[255px]   /* 👈 Tablet view 348x380 */
            md:h-[360px] md:w-[270px]   /* 👈 Consistent for md range */
            lg:h-[380px] lg:w-[285px]   /* 👈 Desktop view */
            rounded-lg overflow-hidden 
            hover:-translate-y-5 
            transition-transform duration-300
          "
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover w-full h-full transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100 translate-y-0'
            }`}
          />
        </div>

        {/* Product Info */}
        <div className="w-full flex justify-center items-start gap-2 mt-3 text-sm text-slate-800 px-2 sm:px-0">
          <div className="flex flex-col">
            <p
              className="font-medium text-[17px] sm:text-lg truncate w-[200px] sm:w-[250px] text-center transition-all duration-300 hover:text-[#c31e5a] hover:scale-105 cursor-pointer"
            >
              {product.name}
            </p>
          </div>
        </div>

        {/* Icon Buttons */}
        <div className="flex flex-nowrap gap-7 sm:gap-4 mt-3 justify-between items-center">
          <div className="relative group">
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className="flex items-center justify-center 
                        w-10 h-10 sm:w-11 sm:h-11 
                        text-black bg-gray-200
                        hover:text-white
                        hover:bg-[#c31e5a] 
                        rounded-full 
                        transition-all duration-300 transform "
            >
              <ShoppingCart size={18} />
            </button>
          </div>

          <div className="relative group">
            <button
              onClick={(e) => handleEnquiry(e, product)}
              className="flex items-center justify-center 
                        text-black bg-gray-200 
                        hover:text-white
                        hover:bg-[#f48638]
                        rounded-lg px-5 py-3 sm:px-0 sm:py-0 sm:w-11 sm:h-11 sm:rounded-full  
                        transition-all duration-300 transform"
            >
              <Send size={18} />
              <span className="text-[15px] sm:hidden ml-2">Send Enquiry</span>
            </button>
          </div>

          <div className="relative group">
            <button
              className="flex items-center justify-center 
                        w-10 h-10 sm:w-11 sm:h-11 
                        text-black bg-gray-200 
                        hover:text-white
                        hover:bg-[rgb(55,50,46)]  
                        border border-gray-300 
                        rounded-full 
                        transition-all duration-300 transform "
            >
              <ArrowRight size={18} />
            </button>
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