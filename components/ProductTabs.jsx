'use client'

import { useState, useEffect, Suspense, useMemo, useCallback, startTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { fetchProductsAsync } from '@/lib/features/product/productSlice'
import { assets } from '@/assets/assets'
import { motion, AnimatePresence } from 'framer-motion'

const ProductTabsContent = () => {
  const dispatch = useDispatch()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { products, loading } = useSelector((state) => state.product)
  
  const urlTab = searchParams.get('tab') || 'all'
  
  // Local state for instant UI updates
  const [localTab, setLocalTab] = useState(urlTab)
  
  // Sync local state with URL params on mount and external changes
  useEffect(() => {
    setLocalTab(urlTab)
  }, [urlTab])
  
  // Use localTab for display, fallback to urlTab
  const activeTab = localTab || urlTab

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

  // Pre-compute and cache all tab views using useMemo - this runs only when products change
  const tabProducts = useMemo(() => {
    if (activeProducts.length === 0) {
      return {
        all: [],
        bestseller: [],
        latest: []
      }
    }

    // Transform all products once
    const transformed = activeProducts
      .map(transformProduct)
      .filter(product => product.id)

    // All products
    const all = transformed.slice(0, 12)

    // Bestseller products - optimized: sort first, then transform
    const featuredProducts = activeProducts
      .filter(p => p.isFeatured || p.featured || p.bestseller)
      .sort((a, b) => {
        const aFeatured = (a.isFeatured || a.featured || a.bestseller) ? 1 : 0
        const bFeatured = (b.isFeatured || b.featured || b.bestseller) ? 1 : 0
        if (bFeatured !== aFeatured) return bFeatured - aFeatured
        return (b.salesCount || b.price || 0) - (a.salesCount || a.price || 0)
      })
      .slice(0, 12)
      .map(transformProduct)
      .filter(product => product.id)

    const bestseller = featuredProducts.length > 0 
      ? featuredProducts 
      : transformed.slice(0, 12)

    // Latest products - sort by date, then transform
    const latest = [...activeProducts]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || a.updatedAt || a.updated_at || 0)
        const dateB = new Date(b.createdAt || b.created_at || b.updatedAt || b.updated_at || 0)
        return dateB - dateA
      })
      .slice(0, 12)
      .map(transformProduct)
      .filter(product => product.id)

    return { all, bestseller, latest }
  }, [activeProducts, transformProduct])

  // Get display products based on active tab - instant lookup from cache
  const displayProducts = useMemo(() => {
    return tabProducts[activeTab] || tabProducts.all
  }, [tabProducts, activeTab])

  // Memoize tabs array
  const tabs = useMemo(() => [
    { id: 'all', label: 'Our Products', href: `${pathname}?tab=all` },
    { id: 'bestseller', label: 'Bestseller', href: `${pathname}?tab=bestseller` },
    { id: 'latest', label: 'Latest Product', href: `${pathname}?tab=latest` },
  ], [pathname])

  // Optimized click handler - updates local state immediately, then URL in background
  const handleTabClick = useCallback((e, tabId) => {
    e.preventDefault()
    
    // Update local state immediately for instant UI feedback
    setLocalTab(tabId)
    
    // Update URL in background using startTransition for non-urgent update
    startTransition(() => {
      const newUrl = `${pathname}?tab=${tabId}`
      router.push(newUrl, { scroll: false })
    })
  }, [pathname, router])

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight tracking-tight">
            Our Products
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 px-2 leading-relaxed max-w-2xl mx-auto">
            Browse the huge variety of our products
          </p>
        </div>

        {/* Tabs Navigation - Mobile Responsive */}
        <div className="flex items-center justify-center mb-8 sm:mb-10 md:mb-12 overflow-x-auto scrollbar-hide -mx-3 sm:mx-0 px-3 sm:px-0">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 md:gap-3 bg-gray-100 rounded-full p-1.5 sm:p-2 md:p-2.5 shadow-sm min-w-fit">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={(e) => handleTabClick(e, tab.id)}
                  className={`
                    relative px-4 sm:px-5 md:px-7 lg:px-9 py-2 sm:py-2.5 md:py-3 rounded-full 
                    text-sm sm:text-base md:text-lg font-semibold whitespace-nowrap
                    transition-all duration-200 ease-in-out touch-manipulation
                    ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-gray-800 active:text-[#7C2A47] active:bg-gray-50'
                    }
                  `}
                >
                  <span className="relative z-10">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#7C2A47] to-[#c31e5a] rounded-full"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.2 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Products Grid with Smooth Transition */}
        <AnimatePresence mode="sync">
          {loading && displayProducts.length === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 sm:py-12"
            >
              <p className="text-sm sm:text-base text-gray-500">Loading products...</p>
            </motion.div>
          ) : displayProducts.length === 0 ? (
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
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 items-stretch"
            >
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Link */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <Link
            href="/category/products"
            className="inline-flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base md:text-lg font-semibold text-[#c31e5a] hover:text-[#7C2A47] active:text-[#7C2A47] transition-colors duration-200 group touch-manipulation"
          >
            <span>View All Products</span>
            <motion.svg
              width="18"
              height="18"
              className="sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </motion.svg>
          </Link>
        </div>
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

