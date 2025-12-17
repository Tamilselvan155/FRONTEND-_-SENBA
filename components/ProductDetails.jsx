
'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import ModalPopup from './PopupModel';
import { assets } from '@/assets/assets';

const ProductDetails = ({ product }) => {
  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const productId = product.id || product._id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  const cart = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();

  const router = useRouter();
  
  // Safely handle images
  const productImages = product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [assets.product_img0]; // Use placeholder if no images
  
  const [mainImage, setMainImage] = useState(productImages[0] || assets.product_img0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Update mainImage when product images change
  useEffect(() => {
    if (productImages && productImages.length > 0) {
      setMainImage(productImages[0]);
    }
  }, [product.images]);

  // ✅ HP options and selected state
  const hpOptions = ["0.5 HP", "1 HP", "1.5 HP", "2.0 HP"];
  const [selectedHP, setSelectedHP] = useState(hpOptions[0]);

  // Safely calculate average rating
  const ratings = product.rating && Array.isArray(product.rating) ? product.rating : [];
  const averageRating = ratings.length > 0
    ? ratings.reduce((acc, item) => acc + (item.rating || 0), 0) / ratings.length
    : 0;

  // Calculate price and MRP based on selected HP
  const getPriceAndMrpForHP = (hpValue) => {
    if (!product) return { price: 0, mrp: 0, discount: 0 };

    let price = 0;
    let mrp = 0;
    let discount = 0;

    // Extract HP number from string (e.g., "0.5 HP" -> "0.5", "1 HP" -> "1")
    const hpNum = hpValue.replace(' HP', '').trim();

    // If product has variants, find the variant matching the selected HP
    if (product.hasVariants && product.brandVariants && Array.isArray(product.brandVariants) && product.brandVariants.length > 0) {
      // Find variant that matches the HP value
      const matchingVariant = product.brandVariants.find(variant => {
        if (variant.attributes && Array.isArray(variant.attributes)) {
          return variant.attributes.some(attr => {
            const attrValue = String(attr.attributeValue || attr.value || '').toLowerCase().trim();
            const attrName = String(attr.attributeName || attr.name || '').toLowerCase().trim();
            
            // Check if this is an HP attribute and matches
            const isHPAttribute = attrName.includes('hp') || attrName.includes('horsepower') || 
                                 attrName.includes('power') || attrName === '';
            
            if (isHPAttribute || attrName === '') {
              // Try multiple matching strategies
              return attrValue === hpNum.toLowerCase() ||
                     attrValue === hpValue.toLowerCase() ||
                     attrValue === hpValue.toLowerCase().replace(' ', '') ||
                     attrValue.includes(hpNum) ||
                     attrValue === `0.5` && hpNum === '0.5' ||
                     attrValue === `1` && hpNum === '1' ||
                     attrValue === `1.5` && hpNum === '1.5' ||
                     attrValue === `2` && hpNum === '2.0' ||
                     attrValue === `2.0` && hpNum === '2.0';
            }
            return false;
          });
        }
        return false;
      });

      if (matchingVariant) {
        // Use actual price from variant
        if (matchingVariant.price !== undefined && matchingVariant.price !== null) {
          price = Number(matchingVariant.price);
        }
        
        // Get discount from variant
        if (matchingVariant.discount !== undefined && matchingVariant.discount !== null) {
          discount = Number(matchingVariant.discount);
        }
        
        // Calculate MRP from discount if available
        if (discount > 0 && price > 0) {
          // MRP = Price / (1 - discount/100)
          mrp = Math.round(price / (1 - discount / 100));
        } else if (price > 0) {
          // If no discount, check if variant has MRP or use product.mrp
          if (matchingVariant.mrp && matchingVariant.mrp > price) {
            mrp = Number(matchingVariant.mrp);
          } else if (product.mrp && product.mrp > price) {
            mrp = Number(product.mrp);
          } else {
            // If no discount, MRP = price (no discount)
            mrp = price;
          }
        }
      } else {
        // If no matching variant found, use first variant as fallback
        const firstVariant = product.brandVariants[0];
        if (firstVariant && firstVariant.price !== undefined && firstVariant.price !== null) {
          price = Number(firstVariant.price);
          discount = Number(firstVariant.discount) || 0;
          if (discount > 0 && price > 0) {
            mrp = Math.round(price / (1 - discount / 100));
          } else {
            mrp = price;
          }
        }
      }
    }

    // If no variant found or product doesn't have variants, use base price
    if (price === 0) {
      price = Number(product.price) || 0;
      discount = Number(product.discount) || 0;
      
      // Calculate MRP from discount
      if (discount > 0 && price > 0) {
        // MRP = Price / (1 - discount/100)
        mrp = Math.round(price / (1 - discount / 100));
      } else if (product.mrp && product.mrp > price) {
        // Use MRP from product if available
        mrp = Number(product.mrp);
      } else if (price > 0) {
        // If no discount and no MRP, MRP = price (no discount)
        mrp = price;
      }
    }

    return { price, mrp, discount };
  };

  // Get current price and MRP based on selected HP - memoized to recalculate when product or selectedHP changes
  const { price: currentPrice, mrp: currentMrp } = useMemo(() => {
    return getPriceAndMrpForHP(selectedHP);
  }, [product, product?.hasVariants, product?.brandVariants, product?.price, product?.discount, product?.mrp, selectedHP]);

  // Handle HP selection change
  const handleHPChange = (hp) => {
    setSelectedHP(hp);
  };

  const addToCartHandler = () => {
    // Include selected HP option in cart data
    const { price: priceForSelectedHP } = getPriceAndMrpForHP(selectedHP);
    // Add quantity to cart
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({ 
        productId,
        selectedOption: selectedHP,
        price: priceForSelectedHP
      }));
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQty = prev + change;
      return newQty < 1 ? 1 : newQty;
    });
  };

  const handleSendWhatsApp = ({ userName, userMobile }) => {
    const quantity = cart[productId] || 1;
    const productLink = typeof window !== 'undefined' ? window.location.href : '';

    const { price: selectedPrice } = getPriceAndMrpForHP(selectedHP);
    let message = `Hi, I'm interested in booking an enquiry for the following product:
🛍️ *Product:* ${product.name || product.title || 'Product'}
⚙️ *HP Option:* ${selectedHP}
💰 *Price:* ${currency}${selectedPrice}
📦 *Quantity:* ${quantity}
🖼️ *Product Link:* ${productLink}`;

    if (userName && userMobile) {
      message += `\n🙋 *Name:* ${userName}\n📱 *Mobile:* ${userMobile}`;
    }

    message += `\nPlease let me know the next steps.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "9345795629";

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    setIsModalOpen(false);
  };

  // Get brand name
  const brandName = product.brand || product.category || 'BRAND';
  const itemCode = product.itemCode || product.sku || productId;

  // Stock status
  const inStock = product.inStock !== false && (product.stock === undefined || product.stock > 0);

  return (
    <>
     <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-6 sm:pb-8 overflow-x-hidden">
 
 {/* Images Section - Left Side */}
 <div className="w-full lg:w-[55%] flex flex-col gap-3 sm:gap-4 min-w-0 lg:h-fit">

  {/* Thumbnails */}
  {productImages.length > 1 && (
    <div className="flex flex-row gap-2 sm:gap-3 overflow-x-auto pb-2">
      {productImages.map((image, index) => (
        <div
          key={index}
          onClick={() => setMainImage(image)}
          className={`flex items-center justify-center rounded-lg cursor-pointer overflow-hidden border-2 transition-all flex-shrink-0
            w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
            ${
              mainImage === image
                ? 'border-[#7C2A47] shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
        >
          <Image
            src={image}
            alt={`${product.name || 'Product'} thumbnail ${index + 1}`}
            width={64}
            height={64}
            className="object-contain w-full h-full p-1"
            unoptimized
          />
        </div>
      ))}
    </div>
  )}

   {/* Main Image */}
   <div className="flex justify-center items-center bg-white rounded-lg border border-gray-200 p-2 sm:p-3 md:p-4 lg:h-[460px]">
     {mainImage ? (
       <Image
         src={mainImage}
         alt={product.name || 'Product'}
         width={420}
         height={420}
         className="
           object-contain w-full h-full
           max-h-[340px]
           sm:max-h-[380px]
           md:max-h-[420px]
           lg:max-h-full
         "
         unoptimized
       />
     ) : (
       <div className="flex justify-center items-center w-full h-full">
         <p className="text-gray-400 text-sm">No image available</p>
       </div>
     )}
   </div>

