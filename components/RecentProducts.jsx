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
  const [isPaused, setIsPaused] = useState(false)
  const autoScrollIntervalRef = useRef(null)
  const isPausedRef = useRef(false)

  // ✅ Check scroll position and update arrow state
  const checkScrollPosition = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    const tolerance = 10 // for rounding or padding issues
    setIsAtStart(scrollLeft <= tolerance)
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - tolerance)
  }

  // Update ref when isPaused changes
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    
    carousel.addEventListener('scroll', checkScrollPosition)
    checkScrollPosition() // initial check
    
    // ✅ Auto-scroll function
    const autoScroll = () => {
      if (!carouselRef.current || isPausedRef.current) return
      
      const carousel = carouselRef.current
      const { scrollLeft, scrollWidth, clientWidth } = carousel
      const scrollAmount = 180 // Scroll by approximately one card width
      
      // If at the end, scroll back to start (infinite loop)
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        carousel.scrollTo({
          left: 0,
          behavior: 'smooth'
        })
      } else {
        carousel.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        })
      }
      
      setTimeout(checkScrollPosition, 300)
    }
    
    // Set up auto-scroll interval (every 3 seconds)
    autoScrollIntervalRef.current = setInterval(autoScroll, 3000)
    
    return () => {
      carousel.removeEventListener('scroll', checkScrollPosition)
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
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
    <div className="px-4 sm:px-6 md:px-8 pt-2 sm:pt-4 md:pt-6 pb-8 sm:pb-10 md:pb-12 mx-auto max-w-7xl">
      {/* Title Section */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight mb-3">
          <span className="text-[#7C2A47]">RECENT</span>{' '}
          <span className="text-gray-900">PRODUCTS</span>
        </h2>
        <div className="w-24 h-0.5 bg-gray-300 mb-3"></div>
        <p className="text-sm sm:text-base md:text-lg text-[#E6A02A] font-semibold leading-relaxed">
          INDUSTRY DESIGNS, INSPIRING GROWTH
        </p>
      </div>

      {/* --- Carousel --- */}
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          disabled={isAtStart}
          className={`absolute top-1/2 left-2 sm:left-3 transform -translate-y-1/2 p-2 rounded-full shadow-md z-20 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center
            ${isAtStart
              ? 'opacity-40 cursor-not-allowed bg-white/90'
              : 'opacity-100 bg-white hover:bg-gray-50 text-gray-700 hover:shadow-lg'}`}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          disabled={isAtEnd}
          className={`absolute top-1/2 right-2 sm:right-3 transform -translate-y-1/2 p-2 rounded-full shadow-md z-20 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center
            ${isAtEnd
              ? 'opacity-40 cursor-not-allowed bg-white/90'
              : 'opacity-100 bg-white hover:bg-gray-50 text-gray-700 hover:shadow-lg'}`}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable Products */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide gap-3 sm:gap-4 md:gap-5 px-0 py-2"
        >
          {recentProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] snap-start group relative"
            >
              <div className="bg-white rounded-lg overflow-hidden relative shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 h-full flex flex-col">
                <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-3 sm:p-4">
                  <Image
                    src={product.img}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="w-auto h-auto max-w-[80%] max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                {/* Product Name - Always Visible */}
                <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
                  <span className="text-gray-900 text-sm sm:text-base font-semibold text-center block">
                    {product.name}
                  </span>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#7C2A47]/90 via-[#7C2A47]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                  <span className="text-white text-sm sm:text-base font-bold text-center px-3">
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
