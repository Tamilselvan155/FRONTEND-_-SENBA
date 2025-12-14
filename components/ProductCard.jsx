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

  const brand =
    toText(product.brand) ||
    toText(product.store?.name) ||
    toText(product.vendor) ||
    toText(product.category) ||
    toText(product.categoryId) ||
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
      <div className="w-full bg-white border border-gray-200 overflow-hidden flex flex-col h-full">
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative w-full aspect-[4/3] bg-white">
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
              className="object-contain p-4"
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 35vw, 260px"
              priority={false}
            />

            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-[#7C2A47] text-white text-[11px] font-semibold px-2 py-1">
                Save {discount}%
              </div>
            )}
          </div>
        </Link>

        <div className="px-4 pt-3 pb-4 flex flex-col flex-1">
          {brand ? (
            <div className="text-[11px] tracking-wide text-gray-500 uppercase mb-1">
              {brand}
            </div>
          ) : null}

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-3 min-h-[3.75rem]">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#7C2A47]">
                {currency}{Number(finalPrice || 0).toLocaleString()}
              </span>
              {discount > 0 && originalPrice > finalPrice ? (
                <span className="text-sm text-gray-400 line-through">
                  {currency}{Number(originalPrice || 0).toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
            {ratingValue ? (
              <>
                <span className="text-[#F4B400]">★★★★★</span>
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

          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className={`inline-block w-2 h-2 rounded-full ${product.inStock === false ? 'bg-gray-400' : 'bg-green-600'}`} />
            <span className={`${product.inStock === false ? 'text-gray-500' : 'text-green-700'} font-medium`}>
              {product.inStock === false ? 'Out of stock' : 'In stock'}
            </span>
          </div>

          <div className="mt-auto pt-4 flex gap-3">
  {/* Add to Cart – Primary */}
  <button
    onClick={(e) => handleAddToCart(e, product)}
    className="
      flex-1 flex items-center justify-center gap-2
      bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A]
      text-white font-semibold text-sm
      py-3 rounded-lg
      shadow-md
      transition-all duration-300
      hover:shadow-lg hover:-translate-y-[1px]
      active:scale-[0.98]
      focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/40
    "
  >
    <ShoppingCart size={16} />
    Add to Cart
  </button>

  {/* Enquiry – Secondary */}
  <button
    onClick={(e) => handleEnquiry(e)}
    className="
      flex-1 flex items-center justify-center gap-2
      border border-gray-300
      bg-white text-gray-700 font-medium text-sm
      py-3 rounded-lg
      transition-all duration-300
      hover:bg-gray-100 hover:border-gray-400
      active:scale-[0.98]
      focus:outline-none focus:ring-2 focus:ring-gray-300
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
