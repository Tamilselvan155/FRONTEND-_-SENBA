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
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
  
  // Calculate discount if applicable
  const discount = product.discount || 0;
  const originalPrice = product.mrp || product.price;
  const finalPrice = discount > 0 ? product.price : originalPrice;

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
      <motion.div
        className="w-full h-full flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href={`/product/${product.id}`} className="flex flex-col h-full">
          {/* Image Container */}
          <div
            className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-gray-50 overflow-hidden flex-shrink-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={
                product.name === "Centrifugal Monobloc" 
                  ? assets.CenMono 
                  : (product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0])
                    ? product.images[0]
                    : assets.product_img0
              }
              alt={product.name || 'Product'}
              fill
              className={`object-contain p-3 sm:p-4 transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-[#c31e5a] to-[#f48638] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col flex-1 p-3 sm:p-4 md:p-5 min-w-0">
            {/* Product Name */}
            <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-2 sm:mb-3 line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem] group-hover:text-[#7C2A47] transition-colors duration-200 flex-shrink-0">
              {product.name}
            </h3>

            {/* Price Section */}
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-shrink-0">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#7C2A47] whitespace-nowrap">
                {currency}{finalPrice.toLocaleString()}
              </span>
              {discount > 0 && originalPrice > finalPrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through whitespace-nowrap">
                  {currency}{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 mt-auto flex-shrink-0">
              {/* Primary Button - Send Enquiry (Full width on mobile) */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEnquiry(e, product);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#7C2A47] to-[#c31e5a] text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 hover:from-[#6a2340] hover:to-[#a01a47] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 touch-manipulation whitespace-nowrap min-w-0"
              >
                <Send size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden sm:inline truncate">Send Enquiry</span>
                <span className="sm:hidden truncate">Enquiry</span>
              </button>

              {/* Secondary Buttons - Icon only on mobile, with text on desktop */}
              <div className="flex gap-2 sm:gap-2.5 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(e, product);
                  }}
                  className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2.5 md:py-3 bg-gray-100 hover:bg-[#c31e5a] text-gray-700 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 touch-manipulation flex-shrink-0"
                  title="Add to Cart"
                >
                  <ShoppingCart size={16} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium whitespace-nowrap">Cart</span>
                </button>

                <Link
                  href={`/product/${product.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2.5 md:py-3 bg-gray-100 hover:bg-gray-800 text-gray-700 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 touch-manipulation flex-shrink-0"
                  title="View Details"
                >
                  <ArrowRight size={16} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium whitespace-nowrap">View</span>
                </Link>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

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