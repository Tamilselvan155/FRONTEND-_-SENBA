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
        className="w-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 group flex flex-col h-full"
        whileHover={{ y: -6 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Container */}
        <Link href={`/product/${product.id}`} className="block">
          <div
            className="relative w-full aspect-[3/2] bg-gray-50 overflow-hidden"
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
              className={`object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={false}
            />
            
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-lg z-10">
                {discount}% OFF
              </div>
            )}
            
            {/* Best Seller Badge */}
            {product.bestseller && !discount && (
              <div className="absolute top-2 left-2 bg-[#7C2A47] text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-lg z-10">
                Best Seller
              </div>
            )}
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-2 sm:p-3 flex flex-col flex-1">
          {/* Product Name */}
          <Link href={`/product/${product.id}`} className="block mb-1">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-[#7C2A47] transition-colors duration-200 leading-tight">
              {product.name}
            </h3>
          </Link>
          
          {/* Subtitle/Description */}
          <p className="text-xs text-gray-500 mb-2 line-clamp-1 flex-shrink-0">
            {product.description || 'High-flow, stainless steel build'}
          </p>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-2 flex-shrink-0">
            <span className="text-lg sm:text-xl font-bold text-[#7C2A47]">
              {currency}{finalPrice.toLocaleString()}
            </span>
            {discount > 0 && originalPrice > finalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {currency}{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Actions Section */}
          <div className="mt-auto space-y-1.5">
            {/* Secondary Icon Buttons Row */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(e, product);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#7C2A47] hover:bg-[#6a2340] text-white rounded-lg px-2.5 py-1.5 transition-all duration-200 shadow-sm hover:shadow-md font-semibold text-xs sm:text-sm"
                title="Add to Cart"
              >
                <ShoppingCart size={15} />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEnquiry(e, product);
                }}
                className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-2 py-1.5 transition-all duration-200 shadow-sm hover:shadow-md"
                title="Send Enquiry"
              >
                <Send size={15} />
              </button>
            </div>

            {/* Primary CTA Button */}
            <Link
              href={`/product/${product.id}`}
              className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-[#7C2A47]/5 text-[#7C2A47] border-2 border-[#7C2A47] rounded-lg px-2.5 py-1.5 transition-all duration-200 font-semibold text-xs sm:text-sm group/btn"
            >
              <span>View Details</span>
              <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
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
