// 'use client'

// import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import Link from 'next/link'
// import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
// import { fetchBannersAsync } from '@/lib/features/banner/bannerSlice'

// // Import local fallback images
// import banner1 from '@/assets/banner1.jpg'
// import banner2 from '@/assets/banner2.jpg'
// import banner3 from '@/assets/banner3.jpg'

// export default function Hero() {
//   const dispatch = useDispatch()
//   const { banners, loading } = useSelector((state) => state.banner)
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [slides, setSlides] = useState([])
//   const [failedImages, setFailedImages] = useState(new Set())
//   const [loadedImages, setLoadedImages] = useState(new Set())
//   const isInitialized = useRef(false)
//   const hasHadBackendBanners = useRef(false)
//   const lastBackendSlides = useRef([])

//   useEffect(() => {
//     dispatch(fetchBannersAsync())
//   }, [dispatch])

//   // Memoize processed banners to prevent unnecessary recalculations
//   const processedBanners = useMemo(() => {
//     if (!banners || banners.length === 0) return []
    
//     const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    
//     const result = banners
//       .filter((b) => b.status === 'active')
//       .map((b) => {
//         let imageUrl = ''
//         let photo = b.photo || ''
        
//         // Remove /api/ prefix if present (legacy issue)
//         if (photo.includes('/api/uploads/')) {
//           photo = photo.replace('/api/uploads/', '/uploads/')
//         }
        
//         if (photo.startsWith('http://') || photo.startsWith('https://')) {
//           imageUrl = photo
//         } else if (photo.startsWith('/uploads/')) {
//           imageUrl = `${baseUrl}${photo}`
//         } else if (photo.startsWith('uploads/')) {
//           imageUrl = `${baseUrl}/${photo}`
//         } else if (photo && photo.trim() !== '') {
//           const filename = photo.split('/').pop()
//           imageUrl = `${baseUrl}/uploads/banners/${filename}`
//         }
        
//         if (!imageUrl || imageUrl.trim() === '') {
//           return null
//         }
        
//         return {
//           id: String(b.id || b._id),
//           image: imageUrl,
//           title: b.title || 'Welcome',
//           description: b.description || 'Explore our products',
//           isBackend: true,
//         }
//       })
//       .filter(Boolean)
//     return result
//   }, [banners])

//   // Stable fallback slides
//   const fallbackSlides = useMemo(() => [
//         {
//           id: '1',
//           image: banner1,
//           title: 'Premium Quality Pumps',
//           description: 'Reliable solutions for industrial use',
//           isBackend: false,
//         },
//         {
//           id: '2',
//           image: banner2,
//           title: 'Advanced Technology',
//           description: 'Engineered for excellence',
//           isBackend: false,
//         },
//         {
//           id: '3',
//           image: banner3,
//           title: 'Best Service',
//           description: 'We are here to help you',
//           isBackend: false,
//         },
//   ], [])

//   // Update slides only when banners actually change
//   useEffect(() => {
//     if (processedBanners.length > 0) {
//       setSlides(prevSlides => {
//         // Check if slides actually changed by comparing IDs
//         const prevIds = new Set(prevSlides.map(s => s.id))
//         const newIds = new Set(processedBanners.map(s => s.id))
//         const idsChanged = prevIds.size !== newIds.size || 
//           !Array.from(prevIds).every(id => newIds.has(id))
        
//         // Only update if IDs actually changed
//         if (idsChanged) {
//           // Only reset loaded/failed images if we're reinitializing
//           if (isInitialized.current) {
//             setLoadedImages(new Set())
//             setFailedImages(new Set())
//     }
//           isInitialized.current = true
//           hasHadBackendBanners.current = true
//           lastBackendSlides.current = processedBanners
//           return processedBanners
//         }
//         // Return previous slides if nothing changed
//         return prevSlides
//       })
//     } else if (!loading && processedBanners.length === 0) {
//       // Only set fallback if we've never had backend banners before
//       // If we've had backend banners, don't switch to fallback (wait for banners to return)
//       setSlides(prevSlides => {
//         // If we've had backend banners before, never switch to fallback - keep existing slides or use last known backend slides
//         if (hasHadBackendBanners.current) {
//           // Keep existing slides if they exist, otherwise use last known backend slides (don't set fallback)
//           return prevSlides.length > 0 ? prevSlides : lastBackendSlides.current
//         }
//         // Only set fallback if we've never had backend banners and have no slides
//         if (prevSlides.length === 0) {
//           setLoadedImages(new Set(['1', '2', '3']))
//           isInitialized.current = true
//           return fallbackSlides
//         }
//         // Keep existing slides if they exist
//         return prevSlides
//       })
//     }
//   }, [processedBanners, loading, fallbackSlides])

