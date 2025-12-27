// 'use client'
// import React, { useState, useEffect, useMemo, useRef } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchBannersAsync } from '@/lib/features/banner/bannerSlice'
// import { getImageUrl } from '@/lib/utils/imageUtils'
// import { ChevronLeft, ChevronRight } from 'lucide-react'
// import Slider from 'react-slick'
// import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'

// const Hero = () => {
//   const dispatch = useDispatch()
//   const { banners, loading } = useSelector((state) => state.banner)
//   const [mounted, setMounted] = useState(false)
//   const [imageErrors, setImageErrors] = useState(new Set())
//   const sliderRef = useRef(null)
//   const persistedSlidesRef = useRef([])

//   // Process backend banners and create slides
//   const processedBannerSlides = useMemo(() => {
//     if (banners && banners.length > 0) {
//       const newSlides = banners
//         .filter((b) => b.status === 'active')
//         .map((b) => {
//           const imageUrl = getImageUrl(b.photo)
//           if (!imageUrl) return null
          
//           return {
//             id: String(b.id || b._id || Math.random()),
//             image: imageUrl,
//             title: b.title || 'Welcome',
//             subtitle: b.description || 'Explore our products',
//             cta: 'Shop Now',
//             isBackend: true
//           }
//         })
//         .filter(Boolean)
      
//       if (newSlides.length > 0) {
//         persistedSlidesRef.current = newSlides
//       }
//     }
    
//     return persistedSlidesRef.current
//   }, [banners])

//   const slides = useMemo(() => {
//     return persistedSlidesRef.current.length > 0 
//       ? persistedSlidesRef.current 
//       : processedBannerSlides
//   }, [processedBannerSlides])

//   // Fetch banners on mount
//   useEffect(() => {
//     dispatch(fetchBannersAsync())
//   }, [dispatch])

//   // Set mounted flag
//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   // Fix aria-hidden accessibility issue for slick slider
//   useEffect(() => {
//     if (!mounted) return

//     const fixAriaHidden = () => {
//       // Use requestAnimationFrame to ensure DOM is updated
//       requestAnimationFrame(() => {
//         const slides = document.querySelectorAll('.hero-slider .slick-slide')
//         slides.forEach((slide) => {
//           const isActive = slide.classList.contains('slick-active')
//           if (isActive) {
//             // Active slides should not be hidden from screen readers
//             slide.setAttribute('aria-hidden', 'false')
//             // Remove tabindex="-1" if present to allow focus
//             if (slide.getAttribute('tabindex') === '-1') {
//               slide.removeAttribute('tabindex')
//             }
//           } else {
//             // Non-active slides can be hidden
//             slide.setAttribute('aria-hidden', 'true')
//           }
//         })
//       })
//     }

//     // Fix after a short delay to ensure slider is initialized
//     const timeout = setTimeout(fixAriaHidden, 100)
    
//     // Use MutationObserver to watch for slider changes
//     const observer = new MutationObserver(fixAriaHidden)
//     const sliderElement = document.querySelector('.hero-slider')
//     if (sliderElement) {
//       observer.observe(sliderElement, {
//         childList: true,
//         subtree: true,
//         attributes: true,
//         attributeFilter: ['class', 'aria-hidden']
//       })
//     }

//     return () => {
//       clearTimeout(timeout)
//       observer.disconnect()
//     }
//   }, [mounted, slides])

//   // Slider settings - Professional configuration
//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 600,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     pauseOnHover: true,
//     pauseOnFocus: true,
//     fade: true,
//     cssEase: 'linear',
//     arrows: true,
//     prevArrow: <CustomPrevArrow />,
//     nextArrow: <CustomNextArrow />,
//     appendDots: (dots) => (
//       <div className="custom-dots-container">
//         <ul style={{ margin: '0px', padding: '0px' }}>{dots}</ul>
//       </div>
//     ),
//     customPaging: (i) => (
//       <div className="custom-dot" />
//     ),
//     // Fix aria-hidden after slide changes
//     afterChange: (current) => {
//       // Fix aria-hidden attributes after slide change
//       setTimeout(() => {
//         const slides = document.querySelectorAll('.hero-slider .slick-slide')
//         slides.forEach((slide, index) => {
//           if (index === current) {
//             slide.setAttribute('aria-hidden', 'false')
//             if (slide.getAttribute('tabindex') === '-1') {
//               slide.removeAttribute('tabindex')
//             }
//           }
//         })
//       }, 50)
//     },
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           arrows: true,
//         }
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           arrows: true,
//         }
//       }
//     ]
//   }

