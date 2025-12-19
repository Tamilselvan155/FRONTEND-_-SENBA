
'use client'

import { useCart } from "@/lib/hooks/useCart";
import { StarIcon, TagIcon, Truck, Shield, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useSelector } from "react-redux";
import ModalPopup from './PopupModel';
import { assets } from '@/assets/assets';

const ProductDetails = ({ product }) => {
  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const productId = product.id || product._id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  const cart = useSelector(state => state.cart.cartItems);
  const { addToCart } = useCart();

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

  // Get variant-specific details (Model, Pipe size, Head, Discharge) based on selected HP
  const getVariantDetails = (hpValue) => {
    if (!product || !product.hasVariants || !product.brandVariants || !Array.isArray(product.brandVariants)) {
      return { model: null, pipeSize: null, head: null, discharge: null };
    }

    const hpNum = hpValue.replace(' HP', '').trim();
    
    // Find variant matching the selected HP
    const matchingVariant = product.brandVariants.find(variant => {
      if (variant.attributes && Array.isArray(variant.attributes)) {
        return variant.attributes.some(attr => {
          const attrValue = String(attr.attributeValue || attr.value || '').toLowerCase().trim();
          const attrName = String(attr.attributeName || attr.name || '').toLowerCase().trim();
          
          const isHPAttribute = attrName.includes('hp') || attrName.includes('horsepower') || 
                               attrName.includes('power') || attrName === '';
          
          if (isHPAttribute || attrName === '') {
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

    if (!matchingVariant || !matchingVariant.attributes || !Array.isArray(matchingVariant.attributes)) {
      return { model: null, pipeSize: null, head: null, discharge: null };
    }

    // Helper function to safely convert value to string
    const getValueAsString = (value) => {
      if (value === null || value === undefined) return '';
      
      // If it's already a string, return it
      if (typeof value === 'string') return value.trim();
      
      // If it's a number, convert to string
      if (typeof value === 'number') return String(value);
      
      // If it's an object, try to extract meaningful value
      if (typeof value === 'object') {
        // Check if it has a 'value' property
        if (value.value !== undefined) {
          return getValueAsString(value.value);
        }
        // Check if it has a 'title' property
        if (value.title !== undefined) {
          return getValueAsString(value.title);
        }
        // Check if it has a 'name' property
        if (value.name !== undefined) {
          return getValueAsString(value.name);
        }
        // If it's an array, join the values
        if (Array.isArray(value)) {
          return value.map(v => getValueAsString(v)).filter(v => v).join(', ');
        }
        // Try to stringify if it's a simple object
        try {
          const str = JSON.stringify(value);
          // If the stringified version is too long or looks like an object, try to extract values
          if (str.length > 100 || str.startsWith('{')) {
            const values = Object.values(value).filter(v => v !== null && v !== undefined);
            if (values.length > 0) {
              return values.map(v => getValueAsString(v)).filter(v => v).join(', ');
            }
          }
          return str;
        } catch (e) {
          return '';
        }
      }
      
      return String(value).trim();
    };

    // Extract Model, Pipe size, Head, and Discharge from variant attributes
    let model = null;
    let pipeSize = null;
    let head = null;
    let discharge = null;

    matchingVariant.attributes.forEach(attr => {
      const attrName = String(attr.attributeName || attr.name || '').toLowerCase().trim();
      
      // Try multiple sources for the value, including populated objects
      let rawValue = attr.attributeValue || attr.value;
      
      // If attributeValueId is populated (object), extract its value
      if (!rawValue && attr.attributeValueId) {
        if (typeof attr.attributeValueId === 'object' && attr.attributeValueId !== null) {
          rawValue = attr.attributeValueId.value || attr.attributeValueId.title || attr.attributeValueId.name || attr.attributeValueId;
        } else {
          rawValue = attr.attributeValueId;
        }
      }
      
      // Fallback to valueId
      if (!rawValue && attr.valueId) {
        rawValue = attr.valueId;
      }
      
      const attrValue = getValueAsString(rawValue);

      if (!attrValue || attrValue === '') return;

      // Check for Model
      if (attrName.includes('model') && !model) {
        model = attrValue;
      }
      // Check for Pipe size
      else if ((attrName.includes('pipe') && attrName.includes('size')) || attrName.includes('pipesize') || attrName === 'pipe size') {
        pipeSize = attrValue;
      }
      // Check for Head
      else if (attrName.includes('head') && !attrName.includes('discharge')) {
        head = attrValue;
      }
      // Check for Discharge
      else if (attrName.includes('discharge') || attrName.includes('flow')) {
        discharge = attrValue;
      }
    });

    // Also check variant specifications if attributes don't have the values
    if (matchingVariant.specifications) {
      const specs = matchingVariant.specifications;
      let specsObj = {};

      if (Array.isArray(specs)) {
        specs.forEach(spec => {
          if (typeof spec === 'object') {
            Object.assign(specsObj, spec);
          }
        });
      } else if (typeof specs === 'object') {
        specsObj = specs;
      }

      // Extract from specifications if not found in attributes
      Object.entries(specsObj).forEach(([key, value]) => {
        const keyLower = key.toLowerCase();
        const valueStr = getValueAsString(value);
        
        if (!valueStr || valueStr === '') return;

        if (keyLower.includes('model') && !model) {
          model = valueStr;
        } else if ((keyLower.includes('pipe') && keyLower.includes('size')) || keyLower.includes('pipesize')) {
          pipeSize = valueStr;
        } else if (keyLower.includes('head') && !keyLower.includes('discharge')) {
          head = valueStr;
        } else if (keyLower.includes('discharge') || keyLower.includes('flow')) {
          discharge = valueStr;
        }
      });
    }

    return { model, pipeSize, head, discharge };
  };

  // Get variant details for selected HP - memoized
  const variantDetails = useMemo(() => {
    return getVariantDetails(selectedHP);
  }, [product, product?.hasVariants, product?.brandVariants, selectedHP]);

  // Handle HP selection change
  const handleHPChange = (hp) => {
    setSelectedHP(hp);
  };

  const addToCartHandler = async () => {
    // Include selected HP option in cart data
    const { price: priceForSelectedHP } = getPriceAndMrpForHP(selectedHP);
    // Add quantity to cart
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart({ 
          productId,
          selectedOption: selectedHP,
          price: priceForSelectedHP
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
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
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-6 sm:pb-8 overflow-x-hidden items-start">
 
 {/* Column 1: Images Section */}
 <div className="w-full lg:col-span-1 flex flex-col gap-3 sm:gap-4 min-w-0 lg:h-full">

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
   <div className="flex justify-center items-center bg-white rounded-lg border border-gray-200 p-2 sm:p-3 md:p-4 flex-1 min-h-[400px] lg:min-h-[500px]">
     {mainImage ? (
       <Image
         src={mainImage}
         alt={product.name || 'Product'}
         width={420}
         height={420}
         className="object-contain w-full h-full max-h-full"
         unoptimized
       />
     ) : (
       <div className="flex justify-center items-center w-full h-full min-h-[300px]">
         <p className="text-gray-400 text-sm">No image available</p>
       </div>
     )}
   </div>

</div>

 {/* Column 2: Product Details (Price, Stock, Quantity, HP Options, Buttons) */}
 <div className="w-full lg:col-span-1 flex flex-col min-w-0 justify-between lg:h-full">
 
   {/* Product Title */}
   <h1 className="text-base sm:text-lg md:text-xl lg:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 leading-tight">
     {product.name || product.title || 'Product'}
   </h1>

   {/* Brand and Model */}
   <div className="flex flex-col gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
     <span className="text-[#7C2A47] font-semibold text-xs uppercase">
       {brandName}
     </span>
     {variantDetails.model && (
       <span className="text-gray-600 text-xs break-words">
         Model: <span className="text-gray-800 font-medium">{variantDetails.model}</span>
       </span>
     )}
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
       <p className="text-xs text-gray-600 ml-0.5 sm:ml-1">
         {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
       </p>
     </div>
   </div>

   {/* Price */}
   <div className="mb-3 sm:mb-4">
     <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">Price:</p>
     <div className="flex items-baseline gap-2 flex-wrap">
       <span className="text-lg font-bold text-[#7C2A47]">
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
         className={`text-xs font-medium ${
           inStock ? 'text-green-600' : 'text-gray-500'
         }`}
       >
         {inStock ? 'In stock' : 'Sold out'}
       </span>
     </div>
   </div>

   {/* Quantity Selector */}
   <div className="mb-3 sm:mb-4">
     <p className="text-xs text-gray-600 mb-1 sm:mb-1.5">
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
       <p className="text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2">
         Available Options:
       </p>
       <div className="flex flex-wrap gap-1.5 sm:gap-2">
         {hpOptions.map((hp) => (
           <button
             key={hp}
             onClick={() => handleHPChange(hp)}
             className={`px-2 sm:px-2.5 py-1 sm:py-1.5 border-2 rounded-md text-xs font-semibold transition-all
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
     <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-600 mb-3 sm:mb-4">
       <TagIcon size={10} className="text-[#7C2A47]" />
       <p className="text-[#7C2A47] font-medium">
         Save {(((currentMrp - currentPrice) / currentMrp) * 100).toFixed(0)}%
         right now
       </p>
     </div>
   )}

   {/* Benefits */}
   <div className="mb-4 sm:mb-5">
     <p className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-2 sm:mb-3">Benefits</p>
     <div className="space-y-2 sm:space-y-2.5">
       <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-700">
         <Truck size={14} className="text-[#7C2A47] flex-shrink-0" />
         <span>Free shipping worldwide</span>
       </div>
       <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-700">
         <Shield size={14} className="text-[#7C2A47] flex-shrink-0" />
         <span>100% Secured Payment</span>
       </div>
       <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-700">
         <Award size={14} className="text-[#7C2A47] flex-shrink-0" />
         <span>Trusted by top brands</span>
       </div>
     </div>
   </div>

   {/* Action Buttons - Fixed at bottom */}
   <div className="mt-auto pt-4 sm:pt-6">
     <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
       <button
         onClick={() => !cart[productId] ? addToCartHandler() : router.push('/cart')}
         className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold rounded-lg bg-[#7C2A47] text-white hover:bg-[#6a243d] shadow-md hover:shadow-lg transition-all active:scale-95"
       >
         {!cart[productId] ? 'Add to Cart' : 'View Cart'}
       </button>

       <button
         onClick={() => setIsModalOpen(true)}
         className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold rounded-lg bg-[#7C2A47] text-white hover:bg-[#6a243d] active:scale-95 transition-all shadow-md hover:shadow-lg"
       >
         Book Enquiry
       </button>
     </div>
   </div>
</div>

 {/* Column 3: Specifications Section */}
 <div className="w-full lg:col-span-1 flex flex-col min-w-0 lg:sticky lg:top-6 lg:self-start lg:h-fit">
   {(variantDetails.pipeSize || variantDetails.head || variantDetails.discharge) && (
     <div className="p-3 sm:p-4 rounded-lg border border-gray-200 bg-white shadow-sm w-full">
       <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
         Specifications for {selectedHP}
       </h3>
       <div className="space-y-3 sm:space-y-3">
         {/* Pipe Size */}
         {variantDetails.pipeSize && (
           <div className="pb-2 border-b border-gray-100 last:border-b-0">
             <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Pipe Size</p>
             <p className="text-xs sm:text-sm font-semibold text-gray-900">{variantDetails.pipeSize}</p>
           </div>
         )}
         
         {/* Head & Discharge as paired values */}
         {(variantDetails.head || variantDetails.discharge) && (
           <div>
             <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
               Head (meters) & Discharge (LPM)
             </p>
             <div className="space-y-1.5 sm:space-y-1.5">
               {(() => {
                 // Parse Head values (could be comma-separated string or array)
                 let headValues = [];
                 if (variantDetails.head) {
                   if (Array.isArray(variantDetails.head)) {
                     headValues = variantDetails.head.map(v => String(v).trim()).filter(v => v);
                   } else {
                     headValues = String(variantDetails.head).split(',').map(v => v.trim()).filter(v => v);
                   }
                 }
                 
                 // Parse Discharge values (could be comma-separated string or array)
                 let dischargeValues = [];
                 if (variantDetails.discharge) {
                   if (Array.isArray(variantDetails.discharge)) {
                     dischargeValues = variantDetails.discharge.map(v => String(v).trim()).filter(v => v);
                   } else {
                     dischargeValues = String(variantDetails.discharge).split(',').map(v => v.trim()).filter(v => v);
                   }
                 }
                 
                 // Pair them up by index
                 const maxLength = Math.max(headValues.length, dischargeValues.length);
                 const pairs = [];
                 
                 for (let i = 0; i < maxLength; i++) {
                   const head = headValues[i] || '';
                   const discharge = dischargeValues[i] || '';
                   
                   if (head || discharge) {
                     pairs.push({ head, discharge });
                   }
                 }
                 
                 // If no pairs could be created, show original format
                 if (pairs.length === 0) {
                   return (
                     <div className="grid grid-cols-2 gap-2">
                       {variantDetails.head && (
                         <div>
                           <p className="text-xs text-gray-600 mb-1">Head:</p>
                           <p className="text-xs sm:text-sm font-medium text-gray-900">{variantDetails.head}</p>
                         </div>
                       )}
                       {variantDetails.discharge && (
                         <div>
                           <p className="text-[10px] sm:text-xs text-gray-600 mb-1">Discharge:</p>
                           <p className="text-xs sm:text-sm font-medium text-gray-900">{variantDetails.discharge}</p>
                         </div>
                       )}
                     </div>
                   );
                 }
                 
                 // Display pairs
                 return pairs.map((pair, index) => (
                   <div key={index} className="flex items-center py-1.5 px-2.5 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors">
                     <span className="text-xs sm:text-sm font-semibold text-gray-900">
                       {pair.head && pair.discharge ? (
                         <span>{pair.head}H & {pair.discharge}D</span>
                       ) : pair.head ? (
                         <span>{pair.head}H</span>
                       ) : pair.discharge ? (
                         <span>{pair.discharge}D</span>
                       ) : null}
                     </span>
                   </div>
                 ));
               })()}
             </div>
           </div>
         )}
       </div>
     </div>
   )}
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