//   // Auto-advance carousel
//   useEffect(() => {
//     if (slides.length <= 1) return
    
//     const timer = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % slides.length)
//     }, 5000)
    
//     return () => clearInterval(timer)
//   }, [slides.length])

//   // Reset currentIndex if it's out of bounds - only when slides change
//   useEffect(() => {
//     if (slides.length > 0) {
//       if (currentIndex >= slides.length) {
//         setCurrentIndex(0)
//       }
//     } else {
//       // If slides become empty, reset to 0
//       setCurrentIndex(0)
//     }
//   }, [slides.length, currentIndex])


//   // Show loading state only if we truly have no slides and banners are loading
//   if (slides.length === 0 && loading) {
//     return (
//       <section className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] bg-gray-800 flex items-center justify-center">
//         <div className="text-white text-xl">Loading banners...</div>
//       </section>
//     )
//   }

//   // If no slides after loading, show fallback immediately
//   if (slides.length === 0) {
//     return (
//       <section className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] bg-gray-900 flex items-center justify-center">
//         <div className="text-white text-xl">No banners available</div>
//       </section>
//     )
//   }

//   const currentSlide = slides[currentIndex]

//   return (
//     <section className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] overflow-hidden bg-gray-900">
//       {/* Carousel Images Container */}
//       <div className="absolute inset-0 w-full h-full bg-gray-900">
//         {slides.map((slide, index) => {
//           const isActive = index === currentIndex
//           const imageFailed = failedImages.has(slide.id)
          
//           // Determine image source
//           let imageSrc = ''
//           if (slide.isBackend) {
//             if (imageFailed) {
//               // Use fallback image if backend image failed
//               imageSrc = typeof banner1 === 'string' ? banner1 : banner1.src
//             } else {
//               // Use backend image URL
//               imageSrc = slide.image || ''
//             }
//           } else {
//             // Local images
//             imageSrc = typeof slide.image === 'string' ? slide.image : (slide.image?.src || '')
//           }
          
//           // Ensure we have a valid image source
//           if (!imageSrc && slide.isBackend) {
//             // If backend image is missing, use fallback
//             imageSrc = typeof banner1 === 'string' ? banner1 : banner1.src
//           }
          
//           return (
//           <div
//               key={`banner-${slide.id}-${index}`}
//               className="absolute inset-0 w-full h-full"
//             style={{
//               opacity: isActive ? 1 : 0,
//               zIndex: isActive ? 10 : 1,
//               pointerEvents: isActive ? 'auto' : 'none',
//                 transition: 'opacity 0.6s ease-in-out',
//             }}
//           >
//               {imageSrc ? (
//               <img
//                   src={imageSrc}
//                 alt={slide.title}
//                 className="w-full h-full object-cover"
//                 style={{ 
//                   display: 'block',
//                   position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '100%',
//                     objectFit: 'cover',
//                     minHeight: '100%',
//                     minWidth: '100%',
//                 }}
//                   loading={index === 0 || index === currentIndex ? 'eager' : 'lazy'}
//                   crossOrigin="anonymous"
//                   onLoad={() => {
//                     setLoadedImages(prev => {
//                       if (!prev.has(slide.id)) {
//                         return new Set(prev).add(slide.id)
//                       }
//                       return prev
//                     })
//                   }}
//                 onError={(e) => {
//                     if (!imageFailed && slide.isBackend) {
//                   setFailedImages(prev => new Set(prev).add(slide.id))
//                       // Try fallback image
//                       const fallbackSrc = typeof banner1 === 'string' ? banner1 : banner1.src
//                       if (e.target.src !== fallbackSrc) {
//                         e.target.src = fallbackSrc
//                         e.target.onerror = null // Prevent infinite loop
//                       }
//                     }
//                   }}
//                 />
//               ) : (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
//                   <p>No image available</p>
//                 </div>
//           )}

