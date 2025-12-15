// 'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon, ChevronLeft, ChevronRight } from 'lucide-react'

// ✅ IMPORT IMAGES DIRECTLY FROM assets
import banner1 from '@/assets/banner1.jpg'
import banner2 from '@/assets/banner2.jpg'
import banner3 from '@/assets/banner3.jpg'

const Hero = () => {
  const heroSlides = [
    {
      image: banner1,
      title: 'WINTER SALE!',
      subtitle: 'Christmas gift ideas at unbeatable prices',
      cta: 'SHOP NOW',
    },
    {
      image: banner2,
      title: 'Premium Quality Pumps for Every Need',
      subtitle: 'Reliable solutions for industrial and residential use',
      cta: 'SHOP NOW',
    },
    {
      image: banner3,
      title: 'Advanced Technology Meets Durability',
      subtitle: 'Engineered for excellence in every application',
      cta: 'SHOP NOW',
    },
    // {
    //   image: banner,
    //   title: 'Trusted by Professionals Worldwide',
    //   subtitle: 'Leading the industry with innovative solutions',
    //   cta: 'SHOP NOW',
    // },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, heroSlides.length])

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index)
    pauseAutoPlay()
  }, [])

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    pauseAutoPlay()
  }, [heroSlides.length])

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    pauseAutoPlay()
  }, [heroSlides.length])

  const current = heroSlides[currentSlide]

  return (
    <section className="relative w-full overflow-hidden bg-gray-100">
      <div
        className="relative w-full h-[500px] sm:h-[600px] lg:h-[80vh]"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* 🔹 Background Images */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* 🔹 Content */}
        <div className="absolute inset-0 flex flex-col lg:flex-row z-10">
          {/* Left Section */}
          <div className="relative w-full lg:w-[45%] h-[300px] sm:h-[400px] lg:h-full">
            <div className="absolute inset-0 bg-red-600/75" />
            <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 xl:px-16 text-white">
              <h1 className="text-4xl sm:text-5xl xl:text-7xl font-bold uppercase mb-6">
                {current.title}
              </h1>
              <p className="text-lg sm:text-xl xl:text-2xl mb-8">
                {current.subtitle}
              </p>
              <Link href="/category/products">
                <button className="group bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-bold flex items-center gap-3 transition">
                  {current.cta}
                  <ArrowRightIcon className="group-hover:translate-x-1 transition" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Section (image visible behind) */}
          <div className="w-full lg:w-[55%]" />
        </div>

        {/* 🔹 Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition ${
                i === currentSlide
                  ? 'w-3 h-3 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>

        {/* 🔹 Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full z-20"
        >
          <ChevronLeft className="text-white" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full z-20"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>
    </section>
  )
}

export default Hero
