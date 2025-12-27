'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FolderHeart, ShoppingCart, Trash2, ShoppingBag, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { addToCart } from '@/lib/features/cart/cartSlice';
import { removeFromWishlist, clearWishlist } from '@/lib/features/wishlist/wishlistSlice';
import { fetchProductsAsync } from '@/lib/features/product/productSlice';

const CollectionsWishlistSection = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const products = useSelector((state) => state.product.list || state.product.products || []);
  const [wishlistArray, setWishlistArray] = useState([]);

  // Fetch products if not loaded
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProductsAsync());
    }
  }, [products, dispatch]);

  // Create wishlist array from product IDs
  useEffect(() => {
    if (products && Array.isArray(products) && products.length > 0 && wishlistItems) {
      const array = [];
      for (const [key] of Object.entries(wishlistItems)) {
        const normalizedKey = String(key);
        
        const product = products.find((p) => {
          const productId = p.id ? String(p.id) : null;
          const productIdAlt = p._id ? String(p._id) : null;
          return productId === normalizedKey || productIdAlt === normalizedKey;
        });
        
        if (product) array.push(product);
      }
      setWishlistArray(array);
    } else {
      setWishlistArray([]);
    }
  }, [wishlistItems, products]);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist({ productId }));
    toast.success('Removed from wishlist');
  };

  const handleAddToCartFromWishlist = async (productId) => {
    try {
      await dispatch(addToCart({ productId }));
      await dispatch(removeFromWishlist({ productId }));
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleClearWishlist = () => {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      dispatch(clearWishlist());
      toast.success('Wishlist cleared');
    }
  };

  if (wishlistArray.length === 0) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Collections & Wishlist</h2>
        </div>
        <div className="text-center py-12">
          <FolderHeart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Your wishlist is empty!</p>
          <p className="text-sm text-gray-500 mb-4">Start adding products to your wishlist to see them here</p>
          <button
            onClick={() => router.push('/shop')}
            className="px-4 py-2 bg-[#7C2A47] text-white text-sm font-medium rounded-lg hover:bg-[#6a2340] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Collections & Wishlist</h2>
        <button
          onClick={handleClearWishlist}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#7C2A47] hover:text-[#6a2340] transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Clear Wishlist
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-700">Product</th>
              <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-700">Unit Price</th>
              <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-700">Stock Status</th>
              <th className="text-left py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-700">Action</th>
              <th className="text-right py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {wishlistArray.map((item) => {
              const productId = item.id || item._id;
              const productData = item.originalProduct || item;
              const productName = item.name || item.title || productData.name || productData.title || 'Product';
              
              const productImages = item.images || productData.images || [];
              const productImage = productImages.length > 0 ? productImages[0] : null;
              
              // Calculate price - handle variants
              let basePrice = 0;
              let discount = 0;
              let originalPrice = 0;
              
              if (item.hasVariants && item.brandVariants && Array.isArray(item.brandVariants) && item.brandVariants.length > 0) {
                const variantPrice = item.brandVariants[0]?.price;
                if (variantPrice !== undefined && variantPrice !== null) {
                  basePrice = Number(variantPrice);
                }
                const variantDiscount = item.brandVariants[0]?.discount;
                if (variantDiscount !== undefined && variantDiscount !== null) {
                  discount = Number(variantDiscount);
                }
              }
              
              if (basePrice === 0) {
                basePrice = item.price !== undefined && item.price !== null ? Number(item.price) : 
                          (productData.price !== undefined && productData.price !== null ? Number(productData.price) : 0);
              }
              
              if (discount === 0) {
                discount = item.discount !== undefined ? item.discount : (productData.discount !== undefined ? productData.discount : 0);
              }
              
              if (discount > 0 && basePrice > 0) {
                originalPrice = Math.round(basePrice / (1 - discount / 100));
              } else if (item.mrp && item.mrp > basePrice) {
                originalPrice = Number(item.mrp);
              } else if (productData.mrp && productData.mrp > basePrice) {
                originalPrice = Number(productData.mrp);
              } else if (basePrice > 0) {
                originalPrice = basePrice;
              }
              
              const finalPrice = basePrice > 0 ? basePrice : originalPrice;
              
              const stock = item.stock !== undefined ? item.stock : (productData.stock !== undefined ? productData.stock : undefined);
              const inStock = item.inStock !== false && 
                             (item.inStock === true || 
                              (stock !== undefined && stock !== null && stock > 0));
              
              const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
              
              return (
                <tr key={productId} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-4">
                      {productImage ? (
                        <Image
                          src={productImage}
                          alt={productName}
                          width={60}
                          height={60}
                          className="h-14 w-14 object-cover rounded-lg"
                          unoptimized
                        />
                      ) : (
                        <div className="h-14 w-14 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <Link 
                        href={`/product/${productId}`}
                        className="font-medium text-gray-800 text-sm sm:text-base hover:text-[#7C2A47] transition-colors"
                      >
                        {productName}
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex flex-col">
                      {finalPrice > 0 ? (
                        <>
                          <span className="text-sm sm:text-base text-gray-700 font-medium">
                            {currency}{Number(finalPrice).toLocaleString()}
                          </span>
                          {discount > 0 && originalPrice > finalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              {currency}{Number(originalPrice).toLocaleString()}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm sm:text-base text-gray-500 italic">
                          Price on request
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-1">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          inStock ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <span className={`text-xs sm:text-sm font-medium ${
                        inStock ? "text-green-600" : "text-gray-500"
                      }`}>
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <button
                      onClick={() => handleAddToCartFromWishlist(productId)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-[#7C2A47] hover:text-white transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      onClick={() => handleRemoveFromWishlist(productId)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectionsWishlistSection;


