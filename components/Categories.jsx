'use client'

import { assets } from '@/assets/assets'
import Title from './Title'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  "Pumps",
  "Electric Motor",
  "Engine",
  "Generator",
  "Air Compressor",
  "Hydraulic Systems",
  "Power Tools",
  "Welding Equipment",
  "Industrial Fans",
  "Control Panels"
]

const categoryImages = {
  "Pumps": assets.product_img01,
  "Electric Motor": assets.product_img02,
  "Engine": assets.product_img03,
  "Generator": assets.product_img04,
  "Air Compressor": assets.product_img05,
  "Hydraulic Systems": assets.product_img01,
  "Power Tools": assets.product_img01,
  "Welding Equipment": assets.product_img01,
  "Industrial Fans": assets.product_img01,
  "Control Panels": assets.product_img01,
}

export default function Categories() {
  const [startIndex, setStartIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(2) // Default for SSR

  // ✅ UseEffect ensures it runs only on client (no SSR mismatch)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerPage(5)
      else if (window.innerWidth >= 768) setItemsPerPage(3)
      else setItemsPerPage(2)
    }

    handleResize() // run once on mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNext = () => {
    if (startIndex + itemsPerPage < categories.length) {
      setStartIndex(startIndex + itemsPerPage)
    }
  }

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage)
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto bg-white">
      <Title title="Shop by Category" description="Browse our wide range of product categories" visibleButton={false} />

      {/* Mobile / Tablet */}
      <div className="mt-8 lg:hidden relative w-full">
        <div className="relative flex items-center justify-center px-10 sm:px-12">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-2.5 sm:p-3 rounded-full z-20 transition-all flex-shrink-0 ${
              startIndex === 0 
                ? 'opacity-30 cursor-not-allowed' 
                : 'opacity-100 hover:bg-gray-50 active:scale-95'
            }`}
            aria-label="Previous categories"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
          </button>

          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-3"
              style={{ transform: `translateX(-${startIndex * (100 / itemsPerPage)}%)` }}
            >
              {categories.map((cat, index) => (
                <Link
                  key={index}
                  href={`/category/products?category=${encodeURIComponent(cat)}`}
                  className={`group flex-shrink-0 flex flex-col ${
                    itemsPerPage === 2 ? 'w-1/2' : 'w-1/3'
                  }`}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all duration-300 h-full"
                  >
                    <div className="bg-gray-50 rounded-lg h-28 w-full flex items-center justify-center overflow-hidden mb-3">
                      <Image
                        src={categoryImages[cat]}
                        alt={cat}
                        width={96}
                        height={96}
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <p className="text-center text-xs sm:text-sm font-semibold text-gray-800 leading-tight">
                      {cat}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={startIndex + itemsPerPage >= categories.length}
            className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-2.5 sm:p-3 rounded-full z-20 transition-all flex-shrink-0 ${
              startIndex + itemsPerPage >= categories.length
                ? 'opacity-30 cursor-not-allowed'
                : 'opacity-100 hover:bg-gray-50 active:scale-95'
            }`}
            aria-label="Next categories"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Desktop - Myntra Style */}
      <div className="hidden lg:block mt-6 relative">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-3 rounded-full z-10 transition-all -ml-6 ${
            startIndex === 0 ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-50 active:scale-95'
          }`}
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>

        <div className="overflow-x-auto w-full px-0 snap-x snap-mandatory scrollbar-hide">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{ transform: `translateX(-${startIndex * (100 / 5)}%)` }}
          >
            {categories.map((cat, index) => (
                <Link
                  key={index}
                  href={`/category/products?category=${encodeURIComponent(cat)}`}
                  className="group flex-shrink-0 w-1/5 flex flex-col snap-center"
                >
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                >
                  <div className="bg-gray-50 rounded-lg h-48 w-full flex items-center justify-center overflow-hidden mb-4">
                    <Image
                      src={categoryImages[cat]}
                      alt={cat}
                      width={160}
                      height={160}
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p className="font-semibold text-center text-base text-gray-800 group-hover:text-[#c31e5aff] transition-colors">
                    {cat}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={startIndex + 5 >= categories.length}
          className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-3 rounded-full z-10 transition-all -mr-6 ${
            startIndex + 5 >= categories.length
              ? 'opacity-40 pointer-events-none'
              : 'hover:bg-gray-50 active:scale-95'
          }`}
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </div>
  )
}
