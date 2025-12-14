'use client';

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ShopByCategory = () => {
  const products = useSelector((state) => state.product.list || state.product.products || []);

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
      if (!product.category) return;
      
      // Handle case where category might be an object or string
      let categoryValue = product.category;
      if (typeof categoryValue === 'object' && categoryValue !== null) {
        // Try multiple possible fields from the Category model
        categoryValue = categoryValue.englishName || categoryValue.name || categoryValue.title || categoryValue.slug || '';
      }
      
      // Also check categoryId if it's populated
      if ((!categoryValue || categoryValue === '') && product.categoryId) {
        if (typeof product.categoryId === 'object' && product.categoryId !== null) {
          categoryValue = product.categoryId.englishName || product.categoryId.name || product.categoryId.title || product.categoryId.slug || '';
        }
      }
      
      // Ensure categoryValue is a string
      if (typeof categoryValue !== 'string' || !categoryValue) return;
      
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
      if (!matched && idx < 5) {
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
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                      {category.name}
                    </h3>
                  </div>
                  
                  {/* View More Link */}
                  {categoryProducts.length > 4 && (
                    <Link
                      href={`/category/${category.slug}`}
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

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 items-stretch">
                  {displayProducts.map((product, idx) => (
                    <ProductCard
                      key={product?.id || product?._id || `${category.slug}-${idx}`}
                      product={product}
                    />
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

