'use client'
import React from 'react'
import { Truck, RotateCcw, Star, Shield } from 'lucide-react'

const TrustBadges = () => {
  const badges = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'On most orders over $100',
      color: 'text-[#7C2A47]',
      bgColor: 'bg-[#7C2A47]/10'
    },
    {
      icon: RotateCcw,
      title: 'No Hassle Returns',
      description: 'For peace of mind',
      color: 'text-[#7C2A47]',
      bgColor: 'bg-[#7C2A47]/10'
    },
    {
      icon: Star,
      title: 'Rated Excellent',
      description: '100,000+ happy customers',
      color: 'text-[#E6A02A]',
      bgColor: 'bg-[#E6A02A]/10'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Protecting buyers',
      color: 'text-[#7C2A47]',
      bgColor: 'bg-[#7C2A47]/10'
    }
  ]

  return (
    <section className="w-full bg-white border-b border-gray-100 py-6 sm:py-8 mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className={`${badge.bgColor} rounded-full p-3 sm:p-4 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className={`${badge.color} sm:w-6 sm:h-6 md:w-7 md:h-7`} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
                  {badge.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TrustBadges

