'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const PromotionalBanners = () => {
  const banners = [
    {
      id: 1,
      title: 'WINTER SALE!',
      subtitle: 'Christmas gift ideas at unbeatable prices',
      cta: 'SHOP NOW',
      href: '/category/products',
      gradient: 'from-[#7C2A47] via-[#8B3A5A] to-[#7C2A47]',
      textColor: 'text-white'
    },
    {
      id: 2,
      title: 'KEEP WARM THIS WINTER!',
      subtitle: 'Explore our range of Workshop Heaters',
      cta: 'SHOP NOW',
      href: '/category/products',
      gradient: 'from-[#E6A02A] via-[#F4B84A] to-[#E6A02A]',
      textColor: 'text-white'
    },
    {
      id: 3,
      title: 'NEW ARRIVALS',
      subtitle: 'Latest products in stock now!',
      cta: 'SHOP NOW',
      href: '/category/products',
      gradient: 'from-gray-800 via-gray-700 to-gray-800',
      textColor: 'text-white'
    }
  ]

  return (
    <section className="w-full bg-gray-50 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <Link href={banner.href} className="block h-full">
                <div className={`bg-gradient-to-r ${banner.gradient} p-6 sm:p-8 lg:p-10 min-h-[180px] sm:min-h-[200px] lg:min-h-[220px] flex flex-col justify-between relative overflow-hidden`}>
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className={`${banner.textColor} text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 leading-tight`}>
                      {banner.title}
                    </h3>
                    <p className={`${banner.textColor} text-sm sm:text-base lg:text-lg opacity-90 mb-4 sm:mb-6`}>
                      {banner.subtitle}
                    </p>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center gap-2 ${banner.textColor} font-semibold text-sm sm:text-base group-hover:gap-3 transition-all`}>
                      <span>{banner.cta}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PromotionalBanners