//           {/* Dark overlay for text contrast */}
//           {isActive && (
//                 <div 
//                   className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" 
//                   style={{ zIndex: 1 }} 
//                 />
//           )}
//           </div>
//         )
//         })}
//       </div>

//       {/* Content Overlay */}
//       <div className="absolute inset-0 flex items-center" style={{ zIndex: 20 }}>
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-2xl">
//             <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
//               {currentSlide.title}
//             </h1>
//             <p className="text-sm text-white/95 mb-8 drop-shadow-lg">
//               {currentSlide.description}
//             </p>
//             <Link href="/category/products">
//               <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#7C2A47] hover:bg-[#6a243d] text-white font-semibold rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95">
//                 SHOP NOW
//                 <ArrowRight size={20} />
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Controls */}
//       {slides.length > 1 && (
//         <>
//           {/* Previous Button */}
//           <button
//             onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
//             className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all duration-300"
//             style={{ zIndex: 30 }}
//             aria-label="Previous slide"
//           >
//             <ChevronLeft size={28} className="text-white" strokeWidth={2.5} />
//           </button>

//           {/* Next Button */}
//           <button
//             onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
//             className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all duration-300"
//             style={{ zIndex: 30 }}
//             aria-label="Next slide"
//           >
//             <ChevronRight size={28} className="text-white" strokeWidth={2.5} />
//           </button>

//           {/* Dots Indicator */}
//           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 30 }}>
//             {slides.map((slide, index) => (
//               <button
//                 key={`dot-${index}`}
//                 onClick={() => setCurrentIndex(index)}
//                 className={`rounded-full transition-all duration-300 ${
//                   index === currentIndex
//                     ? 'w-10 h-3 bg-white'
//                     : 'w-3 h-3 bg-white/50 hover:bg-white/75'
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </section>
//   )
// }

