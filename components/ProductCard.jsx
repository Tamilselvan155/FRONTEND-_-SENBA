'use client';

import { ArrowRight, ShoppingCart, Send } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import ModalPopup from './PopupModel';
import { useCart } from '@/lib/hooks/useCart';
import toast from 'react-hot-toast';
import { assets } from '@/assets/assets';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
  
  // Handle product data - check originalProduct if available (from transformed products)
  const productData = product.originalProduct || product;
  
  // Calculate discount if applicable
  const discount = product.discount !== undefined ? product.discount : (productData.discount !== undefined ? productData.discount : 0);
  
  // Get price - prioritize product.price, then productData.price
  const basePrice = product.price !== undefined && product.price !== null ? Number(product.price) : 
                    (productData.price !== undefined && productData.price !== null ? Number(productData.price) : 0);
  
  // Get MRP - prioritize product.mrp, then productData.mrp, then calculate from discount
  let originalPrice = product.mrp !== undefined && product.mrp !== null ? Number(product.mrp) : 
                      (productData.mrp !== undefined && productData.mrp !== null ? Number(productData.mrp) : basePrice);
  
  // If no MRP but we have discount, calculate MRP from discount
  if (discount > 0 && basePrice > 0 && originalPrice === basePrice) {
    originalPrice = Math.round(basePrice / (1 - discount / 100));
  }
  
  // Final price is the discounted price if discount exists, otherwise the base price
  const finalPrice = discount > 0 && basePrice > 0 ? basePrice : (basePrice > 0 ? basePrice : originalPrice);

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
    // Try product.category first, then productData.category
    const cat = product.category || productData.category;
    if (cat) {
      if (typeof cat === 'string') return cat;
      if (typeof cat === 'object' && cat !== null) {
        return cat.englishName || 
               cat.name || 
               cat.title || 
               cat.slug || 
               '';
      }
    }
    
    // Try categoryId
    const catId = product.categoryId || productData.categoryId;
    if (catId) {
      if (typeof catId === 'string') return catId;
      if (typeof catId === 'object' && catId !== null) {
        return catId.englishName || 
               catId.name || 
               catId.title || 
               catId.slug || 
               '';
      }
    }
    
    // Try other possible fields
    return product.categoryName || 
           productData.categoryName ||
           product.category_name || 
           product.productCategory || 
           'PUMPS'; // Default fallback
  })();

  const brand =
    toText(product.brand) ||
    toText(productData.brand) ||
    toText(product.store?.name) ||
    toText(product.vendor) ||
    '';

  const ratingValue = (() => {
    const r = product.rating || productData.rating;
    if (typeof r === 'number') return r;
    if (Array.isArray(r) && r.length > 0) {
      const sum = r.reduce((acc, item) => acc + (Number(item?.rating) || 0), 0);
      return sum / r.length;
    }
    return null;
  })();

  const reviewCount = Array.isArray(product.rating || productData.rating) 
    ? (product.rating || productData.rating).length 
    : 0;

  // Get product name with fallbacks
  const productName = product.name || product.title || productData.name || productData.title || 'Product';
  const productId = product.id || product._id || productData.id || productData._id;
  
  // 🛒 Add to Cart
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    if (!productId) {
      toast.error('Product ID is missing');
      return;
    }
    try {
      // Get product price - use the product from props or productData
      const productPrice = product?.price || productData?.price || 0;
      await addToCart({ 
        productId: productId,
        price: productPrice
      });
      toast.success(`${productName} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleEnquiry = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleSendWhatsApp = ({ userName, userMobile }) => {
    const quantity = 1;
    const productLink = typeof window !== 'undefined' && productId 
      ? `${window.location.origin}/product/${productId}` 
      : typeof window !== 'undefined' ? window.location.href : '';

    let message = `
Hi, I'm interested in booking an enquiry for the following product:
 *Product:* ${productName}
 *Price:* ${currency}${finalPrice}
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

  // Get product images with fallbacks
  const productImages = product.images || productData.images || [];
  const productImage = productImages.length > 0 
    ? productImages[0] 
    : (productData.images && productData.images.length > 0 
        ? productData.images[0] 
        : assets.product_img0);
  
  // Check if it's the special Centrifugal Monobloc product
  const isCentrifugalMonobloc = productName === "Centrifugal Monobloc" || 
                                 productName === "Centrifugal Monobloc Pump";

  if (!productId) {
    console.warn('ProductCard: Missing product ID', product);
  }

  return (
    <>
      <div className="w-full bg-white border border-gray-200 overflow-hidden flex flex-col h-full rounded-lg transition-shadow hover:shadow-lg">
  {/* Image */}
  <Link href={`/product/${productId || '#'}`} className="block">
    <div className="relative w-full aspect-[4/3] bg-white">
      <Image
        src={isCentrifugalMonobloc ? assets.CenMono : productImage}
        alt={productName}
        fill
        className="object-contain p-3 sm:p-4"
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 260px"
        unoptimized
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
    {/* Product Name */}
    <Link href={`/product/${productId || '#'}`}>
      <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 sm:line-clamp-3">
        {productName}
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

    {/* Category + Brand (Below Price) */}
    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-gray-500 uppercase tracking-wide">
      <span className="bg-gray-100 px-2 py-0.5 rounded-full">
        {category || "Pumps"}
      </span>

      {brand && brand.toLowerCase() !== category?.toLowerCase() && (
        <span className="text-gray-400">{brand}</span>
      )}
    </div>

    {/* Rating */}
    <div className="mt-2 flex items-center gap-2 text-xs">
      {ratingValue ? (
        <>
          <span className="text-[#7C2A47]">★★★★★</span>
          <span className="text-gray-500">
            {reviewCount > 0 ? `${reviewCount} reviews` : "No reviews"}
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
      {(() => {
        // Determine stock status: check inStock first, then stock number from both product and productData
        const stock = product.stock !== undefined ? product.stock : (productData.stock !== undefined ? productData.stock : undefined);
        const inStock = product.inStock !== undefined ? product.inStock : (productData.inStock !== undefined ? productData.inStock : undefined);
        
        const isInStock = inStock !== false && 
                         (inStock === true || 
                          (stock !== undefined && stock !== null && stock > 0));
        
        return (
          <>
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isInStock ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span
              className={`font-medium ${
                isInStock ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isInStock ? "In stock" : "Out of stock"}
            </span>
          </>
        );
      })()}
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
            name: productName,
            price: finalPrice,
            quantity: 1,
          },
        ]}
        totalPrice={finalPrice}
        totalQuantity={1}
        currency={currency}
        onSendWhatsApp={handleSendWhatsApp}
      />
    </>
  );
  
};

export default ProductCard;
