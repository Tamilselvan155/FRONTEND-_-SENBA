'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { assets } from '@/assets/assets'
import { motion } from 'framer-motion'

const applications = [
  { label: 'Agriculture', src: assets.agri },
  { label: 'Building Services', src: assets.build },
  { label: 'Waste Water Solutions', src: assets.wastewater },
  { label: 'Solar Pumps', src: assets.solar },
  { label: 'Domastic Pumps', src: assets.home },
]

const itemsPerPageMobile = 2
const itemsPerPageTablet = 3
const itemsPerPageDesktop = 5

export default function PumpApplications() {
  const [mobileIndex, setMobileIndex] = useState(0)
  const [tabletIndex, setTabletIndex] = useState(0)

  const handleMobileNext = () => {
    if (mobileIndex + itemsPerPageMobile < applications.length) {
      setMobileIndex(mobileIndex + itemsPerPageMobile)
    }
  }

  const handleMobilePrev = () => {
    if (mobileIndex - itemsPerPageMobile >= 0) {
      setMobileIndex(mobileIndex - itemsPerPageMobile)
    }
  }

  const handleTabletNext = () => {
    if (tabletIndex + itemsPerPageTablet < applications.length) {
      setTabletIndex(tabletIndex + itemsPerPageTablet)
    }
  }

  const handleTabletPrev = () => {
    if (tabletIndex - itemsPerPageTablet >= 0) {
      setTabletIndex(tabletIndex - itemsPerPageTablet)
    }
  }

  return (
    <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 bg-white">
      {/* Custom Header Layout */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Precision Engineering For a Better World
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Discover our range of innovative solutions
        </p>
        <Link
          href="/category/products"
          className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#c31e5aff] hover:text-[#a01a47ff] transition-colors duration-200 group"
        >
          <span>View All</span>
          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* --- Mobile Carousel (below md: 768px) --- */}
      <div className="md:hidden relative flex items-center justify-between w-full px-6 sm:px-8 mt-4 sm:mt-6">
        <button
          onClick={handleMobilePrev}
          disabled={mobileIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-2 sm:p-2.5 rounded-full z-20 transition-all touch-manipulation ${
            mobileIndex === 0 
              ? 'opacity-30 cursor-not-allowed' 
              : 'opacity-100 hover:bg-gray-50 active:scale-95 active:bg-gray-100'
          }`}
          aria-label="Previous items"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
        </button>

        <div className="overflow-x-auto w-full snap-x snap-mandatory scrollbar-hide touch-pan-y touch-pan-x">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-2 sm:gap-3"
            style={{ transform: `translateX(-${mobileIndex * (100 / itemsPerPageMobile)}%)` }}
          >
            {applications.map((app, index) => (
              <Link
                key={index}
                href="/category/products"
                className="group flex-shrink-0 w-1/2 flex flex-col snap-start px-1 sm:px-2"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-lg active:shadow-md transition-all duration-300 h-full"
                >
                  <div className="bg-gray-50 rounded-lg h-24 sm:h-28 md:h-32 w-full flex items-center justify-center overflow-hidden mb-2 sm:mb-3">
                    <Image
                      src={app.src}
                      alt={app.label}
                      width={100}
                      height={100}
                      className="object-contain transition-transform duration-300 group-hover:scale-110 w-auto h-auto max-w-full max-h-full"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <p className="text-center text-xs sm:text-sm font-semibold text-gray-800 leading-tight px-1">{app.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={handleMobileNext}
          disabled={mobileIndex + itemsPerPageMobile >= applications.length}
          className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-2 sm:p-2.5 rounded-full z-20 transition-all touch-manipulation ${
            mobileIndex + itemsPerPageMobile >= applications.length
              ? 'opacity-30 cursor-not-allowed'
              : 'opacity-100 hover:bg-gray-50 active:scale-95 active:bg-gray-100'
          }`}
          aria-label="Next items"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
        </button>
      </div>

      {/* --- Tablet Carousel (md: 768px to lg: 1023px) --- */}
      <div className="hidden md:block lg:hidden relative flex items-center justify-between w-full mt-6 sm:mt-8">
        <button
          onClick={handleTabletPrev}
          disabled={tabletIndex === 0}
          className={`absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-2.5 md:p-3 rounded-full z-10 transition-all touch-manipulation ${
            tabletIndex === 0 ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-50 active:scale-95 active:bg-gray-100'
          }`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
        </button>

        <div className="overflow-x-auto w-full snap-x snap-mandatory scrollbar-hide touch-pan-y touch-pan-x">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-3 md:gap-4"
            style={{ transform: `translateX(-${tabletIndex * (100 / itemsPerPageTablet)}%)` }}
          >
            {applications.map((app, index) => (
              <Link
                key={index}
                href="/category/products"
                className="group flex-shrink-0 w-1/3 flex flex-col snap-start px-1 md:px-2"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 shadow-sm hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="bg-gray-50 rounded-lg h-36 md:h-40 w-full flex items-center justify-center overflow-hidden mb-3 md:mb-4">
                    <Image
                      className="object-contain transition-transform duration-300 group-hover:scale-110 w-auto h-auto max-w-full max-h-full"
                      src={app.src}
                      alt={app.label}
                      width={130}
                      height={130}
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <p className="text-center font-semibold text-sm md:text-base text-gray-800 leading-tight">{app.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={handleTabletNext}
          disabled={tabletIndex + itemsPerPageTablet >= applications.length}
          className={`absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-2.5 md:p-3 rounded-full z-10 transition-all touch-manipulation ${
            tabletIndex + itemsPerPageTablet >= applications.length
              ? 'opacity-40 pointer-events-none'
              : 'hover:bg-gray-50 active:scale-95 active:bg-gray-100'
          }`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
        </button>
      </div>

      {/* --- Desktop Grid (lg: 1024px and above) - Myntra Style --- */}
      <div className="hidden lg:grid mt-6 sm:mt-8 grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        {applications.map((app, index) => (
          <Link
            key={index}
            href="/category/products"
            className="group"
          >
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white rounded-xl border border-gray-200 p-5 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            >
              <div className="bg-gray-50 rounded-lg h-44 lg:h-48 w-full flex items-center justify-center overflow-hidden mb-3 lg:mb-4">
                <Image
                  className="object-contain transition-transform duration-300 group-hover:scale-110 w-auto h-auto max-w-full max-h-full"
                  src={app.src}
                  alt={app.label}
                  width={150}
                  height={150}
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              <p className="font-semibold text-center text-sm lg:text-base text-gray-800 group-hover:text-[#c31e5aff] transition-colors leading-tight">
                {app.label}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  )
}