//   // Show loading state
//   if (slides.length === 0 && loading) {
//     return (
//       <section className='relative overflow-hidden bg-white' style={{ zIndex: 10, position: 'relative' }}>
//         <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px] bg-gray-800 flex items-center justify-center">
//           <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
//         </div>
//       </section>
//     )
//   }

//   // Show empty state
//   if (slides.length === 0 && !loading) {
//     return (
//       <section className='relative overflow-hidden bg-white' style={{ zIndex: 10, position: 'relative' }}>
//         <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px] bg-gray-900 flex items-center justify-center">
//           <div className="text-white text-center px-4">
//             <p className="text-xl font-semibold mb-2">No banners available</p>
//             <p className="text-sm text-gray-400">Please add banners from the admin panel</p>
//           </div>
//         </div>
//       </section>
//     )
//   }

//   if (!mounted || slides.length === 0) return null

//   return (
//     <>
//       <style jsx global>{`
//         /* Professional Slick Carousel Styles */
//         .hero-slider .slick-slider {
//           position: relative;
//           height: 100%;
//         }
        
//         .hero-slider .slick-list {
//           overflow: hidden;
//           height: 100%;
//         }
        
//         .hero-slider .slick-track {
//           display: flex;
//           align-items: stretch;
//           height: 100%;
//         }
        
//         .hero-slider .slick-slide {
//           opacity: 0;
//           transition: opacity 0.6s ease-in-out;
//           height: 100%;
//         }
        
//         .hero-slider .slick-slide.slick-active {
//           opacity: 1;
//         }
        
//         /* Fix aria-hidden accessibility issue */
//         .hero-slider .slick-slide.slick-active[aria-hidden="false"],
//         .hero-slider .slick-slide.slick-active:not([aria-hidden]) {
//           /* Active slides should not be hidden from screen readers */
//         }
        
//         .hero-slider .slick-slide[aria-hidden="true"] {
//           /* Only hide non-active slides from screen readers */
//         }
        
//         .hero-slider .slick-slide > div {
//           height: 100%;
//           display: flex;
//           align-items: stretch;
//         }
        
//         .hero-slider .slick-arrow {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           z-index: 30;
//           width: 44px;
//           height: 44px;
//           background: rgba(255, 255, 255, 0.2);
//           backdrop-filter: blur(8px);
//           border: none;
//           border-radius: 50%;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.3s ease;
//         }
        
//         .hero-slider .slick-arrow:hover {
//           background: rgba(255, 255, 255, 0.3);
//           transform: translateY(-50%) scale(1.1);
//         }
        
//         .hero-slider .slick-arrow:active {
//           background: rgba(255, 255, 255, 0.4);
//         }
        
//         .hero-slider .slick-prev {
//           left: 12px;
//         }
        
//         .hero-slider .slick-next {
//           right: 12px;
//         }
        
//         .hero-slider .slick-arrow::before {
//           display: none;
//         }
        
//         .hero-slider .custom-dots-container {
//           position: absolute;
//           bottom: 24px;
//           left: 50%;
//           transform: translateX(-50%);
//           z-index: 30;
//         }
        
//         .hero-slider .slick-dots {
//           position: static;
//           display: flex;
//           gap: 10px;
//           align-items: center;
//           justify-content: center;
//         }
        
//         .hero-slider .slick-dots li {
//           width: auto;
//           height: auto;
//           margin: 0;
//         }
        
//         .hero-slider .slick-dots li button {
//           width: 10px;
//           height: 10px;
//           padding: 0;
//           border-radius: 50%;
//           background: rgba(255, 255, 255, 0.4);
//           border: none;
//           transition: all 0.3s ease;
//         }
        
//         .hero-slider .slick-dots li button::before {
//           display: none;
//         }
        
//         .hero-slider .slick-dots li.slick-active button {
//           width: 32px;
//           height: 8px;
//           border-radius: 4px;
//           background: white;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
//         }
        
//         .hero-slider .slick-slide img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           display: block;
//         }
        
//         @media (min-width: 640px) {
//           .hero-slider .slick-prev {
//             left: 16px;
//           }
          
