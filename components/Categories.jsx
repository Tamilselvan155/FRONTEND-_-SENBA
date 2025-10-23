'use client'

import { assets } from '@/assets/assets'
import Title from './Title'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    <div className="px-4 mt-10 sm:my-20 max-w-7xl mx-auto">
      <Title title="Shop by Category" description="Explore products by category" visibleButton={false} />

      {/* Mobile / Tablet */}
      <div className="mt-8 lg:hidden relative flex items-center justify-between w-full overflow-x-hidden">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className={`absolute -left-5 sm:left-2 md:left-0 top-[42%] -translate-y-1/2 p-3 rounded-full z-10 transition-all ${
            startIndex === 0 ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-200'
          }`}
        >
          <ChevronLeft className="h-8 w-8 text-gray-700" />
        </button>

        <div className="overflow-x-auto w-full px-0 snap-x snap-mandatory scrollbar-hide touch-pan-y touch-pan-x">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${startIndex * (100 / itemsPerPage)}%)` }}
          >
            {categories.map((cat, index) => (
              <Link
                key={index}
                href={`/category/${cat}`}
                className={`group flex-shrink-0 px-4 flex flex-col items-center snap-start ${
                  itemsPerPage === 2 ? 'w-1/2' : 'w-1/3'
                }`}
              >
                {/* <div className="bg-[#F5F5F5] h-36 w-36 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src={categoryImages[cat]}
                    alt={cat}
                    width={144}
                    height={144}
                    className="scale-110 group-hover:scale-115 transition duration-300"
                  />
                </div> */}

                <div className="bg-[#F5F5F5] h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40 rounded-full flex items-center justify-center overflow-hidden"
                >
                  <Image
                  src={categoryImages[cat]}
                    alt={cat}
                    width={200}
                    height={200}
                    
                    className="scale-110 group-hover:scale-115 transition duration-300"
                  />
                </div>

                <p className="text-center mt-3 text-base text-[15px] sm:text-[16px] font-medium text-slate-800">{cat}</p>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={startIndex + itemsPerPage >= categories.length}
          className={`absolute -right-5 sm:right-2 md:right-0 top-[42%] -translate-y-1/2 p-3 rounded-full z-10 transition-all ${
            startIndex + itemsPerPage >= categories.length
              ? 'opacity-40 pointer-events-none'
              : 'hover:bg-gray-200'
          }`}
        >
          <ChevronRight className="h-8 w-8 text-gray-700" />
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block mt-12 relative flex items-center justify-between w-full">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className={`absolute left-0 top-[43%] -translate-y-1/2 p-3 rounded-full z-10 transition-all -ml-6 ${
            startIndex === 0 ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-200'
          }`}
        >
          <ChevronLeft className="h-8 w-8 text-gray-700" />
        </button>

        <div className="overflow-x-auto w-full px-0 snap-x snap-mandatory scrollbar-hide">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${startIndex * (100 / 5)}%)` }}
          >
            {categories.map((cat, index) => (
              <Link
                key={index}
                href={`/category/${cat}`}
                className="group flex-shrink-0 w-1/5 px-4 flex flex-col items-center snap-center"
              >
                <div className="bg-[#F5F5F5] h-50 w-50 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src={categoryImages[cat]}
                    alt={cat}
                    width={200}
                    height={200}
                    className="scale-110 group-hover:scale-115 transition duration-300"
                  />
                </div>
                <p className="font-medium text-center mt-2 text-lg text-slate-800">{cat}</p>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={startIndex + 5 >= categories.length}
          className={`absolute right-0 top-[43%] -translate-y-1/2 p-3 rounded-full z-10 transition-all -mr-6 ${
            startIndex + 5 >= categories.length
              ? 'opacity-40 pointer-events-none'
              : 'hover:bg-gray-200'
          }`}
        >
          <ChevronRight className="h-8 w-8 text-gray-700" />
        </button>
      </div>
    </div>
  )
}
