'use client'
import { ArrowRightIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBannersAsync } from '@/lib/features/banner/bannerSlice'
import { getImageUrl } from '@/lib/utils/imageUtils'

const Hero = () => {
  const dispatch = useDispatch()
  const { banners, loading } = useSelector((state) => state.banner)
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const preloadedRef = useRef(new Set());

  // Process backend banners and create slides
  const slides = useMemo(() => {
    if (!banners || banners.length === 0) return []
    
    return banners
      .filter((b) => b.status === 'active')
      .map((b) => {
        const imageUrl = getImageUrl(b.photo)
        if (!imageUrl) return null
        
        return {
          id: String(b.id || b._id || Math.random()),
          image: imageUrl,
          title: b.title || 'Welcome',
          subtitle: b.description || 'Explore our products',
          cta: 'Shop Now',
        }
      })
      .filter(Boolean)
  }, [banners])
  
  // Fetch banners on mount
  useEffect(() => {
    dispatch(fetchBannersAsync())
  }, [dispatch])

  // Set mounted flag to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Aggressive image preloading - load all images immediately
  useEffect(() => {
    if (!mounted || slides.length === 0 || typeof window === 'undefined') return;

    const isCrossOrigin = (url) => {
      try {
        const imgUrl = new URL(url, window.location.href);
        return imgUrl.origin !== window.location.origin;
      } catch {
        return false;
      }
    };

    // Add DNS prefetch and preconnect for cross-origin images
    if (slides.length > 0 && slides[0]?.image) {
      const imageDomain = (() => {
        try {
          const imgUrl = new URL(slides[0].image, window.location.href);
          return imgUrl.origin;
        } catch {
          return null;
        }
      })();
      
      if (imageDomain && imageDomain !== window.location.origin) {
        if (!document.querySelector(`link[rel="dns-prefetch"][href="${imageDomain}"]`)) {
          const dnsPrefetch = document.createElement('link');
          dnsPrefetch.rel = 'dns-prefetch';
          dnsPrefetch.href = imageDomain;
          document.head.appendChild(dnsPrefetch);
        }
        
        if (!document.querySelector(`link[rel="preconnect"][href="${imageDomain}"]`)) {
          const preconnect = document.createElement('link');
          preconnect.rel = 'preconnect';
          preconnect.href = imageDomain;
          preconnect.crossOrigin = 'anonymous';
          document.head.appendChild(preconnect);
        }
      }
    }

    // Preload all images immediately in parallel
    slides.forEach((slide, index) => {
      if (!slide?.image || preloadedRef.current.has(slide.id)) return;

      // First image gets high priority preload link
      if (index === 0) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = slide.image;
        link.fetchPriority = 'high';
        if ('fetchPriority' in link) {
          link.setAttribute('fetchpriority', 'high');
        }
        if (isCrossOrigin(slide.image)) {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      }

      // Preload image using Image object for immediate loading
      const img = new window.Image();
      if (isCrossOrigin(slide.image)) {
        img.crossOrigin = 'anonymous';
      }
      if (index === 0) {
        img.fetchPriority = 'high';
      }
      
      img.onload = () => {
        preloadedRef.current.add(slide.id);
        setLoadedImages(prev => new Set(prev).add(slide.id));
      };
      
      img.onerror = () => {
        // Silently handle error
        preloadedRef.current.add(slide.id);
      };
      
      // Start loading immediately
      img.src = slide.image;
      
      // Check if already cached
      if (img.complete && img.naturalWidth > 0) {
        preloadedRef.current.add(slide.id);
        setLoadedImages(prev => new Set(prev).add(slide.id));
      }
    });
  }, [mounted, slides]);

  // Reset current index when slides change
  useEffect(() => {
    if (slides.length > 0 && current >= slides.length) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  // Auto slide every 5 seconds - only after mount and when not hovered
  useEffect(() => {
    if (!mounted || isHovered || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [mounted, isHovered, slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrent(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Show loading state only if we have no slides and banners are loading
  if (slides.length === 0 && loading) {
    return (
      <section className='bg-white relative overflow-hidden'>
        <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px] bg-gray-800 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      </section>
    )
  }

  // Show empty state if no banners are available
  if (slides.length === 0) {
    return (
      <section className='bg-white relative overflow-hidden'>
        <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px] bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center px-4">
            <p className="text-xl font-semibold mb-2">No banners available</p>
            <p className="text-sm text-gray-400">Please add banners from the admin panel</p>
          </div>
        </div>
      </section>
    )
  }

  const currentSlide = mounted ? slides[current] : slides[0];
  const isFirstSlide = current === 0;
  const isImageLoaded = currentSlide ? loadedImages.has(currentSlide.id) || preloadedRef.current.has(currentSlide.id) : false;

  return (
    <section className='bg-white relative overflow-hidden' style={{ isolation: 'isolate' }}>
      {/* Hero Banner Section */}
      <div 
        className='w-full relative'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ isolation: 'isolate' }}
      >
        <div className="relative w-full overflow-hidden" style={{ isolation: 'isolate' }}>
          {/* Slide Images */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px]"
              style={{ position: 'relative', zIndex: 1 }}
            >
              {/* Background Image */}
              {currentSlide && (
                <>
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading={isFirstSlide ? "eager" : "lazy"}
                    fetchPriority={isFirstSlide ? "high" : "auto"}
                    decoding="async"
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: isImageLoaded ? 1 : 0.7,
                      transition: 'opacity 0.2s ease-in'
                    }}
                    onLoad={() => {
                      if (currentSlide) {
                        setLoadedImages(prev => new Set(prev).add(currentSlide.id));
                        preloadedRef.current.add(currentSlide.id);
                      }
                    }}
                  />
                  
                  {/* Content Container - Hidden on mobile */}
                  <div 
                    className="absolute inset-0 max-w-7xl mx-auto hidden md:block" 
                    style={{ zIndex: 10 }}
                  >
                    <div 
                      className="h-full flex flex-col justify-center items-start px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20" 
                      style={{ position: 'relative', zIndex: 11 }}
                    >
                      <motion.div
                        key={`content-${current}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ 
                          duration: 0.4, 
                          ease: "easeOut"
                        }}
                        className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl text-white space-y-3 sm:space-y-4"
                        style={{ 
                          position: 'relative',
                          zIndex: 12
                        }}
                      >
                        <motion.h1 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: 0.05, 
                            duration: 0.4,
                            ease: "easeOut"
                          }}
                          className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight text-white drop-shadow-2xl text-left"
                          style={{ 
                            textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                            lineHeight: '1.2'
                          }}
                        >
                          {currentSlide.title}
                        </motion.h1>
                        
                        <motion.p 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: 0.1, 
                            duration: 0.4,
                            ease: "easeOut"
                          }}
                          className="text-xs sm:text-sm md:text-base lg:text-lg text-white/95 max-w-full sm:max-w-lg leading-relaxed drop-shadow-lg text-left"
                          style={{ 
                            textShadow: '1px 1px 6px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
                            lineHeight: '1.6'
                          }}
                        >
                          {currentSlide.subtitle}
                        </motion.p>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: 0.15, 
                            duration: 0.3,
                            ease: "easeOut"
                          }}
                          className="flex justify-start pt-2"
                        >
                          <Link href="/category/products">
                            <motion.button 
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="group bg-[#7C2A47] hover:bg-[#7C2A47]/90 active:bg-[#7C2A47]/80 text-white px-3 py-1.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-md sm:rounded-lg md:rounded-xl text-[11px] sm:text-sm md:text-base font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-3 shadow-xl hover:shadow-2xl touch-manipulation"
                              style={{ position: 'relative', minHeight: '36px' }}
                            >
                              <span>{currentSlide.cta}</span>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ 
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                <ArrowRightIcon size={14} className="sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                              </motion.div>
                            </motion.button>
                          </Link>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Arrows */}
              {mounted && slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 group touch-manipulation z-20"
                    aria-label="Previous slide"
                    style={{ position: 'absolute', minWidth: '44px', minHeight: '44px' }}
                  >
                    <ChevronLeft size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 group touch-manipulation z-20"
                    aria-label="Next slide"
                    style={{ position: 'absolute', minWidth: '44px', minHeight: '44px' }}
                  >
                    <ChevronRight size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
                  </button>
                </>
              )}

              {/* Navigation Dots */}
              {mounted && slides.length > 1 && (
                <div 
                  className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 items-center justify-center z-20" 
                >
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`rounded-full transition-all duration-300 ${
                        current === index 
                          ? "bg-white w-8 h-2.5 shadow-lg" 
                          : "bg-white/40 hover:bg-white/60 w-2.5 h-2.5"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default Hero
