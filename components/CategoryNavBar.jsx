'use client'

import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategoriesWithSubcategoriesAsync } from '@/lib/features/category/categorySlice'

const CategoryNavBar = () => {
  const dispatch = useDispatch()
  const { categoriesWithSubcategories, loading } = useSelector((state) => state.category)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const timeoutRef = useRef(null)
  const dropdownRef = useRef(null)
  const buttonRefs = useRef({})
  const navContainerRef = useRef(null)

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategoriesWithSubcategoriesAsync())
  }, [dispatch])

  // Process categories: filter active parent categories and sort
  const processedCategories = useMemo(() => {
    let categoriesData = categoriesWithSubcategories
    
    if (categoriesWithSubcategories && typeof categoriesWithSubcategories === 'object' && !Array.isArray(categoriesWithSubcategories)) {
      if (categoriesWithSubcategories.success && Array.isArray(categoriesWithSubcategories.data)) {
        categoriesData = categoriesWithSubcategories.data
      } else if (Array.isArray(categoriesWithSubcategories.data)) {
        categoriesData = categoriesWithSubcategories.data
      }
    }
    
    if (!categoriesData || !Array.isArray(categoriesData) || categoriesData.length === 0) {
      return []
    }
    
    return [...categoriesData]
      .filter(cat => {
        const isActive = cat.status === 'active'
        const isParent = cat.isParent === true
        return isActive && isParent
      })
      .map(cat => {
        let processedSubcategories = []
        if (Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
          processedSubcategories = [...cat.subcategories]
            .filter(sub => {
              const subStatus = sub.status
              return subStatus === 'active' || subStatus === undefined
            })
            .map(sub => {
              const subId = sub.id || sub._id
              return {
                id: subId?.toString() || String(subId) || '',
                _id: subId?.toString() || String(subId) || '',
                title: sub.title || sub.englishName || '',
                englishName: sub.englishName || sub.title || '',
                slug: sub.slug || sub.englishName?.toLowerCase().replace(/\s+/g, '-') || '',
                sortOrder: sub.sortOrder !== undefined && sub.sortOrder !== null ? sub.sortOrder : null,
                status: sub.status || 'active'
              }
            })
        }
        
        const catId = cat.id || cat._id
        return {
          ...cat,
          id: catId?.toString() || String(catId) || '',
          _id: catId?.toString() || String(catId) || '',
          subcategories: processedSubcategories
        }
      })
      .sort((a, b) => {
        if (a.sortOrder !== null && b.sortOrder !== null) {
          return a.sortOrder - b.sortOrder
        }
        if (a.sortOrder !== null) return -1
        if (b.sortOrder !== null) return 1
        return (a.title || a.englishName || '').localeCompare(b.title || b.englishName || '')
      })
  }, [categoriesWithSubcategories])

  // Format category names for display (convert camelCase to Title Case, then uppercase)
  const formatCategoryName = (category) => {
    const name = category.title || category.englishName || ''
    // Convert camelCase to Title Case
    const formatted = name.replace(/([A-Z])/g, ' $1').trim()
    return formatted.toUpperCase()
  }

  // Desktop hover handlers
  const handleMouseEnter = (categoryId) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setHoveredCategory(categoryId)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null)
    }, 200)
  }

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null)
    }, 200)
  }

  // Mobile click handler
  const handleCategoryClick = (e, categoryId) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Skip if not in browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    if (activeCategory === categoryId) {
      // Close dropdown
      setActiveCategory(null)
      setDropdownPosition({ top: 0, left: 0, width: 0 })
    } else {
      // Open dropdown first
      setActiveCategory(categoryId)
      
      // Calculate position - use multiple attempts to ensure we get the correct position
      const calculatePosition = (attempt = 0) => {
        // Skip if not in browser environment
        if (typeof window === 'undefined') {
          return
        }
        
      const button = buttonRefs.current[categoryId]
        if (!button) {
          if (attempt < 3 && typeof window !== 'undefined' && window.requestAnimationFrame) {
            requestAnimationFrame(() => calculatePosition(attempt + 1))
          }
          return
        }
        
        // Force a reflow to ensure latest layout
        void button.offsetHeight
        
        // Get fresh position - getBoundingClientRect() returns viewport coordinates
        // which automatically account for all scrolling
        const rect = button.getBoundingClientRect()
        
        // Validate button has valid dimensions and coordinates
        const maxWidth = typeof window !== 'undefined' ? window.innerWidth : 375
        if (rect.width > 0 && rect.height > 0 && 
            !isNaN(rect.left) && !isNaN(rect.top) && 
            !isNaN(rect.bottom) && !isNaN(rect.right) &&
            rect.left >= -maxWidth && rect.left <= maxWidth * 2) {
          calculateDropdownPosition(rect, categoryId)
        } else if (attempt < 3 && typeof window !== 'undefined' && window.requestAnimationFrame) {
          // Retry if position isn't valid yet
          requestAnimationFrame(() => calculatePosition(attempt + 1))
        }
      }
      
      // Start calculation
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        requestAnimationFrame(() => {
          calculatePosition(0)
        })
      }
    }
  }

  // Helper function to calculate dropdown position
  const calculateDropdownPosition = (rect, categoryId) => {
    // Responsive dropdown width based on viewport
    // Check if window is available (client-side) to prevent SSR errors
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 375 // Default to mobile width during SSR
    let dropdownWidth = 160 // Default mobile
    if (viewportWidth >= 768) {
      dropdownWidth = 200 // Tablet
    } else if (viewportWidth >= 640) {
      dropdownWidth = 180 // Small tablet
    }
    const padding = 12 // 0.75rem = 12px
    
    // Calculate left position: align dropdown to button's left edge
    // This ensures the dropdown is always directly under the button
    let left = rect.left
    
    // If button is wider than dropdown, we can optionally center it
    // But for better alignment, keep it left-aligned
    // Only center if button is significantly wider
    if (rect.width > dropdownWidth + 40) {
      left = rect.left + (rect.width / 2) - (dropdownWidth / 2)
    }
    
    // Ensure dropdown stays within viewport bounds
    // If dropdown would overflow on the right
    if (left + dropdownWidth > viewportWidth - padding) {
      // Try to align to button's right edge, or use viewport edge
      left = Math.max(padding, Math.min(rect.right - dropdownWidth, viewportWidth - dropdownWidth - padding))
    }
    // If dropdown would overflow on the left
        if (left < padding) {
          left = padding
        }
        
        // Calculate top position (below button with spacing)
    // Using fixed positioning, so use rect.bottom directly (already viewport-relative)
    const top = Math.max(0, rect.bottom + 8) // 8px spacing below button, ensure not negative
        
    // Set position with the calculated values
        setDropdownPosition({
      top: top,
      left: left,
          width: Math.min(dropdownWidth, viewportWidth - (padding * 2))
        })
      }

  // Calculate initial position immediately when dropdown opens (before paint)
  useLayoutEffect(() => {
    // Skip during SSR - only run on client side
    if (typeof window === 'undefined') {
      return
    }
    
    if (!activeCategory) {
      return
    }
    
    const button = buttonRefs.current[activeCategory]
    if (button) {
      // Get position immediately, before browser paints
      const rect = button.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0 && 
          !isNaN(rect.left) && !isNaN(rect.top) && 
          !isNaN(rect.bottom) && !isNaN(rect.right)) {
        calculateDropdownPosition(rect, activeCategory)
      }
    }
  }, [activeCategory])

  // Update dropdown position on scroll/resize when active and prevent horizontal scroll
  useEffect(() => {
    // Skip during SSR - only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }
    
    if (!activeCategory) {
      // Reset overflow when dropdown is closed
      if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflowX = ''
      }
      return
    }

    let rafId = null
    const updatePosition = () => {
      // Skip if not in browser environment
      if (typeof window === 'undefined') {
        return
      }
      
      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      
      // Use requestAnimationFrame for smooth, real-time updates during scroll
      rafId = requestAnimationFrame(() => {
      const button = buttonRefs.current[activeCategory]
      if (button) {
          // Force a reflow to ensure latest layout
          void button.offsetHeight
          
          // Always get fresh position - getBoundingClientRect() is viewport-relative
          // and automatically accounts for all scrolling
        const rect = button.getBoundingClientRect()
          
          // Validate button has valid dimensions and coordinates
          const maxWidth = typeof window !== 'undefined' ? window.innerWidth : 375
          if (rect.width > 0 && rect.height > 0 && 
              !isNaN(rect.left) && !isNaN(rect.top) && 
              !isNaN(rect.bottom) && !isNaN(rect.right) &&
              rect.left >= -maxWidth && rect.left <= maxWidth * 2) {
            calculateDropdownPosition(rect, activeCategory)
          }
        }
        rafId = null
      })
    }

    // Prevent horizontal scroll when dropdown is open
    if (typeof document !== 'undefined' && document.body) {
    document.body.style.overflowX = 'hidden'
    }

    // Initial position update
    updatePosition()
    
    // Listen for window scroll and resize
    if (typeof window !== 'undefined') {
    window.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition)
    }
    
    // Listen to nav container scroll events (for horizontal scrolling)
    // This is critical for updating dropdown position when category bar is scrolled
    const navContainer = navContainerRef.current
    if (navContainer) {
      // Use both scroll and scrollend events for better coverage
      navContainer.addEventListener('scroll', updatePosition, { passive: true })
      
      // Also listen for scrollend if supported (for final position after scroll completes)
      if (typeof window !== 'undefined' && 'onscrollend' in window) {
        navContainer.addEventListener('scrollend', updatePosition, { passive: true })
      }
    }

    return () => {
      if (rafId && typeof window !== 'undefined') {
        cancelAnimationFrame(rafId)
      }
      if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
      }
      if (navContainer) {
        navContainer.removeEventListener('scroll', updatePosition)
        if (typeof window !== 'undefined' && 'onscrollend' in window) {
          navContainer.removeEventListener('scrollend', updatePosition)
        }
      }
      if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflowX = ''
      }
    }
  }, [activeCategory])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Get category slug for URL - ensure it matches backend expectations
  const getCategorySlug = (category) => {
    // First try to use slug if available (most reliable)
    if (category.slug && category.slug.trim() !== '') {
      return category.slug;
    }
    // Fallback to title/englishName, but ensure proper formatting
    const categoryTitle = category.title || category.englishName || '';
    if (categoryTitle) {
      // Return as-is for exact matching (spaces will be URL encoded)
      return categoryTitle.trim();
    }
    return '';
  }

  // Get subcategory slug for URL
  const getSubcategorySlug = (subcategory) => {
    return subcategory.slug || (subcategory.englishName ? subcategory.englishName.toLowerCase().replace(/\s+/g, '-') : '') || ''
  }

  return (
    <div className="hidden lg:block sticky top-16 md:top-18 lg:top-20 w-full bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 relative">
        {/* Mobile & Tablet: Horizontal Scrollable */}
        <nav 
          ref={navContainerRef}
          className={`lg:hidden flex items-center gap-1 sm:gap-1.5 md:gap-2 py-2 md:py-2.5 touch-pan-x ${activeCategory ? 'overflow-visible' : 'overflow-x-auto scrollbar-hide'}`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {loading ? (
            <div className="px-2 sm:px-3 md:px-4 py-2 flex items-center justify-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 border-t-[#7C2A47] rounded-full animate-spin"></div>
            </div>
          ) : processedCategories.length === 0 ? (
            <div className="px-2 sm:px-3 md:px-4 py-2 text-[10px] sm:text-[11px] md:text-xs text-gray-500 whitespace-nowrap">No categories available</div>
          ) : (
            processedCategories.map((category) => {
              const categoryName = formatCategoryName(category)
              const categorySlug = getCategorySlug(category)
              const categoryHref = `/category/products?category=${encodeURIComponent(categorySlug)}`
              const categoryId = String(category.id || category._id || '')
              const subcategories = Array.isArray(category.subcategories) ? category.subcategories : []
              const hasSubcategories = subcategories.length > 0
              const isActive = activeCategory === categoryId

              return (
                <div key={categoryId} className="relative flex-shrink-0 z-[60]">
                  {hasSubcategories ? (
                    <button
                      ref={(el) => {
                        if (el) buttonRefs.current[categoryId] = el
                      }}
                      onClick={(e) => handleCategoryClick(e, categoryId)}
                      onMouseDown={(e) => e.stopPropagation()}
                      className={`flex items-center gap-0.5 sm:gap-1 md:gap-1.5 min-h-[36px] sm:min-h-[40px] md:min-h-[44px] py-1.5 sm:py-2 md:py-2.5 px-2 sm:px-2.5 md:px-3 lg:px-4 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-tight transition-all duration-200 rounded-md sm:rounded-lg whitespace-nowrap touch-manipulation ${
                        isActive
                          ? 'text-[#7C2A47] bg-[#7C2A47]/10'
                          : 'text-gray-700 active:text-[#7C2A47] active:bg-[#7C2A47]/10 hover:text-[#7C2A47] hover:bg-[#7C2A47]/5'
                      }`}
                    >
                      <span className="leading-tight max-w-[120px] sm:max-w-[140px] md:max-w-none truncate">{categoryName}</span>
                      <ChevronDown 
                        size={10} 
                        className={`sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 flex-shrink-0 transition-transform duration-200 ${
                          isActive ? 'rotate-180' : ''
                        } ${isActive ? 'text-[#7C2A47]' : 'text-gray-500'}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={categoryHref}
                      className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 min-h-[36px] sm:min-h-[40px] md:min-h-[44px] py-1.5 sm:py-2 md:py-2.5 px-2 sm:px-2.5 md:px-3 lg:px-4 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-tight transition-all duration-200 rounded-md sm:rounded-lg whitespace-nowrap touch-manipulation text-gray-700 active:text-[#7C2A47] active:bg-[#7C2A47]/10 hover:text-[#7C2A47] hover:bg-[#7C2A47]/5"
                      onClick={() => {
                        setActiveCategory(null)
                        setDropdownPosition({ top: 0, left: 0, width: 0 })
                      }}
                    >
                      <span className="leading-tight max-w-[120px] sm:max-w-[140px] md:max-w-none truncate">{categoryName}</span>
                    </Link>
                  )}

                  {/* Mobile Dropdown - Display when category has subcategories and is active */}
                  {hasSubcategories && isActive && (
                    <>
                      {/* Backdrop to close dropdown when clicking outside - transparent */}
                      <div 
                        className="fixed inset-0 z-[55] lg:hidden"
                        onClick={() => {
                          setActiveCategory(null)
                          setDropdownPosition({ top: 0, left: 0, width: 0 })
                        }}
                      />
                      <div 
                        ref={dropdownRef}
                        className="fixed bg-white shadow-2xl rounded-lg sm:rounded-xl py-1 sm:py-1.5 z-[60] border border-gray-200/80 max-h-[70vh] overflow-y-auto lg:hidden min-w-[140px] sm:min-w-[160px] md:min-w-[180px] max-w-[200px] sm:max-w-[220px] md:max-w-[240px]"
                        style={{
                          top: `${dropdownPosition.top > 0 ? dropdownPosition.top : 60}px`,
                          left: `${dropdownPosition.left > 0 ? dropdownPosition.left : 12}px`,
                          width: `${dropdownPosition.width > 0 ? dropdownPosition.width : 160}px`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        {subcategories.length > 0 ? (
                          <ul className="list-none m-0 p-0">
                            {[...subcategories]
                            .sort((a, b) => {
                              if (a.sortOrder !== null && b.sortOrder !== null) {
                                return a.sortOrder - b.sortOrder
                              }
                              if (a.sortOrder !== null) return -1
                              if (b.sortOrder !== null) return 1
                              return (a.title || a.englishName || '').localeCompare(b.title || b.englishName || '')
                            })
                            .map((subCat, subIndex) => {
                              const subCategoryName = subCat.title || subCat.englishName || ''
                              const subCategorySlug = getSubcategorySlug(subCat)
                              
                              if (!subCategoryName) return null
                              
                              return (
                                  <li key={subCat.id || subCat._id || `sub-${subIndex}`} className="m-0 p-0">
                                <Link
                                  href={`/category/products?category=${encodeURIComponent(categorySlug)}&subcategory=${encodeURIComponent(subCategorySlug)}`}
                                      className="flex items-center justify-center w-full min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs text-gray-700 hover:text-[#7C2A47] hover:bg-[#7C2A47]/5 active:bg-[#7C2A47]/10 active:text-[#7C2A47] transition-all duration-150 ease-in-out border-b border-gray-100 last:border-b-0"
                                  onClick={() => {
                                    setActiveCategory(null)
                                    setDropdownPosition({ top: 0, left: 0, width: 0 })
                                  }}
                                >
                                      <span className="font-normal text-center w-full leading-normal px-1 truncate">{subCategoryName}</span>
                                </Link>
                                  </li>
                              )
                            })
                              .filter(Boolean)}
                          </ul>
                        ) : (
                          <div className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs text-gray-500 text-center w-full">No subcategories available</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })
          )}
        </nav>

        {/* Desktop: Evenly Distributed */}
        <nav className="hidden lg:flex items-center justify-between w-full py-1">
          {loading ? (
            <div className="px-4 py-2.5 w-full flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#7C2A47] rounded-full animate-spin"></div>
            </div>
          ) : processedCategories.length === 0 ? (
            <div className="px-4 py-2.5 text-xs lg:text-sm text-gray-500 w-full text-center">No categories available</div>
          ) : (
            processedCategories.map((category) => {
              const categoryName = formatCategoryName(category)
              const categorySlug = getCategorySlug(category)
              const categoryHref = `/category/products?category=${encodeURIComponent(categorySlug)}`
              const categoryId = String(category.id || category._id || '')
              const subcategories = Array.isArray(category.subcategories) ? category.subcategories : []
              const hasSubcategories = subcategories.length > 0
              const isHovered = hoveredCategory === categoryId

              return (
                <div
                  key={categoryId}
                  className="relative flex-1 flex justify-center"
                  onMouseEnter={() => handleMouseEnter(categoryId)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={categoryHref}
                    className={`flex items-center gap-1.5 lg:gap-2 py-2.5 lg:py-3 px-2 lg:px-3 xl:px-4 text-xs lg:text-sm font-semibold uppercase tracking-tight transition-all duration-200 relative group ${
                      isHovered || (hasSubcategories && hoveredCategory === categoryId)
                        ? 'text-[#7C2A47]'
                        : 'text-gray-700 hover:text-[#7C2A47]'
                    }`}
                  >
                    <span className="leading-tight whitespace-nowrap">{categoryName}</span>
                    {hasSubcategories && (
                      <ChevronDown 
                        size={12} 
                        className={`lg:w-3.5 lg:h-3.5 flex-shrink-0 transition-all duration-200 ${
                          isHovered || hoveredCategory === categoryId
                            ? 'rotate-180 text-[#7C2A47]' 
                            : 'text-gray-500 group-hover:text-[#7C2A47]'
                        }`}
                      />
                    )}
                  </Link>

                  {/* Desktop Dropdown Menu */}
                  {hasSubcategories && isHovered && (
                    <div
                      ref={dropdownRef}
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                      className="absolute bg-white shadow-2xl rounded-lg lg:rounded-xl top-full mt-2 left-1/2 -translate-x-1/2 w-64 lg:w-72 xl:w-80 py-1 lg:py-1.5 z-50 border border-gray-200/80 max-h-[70vh] overflow-y-auto"
                    >
                      {subcategories.length > 0 ? (
                        <ul className="list-none m-0 p-0">
                          {[...subcategories]
                          .sort((a, b) => {
                            if (a.sortOrder !== null && b.sortOrder !== null) {
                              return a.sortOrder - b.sortOrder
                            }
                            if (a.sortOrder !== null) return -1
                            if (b.sortOrder !== null) return 1
                            return (a.title || a.englishName || '').localeCompare(b.title || b.englishName || '')
                          })
                          .map((subCat, subIndex) => {
                            const subCategoryName = subCat.title || subCat.englishName || ''
                            const subCategorySlug = getSubcategorySlug(subCat)
                            
                            if (!subCategoryName) return null
                            
                            return (
                                <li key={subCat.id || subCat._id || `sub-${subIndex}`} className="m-0 p-0">
                              <Link
                                href={`/category/products?category=${encodeURIComponent(categorySlug)}&subcategory=${encodeURIComponent(subCategorySlug)}`}
                                    className="flex items-center justify-center w-full min-h-[44px] px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 text-xs lg:text-sm text-gray-700 hover:text-[#7C2A47] hover:bg-[#7C2A47]/5 active:bg-[#7C2A47]/10 transition-all duration-150 ease-in-out border-b border-gray-100 last:border-b-0"
                                onClick={() => {
                                  setHoveredCategory(null)
                                }}
                              >
                                    <span className="font-normal text-center w-full leading-normal">{subCategoryName}</span>
                              </Link>
                                </li>
                            )
                          })
                            .filter(Boolean)}
                        </ul>
                      ) : (
                        <div className="px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm text-gray-500 text-center w-full">No subcategories available</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </nav>
      </div>
    </div>
  )
}

export default CategoryNavBar
