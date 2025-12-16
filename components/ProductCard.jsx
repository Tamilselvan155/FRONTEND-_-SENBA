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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
  
  // Calculate discount if applicable
  const discount = product.discount || 0;
  const originalPrice = product.mrp || product.price;
  const finalPrice = discount > 0 ? product.price : originalPrice;

  const toText = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'object') {
      return (
        val.englishName ||
        val.name ||
        val.title ||
        val.slug ||
        ''
      );
    }
    return '';
  };

  // Extract category with extensive checking
  const category = (() => {
    // Try multiple possible category fields
    if (product.category) {
      if (typeof product.category === 'string') return product.category;
      if (typeof product.category === 'object' && product.category !== null) {
        return product.category.englishName || 
               product.category.name || 
               product.category.title || 
               product.category.slug || 
               '';
      }
    }
    
    if (product.categoryId) {
      if (typeof product.categoryId === 'string') return product.categoryId;
      if (typeof product.categoryId === 'object' && product.categoryId !== null) {
        return product.categoryId.englishName || 
               product.categoryId.name || 
               product.categoryId.title || 
               product.categoryId.slug || 
               '';
      }
    }
    
    // Try other possible fields
    return product.categoryName || 
           product.category_name || 
           product.productCategory || 
           'PUMPS'; // Default fallback
  })();

  const brand =
    toText(product.brand) ||
    toText(product.store?.name) ||
    toText(product.vendor) ||
    '';

  const ratingValue = (() => {
    const r = product.rating;
    if (typeof r === 'number') return r;
    if (Array.isArray(r) && r.length > 0) {
      const sum = r.reduce((acc, item) => acc + (Number(item?.rating) || 0), 0);
      return sum / r.length;
    }
    return null;
  })();

  const reviewCount = Array.isArray(product.rating) ? product.rating.length : 0;

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
      <div className="w-full bg-white border border-gray-200 overflow-hidden flex flex-col h-full rounded-lg transition-shadow hover:shadow-lg">
        {/* Image */}
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative w-full aspect-[4/3] bg-white">
            <Image
              src={
                product.name === "Centrifugal Monobloc"
                  ? assets.CenMono
                  : (product.images && product.images[0])
                    ? product.images[0]
                    : assets.product_img0
              }
              alt={product.name || 'Product'}
              fill
              className="object-contain p-3 sm:p-4"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 260px"
            />
  
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-[#7C2A47] text-white text-[10px] sm:text-[11px] font-semibold px-2 py-1 rounded">
                Save {discount}%
              </div>
            )}
          </div>
        </Link>
  
        {/* Content */}
        <div className="px-3 sm:px-4 pt-3 pb-4 flex flex-col flex-1">
          {/* Category Badge - Always show with fallback */}
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold text-white bg-[#7C2A47] px-2 py-1 rounded uppercase tracking-wide">
              {category || 'PUMPS'}
            </span>
          </div>

          {/* Brand (if different from category) */}
          {brand && brand.toLowerCase() !== category?.toLowerCase() && (
            <div className="text-[10px] sm:text-[11px] tracking-wide text-gray-500 uppercase mb-1">
              {brand}
            </div>
          )}
  
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 sm:line-clamp-3 min-h-[2.75rem] sm:min-h-[3.75rem]">
              {product.name}
            </h3>
          </Link>
  
          {/* Price */}
          <div className="mt-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-[#7C2A47]">
                {currency}{Number(finalPrice || 0).toLocaleString()}
              </span>
  
              {discount > 0 && originalPrice > finalPrice && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  {currency}{Number(originalPrice || 0).toLocaleString()}
                </span>
              )}
            </div>
          </div>
  
          {/* Rating */}
          <div className="mt-2 flex items-center gap-2 text-xs">
            {ratingValue ? (
              <>
                <span className="text-[#7C2A47]">★★★★★</span>
                <span className="text-gray-500">
                  {reviewCount > 0 ? `${reviewCount} reviews` : 'No reviews'}
                </span>
              </>
            ) : (
              <>
                <span className="text-gray-300">★★★★★</span>
                <span className="text-gray-500">No reviews</span>
              </>
            )}
          </div>
  
          {/* Stock */}
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                product.inStock === false ? 'bg-gray-400' : 'bg-[#7C2A47]'
              }`}
            />
            <span
              className={`font-medium ${
                product.inStock === false ? 'text-gray-500' : 'text-[#7C2A47]'
              }`}
            >
              {product.inStock === false ? 'Out of stock' : 'In stock'}
            </span>
          </div>
  
          {/* Actions */}
          <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className="
                flex-1 flex items-center justify-center gap-2
                bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A]
                text-white font-semibold text-sm
                py-2.5 sm:py-3 rounded-lg
                shadow-md
                transition-all duration-300
                hover:shadow-lg hover:-translate-y-[1px]
                active:scale-[0.98]
              "
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
  
            <button
              onClick={(e) => handleEnquiry(e)}
              className="
                flex-1 flex items-center justify-center gap-2
                border border-[#7C2A47]/30
                text-[#7C2A47] font-medium text-sm
                py-2.5 sm:py-3 rounded-lg
                transition-all duration-300
                hover:bg-[#7C2A47]/5
                active:scale-[0.98]
              "
            >
              <Send size={16} />
              Enquiry
            </button>
          </div>
        </div>
      </div>
  
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
