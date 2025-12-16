'use client'

import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { categories, pumpSubCategories } from '@/assets/assets'

const CategoryNavBar = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [showPumpSubmenu, setShowPumpSubmenu] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const timeoutRef = useRef(null)
  const pumpSubmenuRef = useRef(null)

  // Format category names for display
  const formatCategoryName = (cat) => {
    return cat.replace(/([A-Z])/g, ' $1').trim()
  }

  const handleMouseEnter = (category) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setHoveredCategory(category)
    if (category === 'Pumps') {
      setShowPumpSubmenu(true)
    }
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null)
      setShowPumpSubmenu(false)
    }, 200)
  }

  const handlePumpSubmenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setShowPumpSubmenu(true)
  }

  const handlePumpSubmenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowPumpSubmenu(false)
      setHoveredCategory(null)
    }, 200)
  }

  const handleCategoryClick = (category) => {
    if (category === 'Pumps') {
      setActiveCategory(activeCategory === category ? null : category)
      setShowPumpSubmenu(activeCategory !== category)
    } else {
      setActiveCategory(null)
      setShowPumpSubmenu(false)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="sticky top-16 lg:top-20 w-full bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Mobile: Horizontal Scrollable */}
        <nav className="lg:hidden flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-2.5 touch-pan-x">
          {categories.map((category, index) => {
            const categoryName = formatCategoryName(category).toUpperCase()
            const categoryHref = `/category/${category}`
            const isPumps = category === 'Pumps'
            const isActive = activeCategory === category

            return (
              <div key={index} className="relative flex-shrink-0">
                {isPumps ? (
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold uppercase tracking-wide transition-all duration-200 rounded-lg whitespace-nowrap touch-manipulation ${
                      isActive
                        ? 'text-[#7C2A47] bg-[#7C2A47]/10'
                        : 'text-gray-700 active:text-[#7C2A47] active:bg-[#7C2A47]/10 hover:text-[#7C2A47] hover:bg-[#7C2A47]/5'
                    }`}
                  >
                    <span>{categoryName}</span>
                    {/* Show down arrow only for items with submenus */}
                    <ChevronDown 
                      size={10} 
                      className={`transition-transform duration-200 ${
                        isActive ? 'rotate-180' : ''
                      } ${isActive ? 'text-[#7C2A47]' : 'text-gray-500'}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={categoryHref}
                    className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold uppercase tracking-wide transition-all duration-200 rounded-lg whitespace-nowrap touch-manipulation text-gray-700 active:text-[#7C2A47] active:bg-[#7C2A47]/10 hover:text-[#7C2A47] hover:bg-[#7C2A47]/5"
                  >
                    <span>{categoryName}</span>
                    {/* No down arrow for items without submenus */}
                  </Link>
                )}

                {/* Mobile Dropdown for Pumps */}
                {isPumps && isActive && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg w-48 py-2 z-50 border border-gray-200">
                    {pumpSubCategories.map((subCat, subIndex) => (
                      <Link
                        key={subIndex}
                        href={`/category/${category}/${subCat.replace(/\s+/g, '')}`}
                        className="block px-4 py-2.5 text-xs text-gray-700 active:text-[#7C2A47] active:bg-[#7C2A47]/10 transition-colors duration-200"
                        onClick={() => {
                          setActiveCategory(null)
                          setShowPumpSubmenu(false)
                        }}
                      >
                        <span className="font-medium">{subCat}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Desktop: Evenly Distributed */}
        <nav className="hidden lg:flex items-center justify-between w-full">
          {categories.map((category, index) => {
            const categoryName = formatCategoryName(category).toUpperCase()
            const categoryHref = `/category/${category}`
            const isHovered = hoveredCategory === category
            const isPumps = category === 'Pumps'

            return (
              <div
                key={index}
                className="relative flex-1 flex justify-center"
                onMouseEnter={() => handleMouseEnter(category)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={categoryHref}
                  className={`flex items-center gap-1.5 py-2.5 px-3 text-sm font-semibold uppercase tracking-wide transition-all duration-200 relative group ${
                    isHovered || (isPumps && showPumpSubmenu)
                      ? 'text-[#7C2A47]'
                      : 'text-gray-700 hover:text-[#7C2A47]'
                  }`}
                >
                  <span>{categoryName}</span>
                  {/* Show down arrow only for items with submenus (Pumps) */}
                  {isPumps && (
                    <ChevronDown 
                      size={12} 
                      className={`transition-all duration-200 ${
                        isHovered || showPumpSubmenu 
                          ? 'rotate-180 text-[#7C2A47]' 
                          : 'text-gray-500 group-hover:text-[#7C2A47]'
                      }`}
                    />
                  )}
                </Link>

                {/* Desktop Dropdown Menu for Pumps */}
                {isPumps && showPumpSubmenu && (
                  <div
                    ref={pumpSubmenuRef}
                    onMouseEnter={handlePumpSubmenuMouseEnter}
                    onMouseLeave={handlePumpSubmenuMouseLeave}
                    className="absolute bg-white shadow-lg rounded-lg top-full mt-2 left-1/2 -translate-x-1/2 w-56 py-1 z-50 border border-gray-200"
                  >
                    {pumpSubCategories.map((subCat, subIndex) => (
                      <Link
                        key={subIndex}
                        href={`/category/${category}/${subCat.replace(/\s+/g, '')}`}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:text-[#7C2A47] hover:bg-[#7C2A47]/10 transition-all duration-200 rounded-md mx-1"
                        onClick={() => {
                          setShowPumpSubmenu(false)
                          setHoveredCategory(null)
                        }}
                      >
                        <span className="font-medium">{subCat}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default CategoryNavBar






