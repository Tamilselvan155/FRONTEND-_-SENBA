'use client';

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ShopByCategory = () => {
  const rawProducts = useSelector((state) => state.product.list || state.product.products || []);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Transform products to ensure they have correct structure
  const transformProduct = (product) => {
    if (!product) return null;

    // Get category name - handle multiple formats
    let categoryName = '';
    if (product.categoryId) {
      if (typeof product.categoryId === 'object' && product.categoryId !== null) {
        // If categoryId has a populated parentId, use the parent's title (e.g., "PUMP")
        if (product.categoryId.parentId && typeof product.categoryId.parentId === 'object' && product.categoryId.parentId.title) {
          categoryName = product.categoryId.parentId.title;
        } 
        // If categoryId itself is a parent category (no parentId or isParent is true), use its own title
        else if (product.categoryId.isParent || !product.categoryId.parentId) {
          categoryName = product.categoryId.title || '';
        } 
        // Fallback to categoryId title
        else {
          categoryName = product.categoryId.title || '';
        }
      }
    }
    
    // Fallback to category field if categoryId didn't provide a name
    if (!categoryName && product.category) {
      if (typeof product.category === 'string') {
        categoryName = product.category;
      } else if (typeof product.category === 'object' && product.category !== null) {
        categoryName = product.category.title || product.category.name || '';
      }
    }

    // Handle price - check if product has variants
    let price = 0;
    if (product.hasVariants && product.brandVariants && Array.isArray(product.brandVariants) && product.brandVariants.length > 0) {
      // If product has variants, get price from first variant
      const variantPrice = product.brandVariants[0]?.price;
      if (variantPrice !== undefined && variantPrice !== null) {
        price = Number(variantPrice);
      }
    }
    
    // If price is still 0, try root level price
    if (price === 0 && product.price !== undefined && product.price !== null) {
      price = Number(product.price);
    }

    // Calculate MRP from discount if available
    let mrp = price;
    if (product.discount && product.discount > 0 && price > 0) {
      // MRP = Price / (1 - discount/100)
      mrp = Math.round(price / (1 - product.discount / 100));
    } else if (product.mrp && product.mrp > price) {
      mrp = Number(product.mrp);
    }

    // Handle images
    let productImages = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      productImages = product.images
        .filter(img => img && img.trim() !== '')
        .map(img => {
          if (img.startsWith('http')) return img;
          return img.startsWith('/uploads/') ? `${baseUrl}${img}` : `${baseUrl}/uploads/${img}`;
        });
    }

    return {
      ...product,
      id: product.id || product._id,
      _id: product._id || product.id,
      name: product.title || product.name || 'Untitled Product',
      title: product.title || product.name || 'Untitled Product',
      price: price,
      mrp: mrp,
      discount: product.discount || 0,
      category: categoryName,
      images: productImages.length > 0 ? productImages : product.images || [],
      stock: Number(product.stock) || 0,
      inStock: (product.stock !== undefined && product.stock !== null) ? product.stock > 0 : true,
      rating: Array.isArray(product.rating) ? product.rating : [],
      originalProduct: product, // Store original for reference
    };
  };

  // Transform all products
  const products = useMemo(() => {
    if (!rawProducts || !Array.isArray(rawProducts)) return [];
    return rawProducts
      .map(transformProduct)
      .filter(product => product !== null);
  }, [rawProducts]);

  // Define categories in display order
  const categories = [
    { 
      name: 'ELECTRIC MOTOR', 
      slug: 'Electric Motor', 
      keys: ['electricmotor', 'electric motor', 'electricmotor', 'ElectricMotor', 'ELECTRIC MOTOR', 'electric-motor'] 
    },
    { 
      name: 'ENGINE', 
      slug: 'Engine', 
      keys: ['engine', 'Engine', 'ENGINE', 'engines'] 
    },
    { 
      name: 'GENERATOR', 
      slug: 'Generator', 
      keys: ['generator', 'Generator', 'GENERATOR', 'generators'] 
    },
    { 
      name: 'AIR COMPRESSOR', 
      slug: 'Air Compressor', 
      keys: ['aircompressor', 'air compressor', 'AirCompressor', 'AIR COMPRESSOR', 'air-compressor', 'aircompressors'] 
    },
    { 
      name: 'PUMPS', 
      slug: 'Pumps', 
      keys: ['pumps', 'Pumps', 'PUMPS', 'pump', 'Pump'] 
    },
  ];

  // Group products by category
  const categorizedProducts = useMemo(() => {
    const grouped = {};
    
    categories.forEach(category => {
      grouped[category.slug] = [];
    });

    // Safety check: ensure products is an array
    if (!products || !Array.isArray(products)) {
      return grouped;
    }

    products.forEach((product, idx) => {
      // Use the transformed category from the product
      const categoryValue = product.category;
      
      // Ensure categoryValue is a string
      if (!categoryValue || typeof categoryValue !== 'string') return;
      
      // Normalize product category for comparison
      const productCategory = categoryValue.toLowerCase().trim().replace(/\s+/g, '').replace(/-/g, '');
      
      let matched = false;
      categories.forEach(category => {
        // Check if product category matches any of the category keys
        const matches = category.keys.some(key => {
          const normalizedKey = key.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
          // Try exact match first, then partial match
          if (productCategory === normalizedKey) return true;
          if (productCategory.includes(normalizedKey) || normalizedKey.includes(productCategory)) return true;
          return false;
        });
        
        if (matches) {
          grouped[category.slug].push(product);
          matched = true;
        }
      });
      
      // Debug: Log unmatched categories (only first few to avoid spam)
      if (!matched && idx < 5 && process.env.NODE_ENV === 'development') {
        console.log('Unmatched product category:', {
          productName: product.title || product.name,
          categoryValue: categoryValue,
          normalized: productCategory
        });
      }
    });

    return grouped;
  }, [products]);

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12 md:pb-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Explore our wide range of industrial equipment
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12 sm:space-y-16">
          {categories.map((category, index) => {
            const categoryProducts = categorizedProducts[category.slug] || [];
            const displayProducts = categoryProducts.slice(0, 4);

            // Skip if no products in this category
            if (displayProducts.length === 0) return null;

            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Red Accent Bar */}
                    <div className="w-1 h-8 sm:h-10 bg-[#7C2A47] rounded-full"></div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                      {category.name}
                    </h2>
                  </div>
                  
                  {/* View More Link */}
                  {categoryProducts.length > 4 && (
                    <Link
                      href={`/category/products?category=${encodeURIComponent(category.name)}`}
                      className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#7C2A47] hover:text-[#8B3A5A] transition-colors duration-200 group"
                    >
                      <span>View more</span>
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  )}
                </div>

                {/* Products Scrollable Container */}
                <div className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 -mx-3 px-3 sm:mx-0 sm:px-0">
                  {displayProducts.map((product, idx) => (
                    <div
                      key={product?.id || product?._id || `${category.slug}-${idx}`}
                      className="snap-start flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px]"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Divider (except for last category) */}
                {index < categories.length - 1 && (
                  <div className="mt-12 sm:mt-16">
                    <hr className="border-t border-gray-200" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Show message if no products found */}
        {categories.every(cat => (categorizedProducts[cat.slug] || []).length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base">No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;