'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React,{useState,useEffect, useCallback, useMemo} from 'react'
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

  // Fallback static slides
  const fallbackSlides = [
    {
      image: assets.banner1,
      title: "Your Solution for Consistent and Efficient Pumping",
      subtitle: "Built for performance and durability",
      cta: "Explore Products"
    },
    {
      image: assets.banner2,
      title: "Engineered for Durability and Long Working Hours",
      subtitle: "Save more with our advanced motor technology",
      cta: "Shop Now"
    },
    {
      image: assets.banner3,
      title: "Delivers Consistent Performance Under Heavy-Duty Operations",
      subtitle: "Engineered for industrial and domestic use",
      cta: "View Collection"
    },
  ];

  // Process backend banners and create slides
  const processedBannerSlides = useMemo(() => {
    if (!banners || banners.length === 0) return []
    
    return banners
      .filter((b) => b.status === 'active')
      .map((b) => {
        const imageUrl = getImageUrl(b.photo)
        if (!imageUrl) return null
        
        return {
          image: imageUrl,
          title: b.title || 'Welcome',
          subtitle: b.description || 'Explore our products',
          cta: 'Shop Now'
        }
      })
      .filter(Boolean)
  }, [banners])

  // Use backend banners if available, otherwise use fallback
  const slides = useMemo(() => {
    return processedBannerSlides.length > 0 ? processedBannerSlides : fallbackSlides
  }, [processedBannerSlides, fallbackSlides])
  
  // Fetch banners on mount
  useEffect(() => {
    dispatch(fetchBannersAsync())
  }, [dispatch])

  // Set mounted flag to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset current index when slides change
  useEffect(() => {
    if (slides.length > 0 && current >= slides.length) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  // Auto slide every 5 seconds - only after mount and when not hovered
  useEffect(() => {
    if (!mounted || isHovered) return;
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
          <div className="text-white text-xl">Loading banners...</div>
        </div>
      </section>
    )
  }

    return (
        <section className='bg-white relative overflow-hidden' style={{ isolation: 'isolate' }}>
            {/* Hero Banner Section - Full Width with Professional Design */}
            <div 
                className='w-full relative'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ isolation: 'isolate' }}
            >
                <div className="relative w-full overflow-hidden" style={{ isolation: 'isolate' }}>
                    {/* Slide Images with Smooth Transitions */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px]"
                            style={{ position: 'relative', zIndex: 1, isolation: 'isolate' }}
                        >
                            {/* Background Image Layer - Bottom Layer */}
                            {(() => {
                              const currentSlide = mounted ? slides[current] : slides[0]
                              // Handle both local asset objects and external URL strings
                              const imageSrc = typeof currentSlide.image === 'string' 
                                ? currentSlide.image 
                                : (currentSlide.image?.src || currentSlide.image)
                              
                              return (
                                <Image
                                  src={imageSrc}
                                  alt={currentSlide.title}
                                  fill
                                  priority
                                  className="object-cover"
                                  unoptimized={typeof imageSrc === 'string' && imageSrc.startsWith('http')}
                                  style={{ 
                                    position: 'absolute',
                                    willChange: 'auto'
                                  }}
                                />
                              )
                            })()}
                            
                            {/* Professional Gradient Overlay - Middle Layer */}
                            <div 
                                className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20 pointer-events-none" 
                                style={{ 
                                    zIndex: 1, 
                                    position: 'absolute',
                                    willChange: 'auto',
                                    transform: 'translateZ(0)'
                                }}
                            ></div>
                            
                            {/* Content Container - Top Layer */}
                            <div 
                                className="absolute inset-0 max-w-7xl mx-auto" 
                                style={{ zIndex: 10, position: 'absolute' }}
                            >
                                <div 
                                    className="h-full flex flex-col justify-center items-start pl-14 sm:pl-20 md:pl-24 lg:pl-28 xl:pl-32 pr-4 sm:pr-6 md:pr-8" 
                                    style={{ position: 'relative', zIndex: 11 }}
                                >
                                    <motion.div
                                        key={`content-${current}`}
                                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                                        transition={{ 
                                            duration: 0.6, 
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                            staggerChildren: 0.15
                                        }}
                                        className="max-w-full sm:max-w-xl md:max-w-2xl text-white w-full"
                                        style={{ 
                                            position: 'relative',
                                            zIndex: 12
                                        }}
                                    >
                                        <motion.h1 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ 
                                                delay: 0.1, 
                                                duration: 0.6,
                                                ease: "easeOut"
                                            }}
                                            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-5 leading-tight tracking-tight text-white drop-shadow-2xl text-left"
                                            style={{ 
                                                textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                                                position: 'relative'
                                            }}
                                        >
                                            {mounted ? slides[current].title : slides[0].title}
                                        </motion.h1>
                                        
                                        <motion.p 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ 
                                                delay: 0.25, 
                                                duration: 0.6,
                                                ease: "easeOut"
                                            }}
                                            className="text-xs sm:text-sm md:text-base lg:text-lg text-white mb-5 sm:mb-6 md:mb-7 max-w-full sm:max-w-lg leading-relaxed drop-shadow-lg text-left"
                                            style={{ 
                                                textShadow: '1px 1px 6px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
                                                position: 'relative'
                                            }}
                                        >
                                            {mounted ? slides[current].subtitle : slides[0].subtitle}
                                        </motion.p>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ 
                                                delay: 0.4, 
                                                duration: 0.5,
                                                ease: "easeOut"
                                            }}
                                            className="flex justify-start mt-1"
                                            style={{ position: 'relative' }}
                                        >
                                            <Link href="/category/products">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="group bg-[#7C2A47] hover:bg-[#7C2A47]/90 active:bg-[#7C2A47]/80 text-white px-3 py-1.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-md sm:rounded-lg md:rounded-xl text-[11px] sm:text-sm md:text-base font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-3 shadow-xl hover:shadow-2xl touch-manipulation"
                                                    style={{ position: 'relative', minHeight: '36px' }}
                                                >
                                                    <span>{mounted ? slides[current].cta : slides[0].cta}</span>
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

                            {/* Navigation Arrows - Responsive */}
                            {mounted && (
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

                            {/* Professional Navigation Dots - Bottom Center */}
                            {mounted && (
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