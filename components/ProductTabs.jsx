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
  const { products, loading } = useSelector((state) => state.product)

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

    // Get category name if it's an object
    let categoryName = ''
    if (product.category) {
      if (typeof product.category === 'string') {
        categoryName = product.category
      } else if (product.category.name) {
        categoryName = product.category.name
      }
    }

    return {
      id: product.id || product._id,
      name: product.title || product.name || 'Untitled Product',
      images: productImages,
      price: product.price || 0,
      category: categoryName,
      createdAt: product.createdAt || product.created_at || product.updatedAt || product.updated_at || new Date(),
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
    return [...activeProducts]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || a.updatedAt || a.updated_at || 0)
        const dateB = new Date(b.createdAt || b.created_at || b.updatedAt || b.updated_at || 0)
        return dateB - dateA
      })
      .slice(0, 12)
      .map(transformProduct)
      .filter(product => product.id)
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