//           .hero-slider .slick-next {
//             right: 16px;
//           }
//         }
        
//         @media (min-width: 768px) {
//           .hero-slider .slick-prev {
//             left: 24px;
//           }
          
//           .hero-slider .slick-next {
//             right: 24px;
//           }
//         }
//       `}</style>
      
//       <section 
//         className='relative overflow-hidden bg-white hero-slider' 
//         style={{ zIndex: 10, position: 'relative' }}
//       >
//         <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px]">
//           <Slider ref={sliderRef} {...sliderSettings}>
//             {slides.map((slide) => {
//               const imageSrc = slide.image
//               const isExternal = typeof imageSrc === 'string' && 
//                 (imageSrc.startsWith('http') || imageSrc.startsWith('//'))
              
//               const isCrossOrigin = typeof window !== 'undefined' && isExternal ? (() => {
//                 try {
//                   return new URL(imageSrc, window.location.href).origin !== window.location.origin
//                 } catch {
//                   return false
//                 }
//               })() : false

//               const hasError = imageErrors.has(slide.id)

//               return (
//                 <div key={slide.id}>
//                   <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px] bg-gray-800">
//                       {!hasError ? (
//                         isExternal ? (
//                           <img
//                             src={imageSrc}
//                             alt={slide.title || 'Banner'}
//                             loading="eager"
//                             fetchPriority="high"
//                             decoding="async"
//                             crossOrigin={isCrossOrigin ? "anonymous" : undefined}
//                             className="w-full h-full object-cover"
//                             style={{
//                               width: '100%',
//                               height: '100%',
//                               objectFit: 'cover',
//                               display: 'block',
//                               backgroundColor: '#1f2937'
//                             }}
//                             onError={(e) => {
//                               // Silently handle error - mark as failed
//                               setImageErrors(prev => {
//                                 const newSet = new Set(prev)
//                                 newSet.add(slide.id)
//                                 return newSet
//                               })
//                               // Hide the broken image
//                               e.target.style.display = 'none'
//                             }}
//                             onLoad={(e) => {
//                               // Ensure image is visible on successful load
//                               e.target.style.display = 'block'
//                             }}
//                           />
//                         ) : (
//                           <img
//                             src={imageSrc}
//                             alt={slide.title || 'Banner'}
//                             loading="eager"
//                             fetchPriority="high"
//                             decoding="async"
//                             className="w-full h-full object-cover"
//                             style={{
//                               width: '100%',
//                               height: '100%',
//                               objectFit: 'cover',
//                               display: 'block',
//                               backgroundColor: '#1f2937'
//                             }}
//                             onError={(e) => {
//                               // Silently handle error - mark as failed
//                               setImageErrors(prev => {
//                                 const newSet = new Set(prev)
//                                 newSet.add(slide.id)
//                                 return newSet
//                               })
//                               // Hide the broken image
//                               e.target.style.display = 'none'
//                             }}
//                             onLoad={(e) => {
//                               // Ensure image is visible on successful load
//                               e.target.style.display = 'block'
//                             }}
//                           />
//                         )
//                       ) : (
//                         // Show placeholder when image fails to load
//                         <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
//                           <div className="text-center px-4">
//                             <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-700 flex items-center justify-center">
//                               <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                               </svg>
//                             </div>
//                             <p className="text-sm text-gray-400 font-medium">Image unavailable</p>
//                             <p className="text-xs text-gray-500 mt-1">Banner image not found</p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })}
//           </Slider>
//         </div>
//       </section>
//     </>
//   )
// }

// // Custom Arrow Components
// const CustomPrevArrow = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     className="slick-arrow slick-prev"
//     aria-label="Previous slide"
//     type="button"
//   >
//     <ChevronLeft size={20} className="text-white" />
//   </button>
// )

// const CustomNextArrow = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     className="slick-arrow slick-next"
//     aria-label="Next slide"
//     type="button"
//   >
//     <ChevronRight size={20} className="text-white" />
//   </button>
// )

// export default Hero

