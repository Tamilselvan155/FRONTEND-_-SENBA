'use client'
import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { assets } from '@/assets/assets'
import Image from 'next/image'

// const recentProducts = [
//   { id: 1, img: assets.recent1 },
//   { id: 2, img: assets.recent1 },
//   { id: 3, img: assets.recent1 },
//   { id: 4, img: assets.recent1 },
//   { id: 5, img: assets.recent1 },
//   { id: 6, img: assets.recent1 },
//   { id: 7, img: assets.recent1 },
//   { id: 8, img: assets.recent1 },
// ]

const recentProducts = [
  { id: 1, name: "Engine", img: assets.recent1 },
  { id: 2, name: "Generator", img: assets.recent1 },
  { id: 3, name: "Pumps", img: assets.recent1 },
  { id: 4, name: "Electric Motor", img: assets.recent1 },
  { id: 5, name: "Air Compressor", img: assets.recent1 },
  { id: 6, name: "Hydraulic Systems", img: assets.recent1 },
]


const RecentProducts = () => {
  const carouselRef = useRef(null)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  // ✅ Check scroll position and update arrow state
  const checkScrollPosition = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    const tolerance = 10 // for rounding or padding issues
    setIsAtStart(scrollLeft <= tolerance)
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - tolerance)
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    carousel.addEventListener('scroll', checkScrollPosition)
    checkScrollPosition() // initial check
    return () => carousel.removeEventListener('scroll', checkScrollPosition)
  }, [])

  // ✅ Scroll left
  const scrollLeft = () => {
    if (!carouselRef.current) return
    const carousel = carouselRef.current
    carousel.scrollBy({
      left: -(carousel.offsetWidth - 40),
      behavior: 'smooth',
    })
    setTimeout(checkScrollPosition, 400)
  }

  // ✅ Scroll right
  const scrollRight = () => {
    if (!carouselRef.current) return
    const carousel = carouselRef.current
    carousel.scrollBy({
      left: carousel.offsetWidth - 40,
      behavior: 'smooth',
    })
    setTimeout(checkScrollPosition, 400)
  }

  return (
    <div className="px-4 my-20 mx-auto max-w-7xl">
      {/* Title Section */}
      <div className="flex flex-col items-start mb-10">
        <h2 className="text-[22px] sm:text-3xl font-bold">
          <span className="text-[#7C2A47]">RECENT</span>{' '}
          <span className="text-gray-900">PRODUCTS</span>
        </h2>
        <div className="w-full border-t border-gray-300 mt-4 mb-6"></div>
        <p className="text-[17px] sm:text-lg text-[#E6A02A] font-semibold">
          INDUSTRY DESIGNS, INSPIRING GROWTH
        </p>
      </div>

      {/* --- Carousel --- */}
      <div className="relative mt-6">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          disabled={isAtStart}
          className={`absolute top-1/2 left-2 transform -translate-y-1/2 p-2 rounded-full shadow-md z-20 transition
            ${isAtStart
              ? 'opacity-30 cursor-not-allowed bg-white'
              : 'opacity-100 bg-white hover:bg-gray-100 text-black'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          disabled={isAtEnd}
          className={`absolute top-1/2 right-2 sm:-right-5 transform -translate-y-1/2 p-2 rounded-full shadow-md z-20 transition
            ${isAtEnd
              ? 'opacity-30 cursor-not-allowed bg-white'
              : 'opacity-100 bg-white hover:bg-gray-100 text-black'}`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrollable Products */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide space-x-6 px-0 sm:px-1 py-2"
        >
          {recentProducts.map((product) => (
            // <div
            //   key={product.id}
            //   className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 snap-start"
            // >
            //   <div className="bg-white rounded-lg overflow-hidden">
            //     <Image
            //       src={product.img}
            //       alt={`Product ${product.id}`}
            //       className="w-full h-[250px] object-contain"
            //     />
            //   </div>
            // </div>
            <div
              key={product.id}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 snap-start group relative"
            >
              <div className="bg-white rounded-lg overflow-hidden relative">
                <Image
                  src={product.img}
                  alt={product.name}
                  className="w-full h-[250px] object-contain"
                />
                {/* Overlay Name */}
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] opacity-0 group-hover:opacity-100 transition duration-300">
                  <span className="text-white text-xl font-semibold text-center px-2">
                    {product.name}
                  </span>
                </div>
              </div>
            </div>

          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentProducts
