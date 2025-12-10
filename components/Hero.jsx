'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React,{useState,useEffect, useCallback} from 'react'
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion'

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
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
  
  // Set mounted flag to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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

    return (
        <section className='bg-white relative overflow-hidden'>
            {/* Hero Banner Section - Full Width with Professional Design */}
            <div 
                className='w-full relative'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative w-full overflow-hidden">
                    {/* Slide Images with Smooth Transitions */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] lg:h-[550px] xl:h-[600px]"
                            style={{ position: 'relative', zIndex: 1 }}
                        >
                            {/* Background Image Layer - Bottom Layer */}
        <Image
          src={mounted ? slides[current].image : slides[0].image}
          alt={mounted ? slides[current].title : slides[0].title}
                                fill
          priority
                                className="object-cover"
                            />
                            
                            {/* Professional Gradient Overlay - Middle Layer */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 pointer-events-none" style={{ zIndex: 1 }}></div>
                            
                            {/* Content Container - Top Layer */}
                            <div className="absolute inset-0 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8" style={{ zIndex: 10, position: 'relative' }}>
                                <div className="h-full flex flex-col justify-center items-start relative" style={{ zIndex: 11 }}>
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
                                        className="max-w-full sm:max-w-xl md:max-w-2xl text-white relative w-full"
                                        style={{ 
                                            zIndex: 12, 
                                            position: 'relative',
                                            willChange: 'transform, opacity',
                                            backfaceVisibility: 'hidden'
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
                                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-5 mt-16 sm:mt-20 md:mt-24 lg:mt-28 xl:mt-32 leading-tight tracking-tight text-white drop-shadow-2xl relative text-left"
                                            style={{ 
                                                textShadow: '3px 3px 10px rgba(0,0,0,0.9), 0 0 25px rgba(0,0,0,0.6)',
                                                zIndex: 13,
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
                                            className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-5 sm:mb-6 md:mb-7 max-w-full sm:max-w-xl leading-relaxed drop-shadow-lg relative text-left font-medium"
                                            style={{ 
                                                textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.6)',
                                                zIndex: 13,
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
                                            className="relative flex justify-start mt-2 sm:mt-3"
                                            style={{ zIndex: 13, position: 'relative' }}
                                        >
                                            <Link href="/category/products">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="group bg-[#7C2A47] hover:bg-[#7C2A47]/90 active:bg-[#7C2A47]/80 text-white px-6 py-3 sm:px-7 sm:py-3.5 md:px-9 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-bold transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl relative touch-manipulation"
                                                    style={{ zIndex: 14, position: 'relative', minHeight: '48px' }}
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
                                                        <ArrowRightIcon size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
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
                                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 group touch-manipulation"
                                        aria-label="Previous slide"
                                        style={{ zIndex: 15, position: 'absolute', minWidth: '44px', minHeight: '44px' }}
                                    >
                                        <ChevronLeft size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 group touch-manipulation"
                                        aria-label="Next slide"
                                        style={{ zIndex: 15, position: 'absolute', minWidth: '44px', minHeight: '44px' }}
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

            {/* Promotional Cards Section - Professional Grid Layout */}
            <div className='w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8'>
                    {/* Best Products Card */}
                    <Link href="/category/products" className="group">
                        <motion.div
                            whileHover={{ y: -6, scale: 1.02 }}
                            className='relative flex items-center justify-between bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 rounded-2xl p-5 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 border-2 border-emerald-200/80 overflow-hidden'
                        >
                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-600 rounded-full blur-2xl"></div>
                </div>

                            <div className="relative z-10 flex-1 w-full sm:w-auto">
                                <h3 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-500 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight'>
                                    Best Products
                                </h3>
                                <p className='text-sm sm:text-base md:text-lg text-emerald-800 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all leading-relaxed'>
                                    Explore Collection
                                    <ArrowRightIcon size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                                </p>
                            </div>
                            <div className="relative z-10 flex-shrink-0 sm:ml-4 self-center sm:self-auto">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl bg-white/90 p-2 sm:p-2.5 shadow-xl transition-all duration-300">
                                    <Image 
                                        className='w-full h-full object-contain' 
                                        src={assets.product_img2} 
                                        alt="Best Products" 
                                        width={96}
                                        height={96}
                                    />
                                </div>
                        </div>
                        </motion.div>
                    </Link>

                    {/* Discount Card */}
                    <Link href="/category/products" className="group">
                        <motion.div
                            whileHover={{ y: -6, scale: 1.02 }}
                            className='relative flex items-center justify-between bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-2xl p-5 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 border-2 border-blue-200/80 overflow-hidden'
                        >
                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-600 rounded-full blur-2xl"></div>
                    </div>

                            <div className="relative z-10 flex-1 w-full sm:w-auto">
                                {/* <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                        20%
                                    </span>
                                    <span className="text-xs sm:text-sm md:text-base font-semibold text-blue-700">OFF</span>
                                </div> */}
                                <h3 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight'>
                                    Special Discounts
                                </h3>
                                <p className='text-sm sm:text-base md:text-lg text-blue-800 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all leading-relaxed'>
                                    Shop Now
                                    <ArrowRightIcon size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                                </p>
                            </div>
                            <div className="relative z-10 flex-shrink-0 sm:ml-4 self-center sm:self-auto">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl bg-white/90 p-2 sm:p-2.5 shadow-xl transition-all duration-300">
                                    <Image 
                                        className='w-full h-full object-contain' 
                                        src={assets.product_img6} 
                                        alt="Discounts" 
                                        width={96}
                                        height={96}
                                    />
                        </div>
                    </div>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </section>


    )
}

export default Hero