</div>

 {/* Product Details - Right Side */}
 <div className="w-full lg:w-[45%] flex flex-col min-w-0 lg:h-[460px] lg:overflow-y-auto">
 
   {/* Product Title */}
   <h1 className="text-base sm:text-lg md:text-xl lg:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 leading-tight">
     {product.name || product.title || 'Product'}
   </h1>

   {/* Brand and Item Code */}
   <div className="flex flex-col gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
     <span className="text-[#7C2A47] font-semibold text-[10px] sm:text-xs md:text-sm uppercase">
       {brandName}
     </span>
     <span className="text-gray-600 text-[10px] sm:text-[11px] md:text-xs break-words">
       Item Code: <span className="text-gray-800 font-medium">{itemCode}</span>
     </span>
   </div>

   {/* Reviews */}
   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3">
     <div className="flex items-center gap-1">
       <div className="flex items-center">
         {Array(5).fill('').map((_, index) => (
           <StarIcon
             key={index}
             size={12}
             className={`${
               averageRating > index
                 ? 'text-yellow-400 fill-yellow-400'
                 : 'text-gray-300'
             }`}
           />
         ))}
       </div>
       <p className="text-[10px] sm:text-[11px] text-gray-600 ml-0.5 sm:ml-1">
         {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
       </p>
     </div>
   </div>

   {/* Price */}
   <div className="mb-3 sm:mb-4">
     <p className="text-[10px] sm:text-[11px] text-gray-600 mb-0.5 sm:mb-1">Price:</p>
     <div className="flex items-baseline gap-2 flex-wrap">
       <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#7C2A47]">
         {currency}{currentPrice.toLocaleString()}
       </span>
       {currentMrp > currentPrice && (
         <span className="text-xs sm:text-sm md:text-base text-gray-400 line-through">
           {currency}{currentMrp.toLocaleString()}
         </span>
       )}
     </div>
   </div>

   {/* Stock Status */}
   <div className="mb-3 sm:mb-4">
     <p className="text-[10px] sm:text-[11px] text-gray-600 mb-0.5 sm:mb-1">Stock:</p>
     <div className="flex items-center gap-1.5 sm:gap-2">
       <span
         className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
           inStock ? 'bg-green-500' : 'bg-gray-400'
         }`}
       ></span>
       <span
         className={`text-[10px] sm:text-xs font-medium ${
           inStock ? 'text-green-600' : 'text-gray-500'
         }`}
       >
         {inStock ? 'In stock' : 'Sold out'}
       </span>
     </div>
   </div>

   {/* Quantity Selector */}
   <div className="mb-3 sm:mb-4">
     <p className="text-[10px] sm:text-[11px] text-gray-600 mb-1 sm:mb-1.5">
       Quantity:
     </p>
 
     {cart[productId] ? (
       <Counter productId={productId} />
     ) : (
       <div className="flex items-center border border-gray-300 rounded-lg w-fit overflow-hidden">
         <button
           className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
           onClick={() => handleQuantityChange(-1)}
           disabled={quantity <= 1}
         >
           -
         </button>
 
         <input
           type="number"
           value={quantity}
           onChange={(e) => {
             const val = parseInt(e.target.value) || 1;
             setQuantity(val < 1 ? 1 : val);
           }}
           className="w-10 sm:w-12 text-center border-x border-gray-300 py-1.5 sm:py-2 focus:outline-none text-xs sm:text-sm font-medium bg-white"
           min="1"
         />
 
         <button
           className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors text-xs sm:text-sm font-medium"
           onClick={() => handleQuantityChange(1)}
         >
           +
         </button>
       </div>
     )}
   </div>

   {/* HP Options */}
   {hpOptions.length > 0 && (
     <div className="mb-3 sm:mb-4">
       <p className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2">
         Available Options:
       </p>
       <div className="flex flex-wrap gap-1.5 sm:gap-2">
         {hpOptions.map((hp) => (
           <button
             key={hp}
             onClick={() => handleHPChange(hp)}
             className={`px-2 sm:px-2.5 py-1 sm:py-1.5 border-2 rounded-md text-[10px] sm:text-[11px] font-semibold transition-all
               ${
                 selectedHP === hp
                   ? 'bg-[#7C2A47] text-white border-[#7C2A47]'
                   : 'border-gray-300 text-gray-700 hover:bg-gray-50'
               }`}
           >
             {hp}
           </button>
         ))}
       </div>
     </div>
   )}

   {/* Discount Info */}
   {currentMrp > currentPrice && (
     <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600 mb-3 sm:mb-4">
       <TagIcon size={10} className="text-[#7C2A47]" />
       <p className="text-[#7C2A47] font-medium">
         Save {(((currentMrp - currentPrice) / currentMrp) * 100).toFixed(0)}%
         right now
       </p>
     </div>
   )}

   {/* Action Buttons */}
 <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
   <button
     onClick={() => !cart[productId] ? addToCartHandler() : router.push('/cart')}
     disabled={!inStock}
     className={`flex-1 px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all active:scale-95
       ${
         inStock
           ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
           : 'bg-gray-300 text-gray-500 cursor-not-allowed'
       }`}
   >
     {!inStock ? 'Sold out' : (!cart[productId] ? 'Add to Basket' : 'View Cart')}
   </button>

   <button
     onClick={() => setIsModalOpen(true)}
     className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-[#7C2A47] text-white hover:bg-[#6a243d] active:scale-95 transition-all shadow-md hover:shadow-lg"
   >
     Book Enquiry
   </button>
 </div>


</div>
</div>


      <ModalPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={[{
          name: `${product.name || product.title || 'Product'} (${selectedHP})`,
          price: currentPrice,
          quantity: cart[productId] || quantity
        }]}
        totalPrice={currentPrice * (cart[productId] || quantity)}
        totalQuantity={cart[productId] || quantity}
        currency={currency}
        onSendWhatsApp={handleSendWhatsApp}
      />
    </>
  );
};

export default ProductDetails;