'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBannersAsync } from '@/lib/features/banner/bannerSlice'
import { getImageUrl } from '@/lib/utils/imageUtils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const Hero = () => {
  const dispatch = useDispatch()
  const { banners, loading } = useSelector((state) => state.banner)
  const [mounted, setMounted] = useState(false)
  const [imageErrors, setImageErrors] = useState(new Set())
  const sliderRef = useRef(null)
  const persistedSlidesRef = useRef([])

  // Process backend banners and create slides
  const processedBannerSlides = useMemo(() => {
    if (banners && banners.length > 0) {
      const newSlides = banners
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
            isBackend: true
          }
        })
        .filter(Boolean)
      
      if (newSlides.length > 0) {
        persistedSlidesRef.current = newSlides
      }
    }
    
    return persistedSlidesRef.current
  }, [banners])

  const slides = useMemo(() => {
    return persistedSlidesRef.current.length > 0 
      ? persistedSlidesRef.current 
      : processedBannerSlides
  }, [processedBannerSlides])

  // Fetch banners on mount
  useEffect(() => {
    dispatch(fetchBannersAsync())
  }, [dispatch])

  // Set mounted flag
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fix aria-hidden accessibility issue for slick slider
  useEffect(() => {
    if (!mounted) return

    const fixAriaHidden = () => {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        const slides = document.querySelectorAll('.hero-slider .slick-slide')
        slides.forEach((slide) => {
          const isActive = slide.classList.contains('slick-active')
          if (isActive) {
            // Active slides should not be hidden from screen readers
            slide.setAttribute('aria-hidden', 'false')
            // Remove tabindex="-1" if present to allow focus
            if (slide.getAttribute('tabindex') === '-1') {
              slide.removeAttribute('tabindex')
            }
          } else {
            // Non-active slides can be hidden
            slide.setAttribute('aria-hidden', 'true')
          }
        })
      })
    }

    // Fix after a short delay to ensure slider is initialized
    const timeout = setTimeout(fixAriaHidden, 100)
    
    // Use MutationObserver to watch for slider changes
    const observer = new MutationObserver(fixAriaHidden)
    const sliderElement = document.querySelector('.hero-slider')
    if (sliderElement) {
      observer.observe(sliderElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-hidden']
      })
    }

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [mounted, slides])

  // Slider settings - Professional configuration
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
    fade: true,
    cssEase: 'linear',
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    appendDots: (dots) => (
      <div className="custom-dots-container">
        <ul style={{ margin: '0px', padding: '0px' }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className="custom-dot" />
    ),
    // Fix aria-hidden after slide changes
    afterChange: (current) => {
      // Fix aria-hidden attributes after slide change
      setTimeout(() => {
        const slides = document.querySelectorAll('.hero-slider .slick-slide')
        slides.forEach((slide, index) => {
          if (index === current) {
            slide.setAttribute('aria-hidden', 'false')
            if (slide.getAttribute('tabindex') === '-1') {
              slide.removeAttribute('tabindex')
            }
          }
        })
      }, 50)
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: true,
        }
      }
    ]
  }

  // Show loading state
  if (slides.length === 0 && loading) {
    return (
      <section className='relative overflow-hidden bg-white' style={{ zIndex: 10, position: 'relative' }}>
        <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px] bg-gray-800 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      </section>
    )
  }

  // Show empty state
  if (slides.length === 0 && !loading) {
    return (
      <section className='relative overflow-hidden bg-white' style={{ zIndex: 10, position: 'relative' }}>
        <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px] bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center px-4">
            <p className="text-xl font-semibold mb-2">No banners available</p>
            <p className="text-sm text-gray-400">Please add banners from the admin panel</p>
          </div>
        </div>
      </section>
    )
  }

  if (!mounted || slides.length === 0) return null

  return (
    <>
      <style jsx global>{`
        /* Professional Slick Carousel Styles */
        .hero-slider .slick-slider {
          position: relative;
          height: 100%;
        }
        
        .hero-slider .slick-list {
          overflow: hidden;
          height: 100%;
        }
        
        .hero-slider .slick-track {
          display: flex;
          align-items: stretch;
          height: 100%;
        }
        
        .hero-slider .slick-slide {
          opacity: 0;
          transition: opacity 0.6s ease-in-out;
          height: 100%;
        }
        
        .hero-slider .slick-slide.slick-active {
          opacity: 1;
        }
        
        /* Fix aria-hidden accessibility issue */
        .hero-slider .slick-slide.slick-active[aria-hidden="false"],
        .hero-slider .slick-slide.slick-active:not([aria-hidden]) {
          /* Active slides should not be hidden from screen readers */
        }
        
        .hero-slider .slick-slide[aria-hidden="true"] {
          /* Only hide non-active slides from screen readers */
        }
        
        .hero-slider .slick-slide > div {
          height: 100%;
          display: flex;
          align-items: stretch;
        }
        
        .hero-slider .slick-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 30;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .hero-slider .slick-arrow:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.1);
        }
        
        .hero-slider .slick-arrow:active {
          background: rgba(255, 255, 255, 0.4);
        }
        
        .hero-slider .slick-prev {
          left: 12px;
        }
        
        .hero-slider .slick-next {
          right: 12px;
        }
        
        .hero-slider .slick-arrow::before {
          display: none;
        }
        
        .hero-slider .custom-dots-container {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
        }
        
        .hero-slider .slick-dots {
          position: static;
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
        }
        
        .hero-slider .slick-dots li {
          width: auto;
          height: auto;
          margin: 0;
        }
        
        .hero-slider .slick-dots li button {
          width: 10px;
          height: 10px;
          padding: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          transition: all 0.3s ease;
        }
        
        .hero-slider .slick-dots li button::before {
          display: none;
        }
        
        .hero-slider .slick-dots li.slick-active button {
          width: 32px;
          height: 8px;
          border-radius: 4px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .hero-slider .slick-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        @media (min-width: 640px) {
          .hero-slider .slick-prev {
            left: 16px;
          }
          
          .hero-slider .slick-next {
            right: 16px;
          }
        }
        
        @media (min-width: 768px) {
          .hero-slider .slick-prev {
            left: 24px;
          }
          
          .hero-slider .slick-next {
            right: 24px;
          }
        }
      `}</style>
      
      <section 
        className='relative overflow-hidden bg-white hero-slider' 
        style={{ zIndex: 10, position: 'relative' }}
      >
        <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px]">
          <Slider ref={sliderRef} {...sliderSettings}>
            {slides.map((slide) => {
              const imageSrc = slide.image
              const isExternal = typeof imageSrc === 'string' && 
                (imageSrc.startsWith('http') || imageSrc.startsWith('//'))
              
              const isCrossOrigin = typeof window !== 'undefined' && isExternal ? (() => {
                try {
                  return new URL(imageSrc, window.location.href).origin !== window.location.origin
                } catch {
                  return false
                }
              })() : false

              const hasError = imageErrors.has(slide.id)

              return (
                <div key={slide.id}>
                  <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[480px] bg-gray-800">
                      {!hasError ? (
                        isExternal ? (
                          <img
                            src={imageSrc}
                            alt={slide.title || 'Banner'}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            crossOrigin={isCrossOrigin ? "anonymous" : undefined}
                            className="w-full h-full object-cover"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              backgroundColor: '#1f2937'
                            }}
                            onError={(e) => {
                              // Silently handle error - mark as failed
                              setImageErrors(prev => {
                                const newSet = new Set(prev)
                                newSet.add(slide.id)
                                return newSet
                              })
                              // Hide the broken image
                              e.target.style.display = 'none'
                            }}
                            onLoad={(e) => {
                              // Ensure image is visible on successful load
                              e.target.style.display = 'block'
                            }}
                          />
                        ) : (
                          <img
                            src={imageSrc}
                            alt={slide.title || 'Banner'}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className="w-full h-full object-cover"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              backgroundColor: '#1f2937'
                            }}
                            onError={(e) => {
                              // Silently handle error - mark as failed
                              setImageErrors(prev => {
                                const newSet = new Set(prev)
                                newSet.add(slide.id)
                                return newSet
                              })
                              // Hide the broken image
                              e.target.style.display = 'none'
                            }}
                            onLoad={(e) => {
                              // Ensure image is visible on successful load
                              e.target.style.display = 'block'
                            }}
                          />
                        )
                      ) : (
                        // Show placeholder when image fails to load
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <div className="text-center px-4">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-700 flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-400 font-medium">Image unavailable</p>
                            <p className="text-xs text-gray-500 mt-1">Banner image not found</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
          </Slider>
        </div>
      </section>
    </>
  )
}

// Custom Arrow Components
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="slick-arrow slick-prev"
    aria-label="Previous slide"
    type="button"
  >
    <ChevronLeft size={20} className="text-white" />
  </button>
)

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="slick-arrow slick-next"
    aria-label="Next slide"
    type="button"
  >
    <ChevronRight size={20} className="text-white" />
  </button>
)

export default Hero
