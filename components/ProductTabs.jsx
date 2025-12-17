'use client'

import { useEffect, Suspense, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { fetchProductsAsync } from '@/lib/features/product/productSlice'
import { assets } from '@/assets/assets'
import { motion, AnimatePresence } from 'framer-motion'

const ProductTabsContent = () => {
  const dispatch = useDispatch()
  // Handle both products and list from Redux (different components use different keys)
  const products = useSelector((state) => state.product.list || state.product.products || [])
  const loading = useSelector((state) => state.product.loading || false)

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProductsAsync())
  }, [dispatch])

  // Memoize base URL
  const baseUrl = useMemo(() => 
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    []
  )

  // Memoize product transformation function
  const transformProduct = useCallback((product) => {
    if (!product) return null;

    // Handle images
    let productImages = []
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      productImages = product.images
        .filter(img => img && img.trim() !== '')
        .map(img => {
          if (img.startsWith('http')) return img
          return img.startsWith('/uploads/') ? `${baseUrl}${img}` : `${baseUrl}/uploads/${img}`
        })
    }
    
    if (productImages.length === 0) {
      productImages = [assets.product_img0]
    }

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

    return {
      id: product.id || product._id,
      _id: product._id || product.id,
      name: product.title || product.name || 'Untitled Product',
      title: product.title || product.name || 'Untitled Product',
      images: productImages,
      price: price,
      mrp: mrp,
      discount: product.discount || 0,
      category: categoryName,
      categoryId: product.categoryId,
      stock: Number(product.stock) || 0,
      inStock: (product.stock !== undefined && product.stock !== null) ? product.stock > 0 : true,
      rating: Array.isArray(product.rating) ? product.rating : [],
      hasVariants: product.hasVariants || false,
      brandVariants: product.brandVariants || [],
      createdAt: product.createdAt || product.created_at || product.updatedAt || product.updated_at || new Date(),
      originalProduct: product, // Store original for reference
    }
  }, [baseUrl])

  // Memoize active products filter - only recalculate when products change
  const activeProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return []
    
    let filtered = products.filter(product => {
      if (!product) return false
      const status = product.status
      return status === undefined || status === 'active'
    })
    
    if (filtered.length === 0 && products.length > 0) {
      filtered = products.filter(product => product !== null && product !== undefined)
    }
    
    return filtered
  }, [products])

  // Just Added (Latest products) - sort by date, then transform
  const justAddedProducts = useMemo(() => {
    if (activeProducts.length === 0) return []
    const transformed = [...activeProducts]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || a.updatedAt || a.updated_at || 0)
        const dateB = new Date(b.createdAt || b.created_at || b.updatedAt || b.updated_at || 0)
        return dateB - dateA
      })
      .slice(0, 12)
      .map(transformProduct)
      .filter(product => product && product.id)
    
    // Debug: Log first product to help troubleshoot
    if (transformed.length > 0 && process.env.NODE_ENV === 'development') {
      console.log('Sample transformed product from ProductTabs:', {
        name: transformed[0].name,
        price: transformed[0].price,
        category: transformed[0].category,
        originalProduct: transformed[0].originalProduct
      });
    }
    
    return transformed
  }, [activeProducts, transformProduct])

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 pt-6 sm:pt-3 md:pt-4 pb-4 sm:pb-6 md:pb-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            {/* Just added */}
               Our Products
          </h2>
          <Link
            href="/category/products"
            className="text-sm sm:text-base font-semibold text-[#7C2A47] hover:text-[#8B3A5A] transition-colors"
          >
            View all
          </Link>
        </div>

        {/* Products Grid with Smooth Transition */}
        <AnimatePresence mode="sync">
          {loading && justAddedProducts.length === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 sm:py-12"
            >
              <p className="text-sm sm:text-base text-gray-500">Loading products...</p>
            </motion.div>
          ) : justAddedProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 sm:py-12"
            >
              <p className="text-sm sm:text-base text-gray-500">
                {products && products.length > 0 
                  ? 'No products available in this category.' 
                  : 'No products found. Please check back later.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="just-added"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
              className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 -mx-3 px-3 sm:mx-0 sm:px-0"
            >
              {justAddedProducts.map((product) => (
                <div
                  key={product.id}
                  className="snap-start flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

const ProductTabs = () => {
  return (
    <Suspense fallback={
      <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </section>
    }>
      <ProductTabsContent />
    </Suspense>
  )
}

export default ProductTabs

