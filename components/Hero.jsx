'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from "next/link";
import { motion } from 'framer-motion'

const Hero = () => {
  // Single hero content data
  const heroContent = {
    image: assets.banner2,
    title: "Your Solution for Consistent and Efficient Pumping",
    subtitle: "Built for performance and durability",
    cta: "Explore Products"
  };

  return (
    <section className='bg-white relative overflow-hidden'>
      {/* Hero Banner Section - Full Width with Viewport-Based Height */}
      <div className='w-full relative'>
        <div className="relative w-full overflow-hidden">
          {/* Hero Image Container with Viewport Height */}
          <div
            className="relative w-full h-[400px] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh]"
            style={{ 
              position: 'relative', 
              zIndex: 1,
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              minHeight: '400px'
            }}
          >
            {/* Background Image Layer - Full Image Display */}
            <Image
              src={heroContent.image}
              alt={heroContent.title}
              fill
              priority
              className="object-cover"
              style={{ 
                willChange: 'auto',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                objectPosition: 'center center'
              }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            />
            
            {/* Professional Gradient Overlay - Middle Layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 pointer-events-none" style={{ zIndex: 1 }}></div>
            
            {/* Content Container - Top Layer */}
            <div className="absolute inset-0 w-full" style={{ zIndex: 10, position: 'relative' }}>
              <div className="h-full flex flex-col justify-start items-start relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-8 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28" style={{ zIndex: 11 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="max-w-full sm:max-w-xl md:max-w-2xl text-black relative mt-16 sm:mt-12 md:mt-16 lg:mt-20"
                  style={{ 
                    zIndex: 12, 
                    position: 'relative',
                    willChange: 'auto',
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
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight tracking-tight text-black relative text-left font-sans"
                    style={{ 
                      zIndex: 13,
                      position: 'relative',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                    }}
                  >
                    {heroContent.title}
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.25, 
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                    className="text-xs sm:text-sm md:text-base lg:text-lg text-black mb-4 sm:mb-5 md:mb-6 max-w-full sm:max-w-xl leading-relaxed relative text-left font-medium"
                    style={{ 
                      zIndex: 13,
                      position: 'relative'
                    }}
                  >
                    {heroContent.subtitle}
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.4, 
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                    className="relative flex justify-start mt-3 sm:mt-4"
                    style={{ zIndex: 13, position: 'relative' }}
                  >
                    <Link href="/category/products">
                      <motion.button 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group bg-[#7C2A47] hover:bg-[#7C2A47]/90 active:bg-[#7C2A47]/80 text-white px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-bold transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl relative touch-manipulation"
                        style={{ zIndex: 14, position: 'relative', minHeight: '48px' }}
                      >
                        <span>{heroContent.cta}</span>
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
          </div>
        </div>
      </div>

    </section>
  )
}

export default Hero
