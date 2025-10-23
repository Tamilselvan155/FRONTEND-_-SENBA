'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { assets } from '@/assets/assets'
import Title from './Title'

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

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15, // delay between each card
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

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
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={containerVariants}
      className="px-4 mt-10 mb-10 max-w-7xl mx-auto overflow-x-hidden scrollbar-hide"
    >
      <Title
        title={`Precision Engineering For a Better World`}
        href={`/category/products`}
      />

      {/* --- Mobile Carousel (below md: 768px) --- */}
      <div className="md:hidden relative flex items-center justify-between w-full">
        <button
          onClick={handleMobilePrev}
          disabled={mobileIndex === 0}
          className={`absolute left-0.5 top-[42%] -translate-y-1/2 p-3 rounded-full z-10 -ml-6 ${
            mobileIndex === 0 ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-200'
          }`}
        >
          <ChevronLeft className="h-8 w-8 text-gray-700" />
        </button>

        <div className="overflow-x-auto w-full snap-x snap-mandatory scrollbar-hide touch-pan-y touch-pan-x">
          <motion.div
            className="flex transition-transform duration-500 ease-in-out mt-5"
            style={{ transform: `translateX(-${mobileIndex * (100 / itemsPerPageMobile)}%)` }}
            variants={containerVariants}
          >
            {applications.map((app, index) => (
              <motion.div
                key={index}
                className="group flex-shrink-0 w-1/2 px-4 flex flex-col items-center snap-start"
                variants={itemVariants}
              >
                {/* <div className="bg-[#F5F5F5] h-36 w-36 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    className="scale-110 group-hover:scale-115 transition duration-300"
                    src={app.src}
                    alt={app.label}
                    width={144}
                    height={144}
                  />
                </div> */}
                <div className="bg-[#F5F5F5] h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40 rounded-full flex items-center justify-center overflow-hidden"

                >
                        <Image
                          src={app.src}
                          alt={app.label}
                          width={160}
                          height={160}
                          className="scale-110 group-hover:scale-115 transition duration-300"
                        />
                      </div>

                <p className="text-center mt-5 text-[15px] font-medium text-slate-800">{app.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <button
          onClick={handleMobileNext}
          disabled={mobileIndex + itemsPerPageMobile >= applications.length}
          className={`absolute right-0.5 top-[42%] -translate-y-1/2 p-3 rounded-full z-10 -mr-6 ${
            mobileIndex + itemsPerPageMobile >= applications.length
              ? 'opacity-40 pointer-events-none'
              : 'hover:bg-gray-200'
          }`}
        >
          <ChevronRight className="h-8 w-8 text-gray-700" />
        </button>
      </div>

      {/* --- Tablet Carousel (md: 768px to lg: 1023px) --- */}
      <div className="hidden md:block lg:hidden relative flex items-center justify-between w-full">
        <button
          onClick={handleTabletPrev}
          disabled={tabletIndex === 0}
          className={`absolute -left-1 top-[43%] -translate-y-1/2 p-3 rounded-full z-10 ${
            tabletIndex === 0 ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-200'
          }`}
        >
          <ChevronLeft className="h-8 w-8 text-gray-700" />
        </button>

        <div className="overflow-x-auto w-full snap-x snap-mandatory scrollbar-hide touch-pan-y touch-pan-x">
          <motion.div
            className="flex transition-transform duration-500 ease-in-out mt-5"
            style={{ transform: `translateX(-${tabletIndex * (100 / itemsPerPageTablet)}%)` }}
            variants={containerVariants}
          >
            {applications.map((app, index) => (
              <motion.div
                key={index}
                className="group flex-shrink-0 w-1/3 px-4 flex flex-col items-center snap-start"
                variants={itemVariants}
              >
                <div className="bg-[#F5F5F5] h-40 w-40 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    className="scale-110 group-hover:scale-115 transition duration-300"
                    src={app.src}
                    alt={app.label}
                    width={160}
                    height={160}
                  />
                </div>
                <p className=" text-center mt-2 font-medium text-lg text-slate-800">{app.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <button
          onClick={handleTabletNext}
          disabled={tabletIndex + itemsPerPageTablet >= applications.length}
          className={`absolute -right-1 top-[43%] -translate-y-1/2 p-3 rounded-full z-10 ${
            tabletIndex + itemsPerPageTablet >= applications.length
              ? 'opacity-40 pointer-events-none'
              : 'hover:bg-gray-200'
          }`}
        >
          <ChevronRight className="h-8 w-8 text-gray-700" />
        </button>
      </div>

      {/* --- Desktop Grid (lg: 1024px and above) --- */}
      <motion.div
        className="hidden lg:grid mt-12 grid-cols-5 gap-12 justify-between max-w-7xl mx-auto scrollbar-hide"
        variants={containerVariants}
      >
        {applications.map((app, index) => (
          <motion.div
            key={index}
            className="group flex flex-col items-center"
            variants={itemVariants}
          >
            <div className="bg-[#F5F5F5] h-32 w-32 sm:h-50 sm:w-50 cursor-pointer hover:shadow-[15px_-15px_0_#f48638] flex items-center justify-center overflow-hidden">
              <Image
                className="scale-110 group-hover:scale-115 transition duration-300"
                src={app.src}
                alt={app.label}
                width={200}
                height={200}
              />
            </div>
            <p className="font-medium text-center mt-2 text-lg text-slate-800">
              {app.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
