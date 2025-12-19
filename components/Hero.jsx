'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { fetchBannersAsync } from '@/lib/features/banner/bannerSlice'

// Import local fallback images
import banner1 from '@/assets/banner1.jpg'
import banner2 from '@/assets/banner2.jpg'
import banner3 from '@/assets/banner3.jpg'

export default function Hero() {
  const dispatch = useDispatch()
  const { banners, loading } = useSelector((state) => state.banner)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slides, setSlides] = useState([])
  const [failedImages, setFailedImages] = useState(new Set())

  useEffect(() => {
    dispatch(fetchBannersAsync())
  }, [dispatch])

  useEffect(() => {
    // Process backend banners
    const activeBanners = (banners || [])
      .filter((b) => b.status === 'active')
      .map((b) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        
        // Handle image URL construction - similar to product images
        let imageUrl = ''
        const photo = b.photo || ''
        
        if (photo.startsWith('http://') || photo.startsWith('https://')) {
          // Already a full URL, use as is
          imageUrl = photo
        } else if (photo.startsWith('/uploads/')) {
          // Path starts with /uploads/, just add baseUrl
          imageUrl = `${baseUrl}${photo}`
        } else if (photo.startsWith('uploads/')) {
          // Path starts with uploads/ (no leading slash), add baseUrl and leading slash
          imageUrl = `${baseUrl}/${photo}`
        } else {
          // Just filename or relative path, construct full path
          // Remove any leading slashes or paths
          const filename = photo.split('/').pop()
          imageUrl = `${baseUrl}/uploads/banners/${filename}`
        }
        
        console.log('🖼️ Banner:', b.title, '| Original photo:', photo, '| Final URL:', imageUrl)
        
        return {
          id: String(b.id || b._id),
          image: imageUrl,
          title: b.title || 'Welcome',
          description: b.description || 'Explore our products',
          isBackend: true,
        }
      })

    if (activeBanners.length > 0) {
      console.log('✅ Loading', activeBanners.length, 'backend banners')
      setSlides(activeBanners)
    } else {
      // Fallback to local images if no backend banners
      console.log('⚠️ No active backend banners, using fallback images')
      setSlides([
        {
          id: '1',
          image: banner1,
          title: 'Premium Quality Pumps',
          description: 'Reliable solutions for industrial use',
          isBackend: false,
        },
        {
          id: '2',
          image: banner2,
          title: 'Advanced Technology',
          description: 'Engineered for excellence',
          isBackend: false,
        },
        {
          id: '3',
          image: banner3,
          title: 'Best Service',
          description: 'We are here to help you',
          isBackend: false,
        },
      ])
    }
  }, [banners])

  // Auto-advance carousel
  useEffect(() => {
    if (slides.length <= 1) return
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [slides.length])

  // Reset currentIndex if it's out of bounds
  useEffect(() => {
    if (currentIndex >= slides.length && slides.length > 0) {
      setCurrentIndex(0)
    }
  }, [slides.length, currentIndex])

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] bg-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading banners...</div>
      </section>
    )
  }

  const currentSlide = slides[currentIndex]

  return (
    <section className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] overflow-hidden bg-gray-900">
      {/* Carousel Images Container */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex
          
          return (
          <div
            key={`banner-${index}`}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 10 : 1,
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
          {slide.isBackend ? (
            // Backend images - use regular img tag
            failedImages.has(slide.id) ? (
              // Fallback to local image if backend image failed
              <img
                src={typeof banner1 === 'string' ? banner1 : banner1.src}
                alt={slide.title}
                className="w-full h-full object-cover"
                style={{ 
                  display: 'block',
                  visibility: 'visible',
                  opacity: 1,
                  position: 'absolute',
                  inset: 0,
                }}
              />
            ) : (
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                style={{ 
                  display: 'block',
                  visibility: 'visible',
                  opacity: 1,
                  position: 'absolute',
                  inset: 0,
                }}
                loading={isActive ? 'eager' : 'lazy'}
                onLoad={() => console.log('✅ Backend image loaded:', slide.title, slide.image)}
                onError={(e) => {
                  console.error('❌ Backend image failed:', slide.title, slide.image)
                  console.error('Attempting to load:', e.target.src)
                  setFailedImages(prev => new Set(prev).add(slide.id))
                }}
              />
            )
          ) : (
            // Local images - use regular img tag with .src
            <img
              src={typeof slide.image === 'string' ? slide.image : slide.image.src}
              alt={slide.title}
              className="w-full h-full object-cover"
              style={{ 
                display: 'block',
                visibility: 'visible',
                opacity: 1,
                position: 'absolute',
                inset: 0,
              }}
              onLoad={() => console.log('✅ Local image loaded:', slide.title)}
              onError={(e) => console.error('❌ Local image failed:', slide.title, e.target.src)}
            />
          )}

          {/* Dark overlay for text contrast */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" style={{ zIndex: 15 }} />
          )}
          </div>
        )
        })}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center" style={{ zIndex: 20 }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
              {currentSlide.title}
            </h1>
            <p className="text-sm text-white/95 mb-8 drop-shadow-lg">
              {currentSlide.description}
            </p>
            <Link href="/category/products">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#7C2A47] hover:bg-[#6a243d] text-white font-semibold rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95">
                SHOP NOW
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all duration-300"
            style={{ zIndex: 30 }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={28} className="text-white" strokeWidth={2.5} />
          </button>

          {/* Next Button */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all duration-300"
            style={{ zIndex: 30 }}
            aria-label="Next slide"
          >
            <ChevronRight size={28} className="text-white" strokeWidth={2.5} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 30 }}>
            {slides.map((slide, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-10 h-3 bg-white'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
