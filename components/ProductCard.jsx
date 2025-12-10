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
        className="w-full h-full flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 group"
        whileHover={{ y: -6, scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href={`/product/${product.id}`} className="flex flex-col h-full">
          {/* Image Container */}
          <div
            className="relative w-full aspect-[4/3] bg-white overflow-hidden flex-shrink-0"
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
              className={`object-contain transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{ objectPosition: 'center' }}
              priority={false}
            />
            
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 bg-gradient-to-r from-[#c31e5a] to-[#f48638] text-white px-3 sm:px-3.5 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-sm sm:text-base md:text-lg font-bold shadow-xl z-20 pointer-events-none">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col flex-1 p-3 sm:p-4 md:p-5 min-w-0">
            {/* Product Name */}
            <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 mb-3 sm:mb-4 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-[#7C2A47] transition-colors duration-200 flex-shrink-0 leading-tight">
              {product.name}
            </h3>

            {/* Price Section */}
            <div className="flex items-baseline gap-3 sm:gap-3.5 mb-4 sm:mb-5 flex-shrink-0">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#7C2A47] whitespace-nowrap">
                {currency}{finalPrice.toLocaleString()}
              </span>
              {discount > 0 && originalPrice > finalPrice && (
                <span className="text-sm sm:text-base text-gray-500 line-through whitespace-nowrap">
                  {currency}{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Action Buttons - Send Enquiry on last row */}
            <div className="flex flex-col gap-2 sm:gap-2.5 mt-auto flex-shrink-0">
              {/* Secondary Buttons - Cart and View on first row */}
              <div className="flex gap-2 sm:gap-2.5 flex-shrink-0 w-full">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(e, product);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-100 hover:bg-[#c31e5a] text-gray-800 hover:text-white rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 touch-manipulation min-h-[40px] sm:min-h-[44px] md:min-h-[48px] font-semibold"
                  title="Add to Cart"
                >
                  <ShoppingCart size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline ml-1 sm:ml-1.5 text-sm sm:text-base font-semibold whitespace-nowrap">Cart</span>
                </button>

                <Link
                  href={`/product/${product.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-100 hover:bg-gray-900 text-gray-800 hover:text-white rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 touch-manipulation min-h-[40px] sm:min-h-[44px] md:min-h-[48px] font-semibold"
                  title="View Details"
                >
                  <ArrowRight size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline ml-1 sm:ml-1.5 text-sm sm:text-base font-semibold whitespace-nowrap">View</span>
                </Link>
              </div>

              {/* Primary Button - Send Enquiry (Full width on last row) */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEnquiry(e, product);
                }}
                className="w-full flex items-center justify-center gap-2 sm:gap-2.5 bg-gradient-to-r from-[#7C2A47] to-[#c31e5a] text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 hover:from-[#6a2340] hover:to-[#a01a47] transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 touch-manipulation whitespace-nowrap min-h-[44px] sm:min-h-[48px] md:min-h-[52px]"
              >
                <Send size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="hidden sm:inline truncate">Send Enquiry</span>
                <span className="sm:hidden truncate">Enquiry</span>
              </button>
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