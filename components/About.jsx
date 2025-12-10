'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import WVlogo from "@/assets/YUCHII LOGO.png";

export default function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <div className="w-full bg-white text-[#3A3634]">
      {/* Hero About Section */}
      <section className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 sm:mb-18 lg:mb-24"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
              About <span className="text-[#7C2A47]">Senba Pumps & Motors</span>
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#7C2A47] to-[#E6A02A] mx-auto rounded-full"></div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start lg:items-center">
            {/* Logo Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-start order-2 lg:order-1 w-full"
            >
              <div className="relative w-full max-w-md lg:max-w-lg mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7C2A47]/10 to-[#E6A02A]/10 rounded-3xl blur-2xl transform rotate-6"></div>
                <div className="relative bg-white p-8 sm:p-10 lg:p-12 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center">
                  <Image 
                    src={WVlogo} 
                    alt="Senba Pumps & Motors" 
                    width={400} 
                    height={300}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="order-1 lg:order-2 w-full"
            >
              <div className="space-y-7 sm:space-y-9 lg:space-y-10">
                <div className="space-y-5 sm:space-y-6">
                  <p className="text-base sm:text-lg lg:text-xl leading-[1.8] sm:leading-[1.9] text-gray-800 font-medium text-left">
                    At <strong className="text-[#7C2A47] font-bold">Senba Pumps & Motors</strong>, we are committed to delivering reliable
                    and energy-efficient pumping solutions for all your industrial and domestic needs.
                    With decades of experience and a focus on quality craftsmanship, our products stand
                    for durability and trust.
                  </p>

                  <p className="text-base sm:text-lg lg:text-xl leading-[1.8] sm:leading-[1.9] text-gray-800 font-medium text-left">
                    Our mission is to empower every customer with sustainable and innovative motor
                    technologies that ensure long-term performance and efficiency.
                  </p>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-2">
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#7C2A47]/10 flex items-center justify-center mt-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7C2A47]"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Quality Assurance</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">Rigorous testing standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#7C2A47]/10 flex items-center justify-center mt-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7C2A47]"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Energy Efficient</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">Sustainable solutions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#7C2A47]/10 flex items-center justify-center mt-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7C2A47]"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Expert Support</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">24/7 customer service</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#7C2A47]/10 flex items-center justify-center mt-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7C2A47]"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Wide Network</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">Nationwide distribution</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={statsRef} className="w-full bg-gradient-to-br from-[#7C2A47] via-[#8B3A57] to-[#7C2A47] py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 sm:mb-18 lg:mb-20"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 tracking-tight">
              Our Achievements
            </h2>
            <p className="text-white/95 text-base sm:text-lg lg:text-xl font-medium">
              Numbers that speak for our commitment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10">
            {/* Stat Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 sm:p-9 lg:p-11 xl:p-12 text-center border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 flex flex-col items-center justify-center"
            >
              <div className="mb-5 sm:mb-6">
                <h3 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-none tracking-tight">
                  {statsInView && <CountUp end={5000} duration={2.5} />}
                  <span className="text-[#E6A02A] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl ml-1.5">+</span>
                </h3>
              </div>
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white font-semibold mb-2">
                Total Products
              </p>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">Premium quality range</p>
            </motion.div>

            {/* Stat Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 sm:p-9 lg:p-11 xl:p-12 text-center border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 flex flex-col items-center justify-center"
            >
              <div className="mb-5 sm:mb-6">
                <h3 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-none tracking-tight">
                  {statsInView && <CountUp end={1200} duration={2.5} />}
                  <span className="text-[#E6A02A] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl ml-1.5">+</span>
                </h3>
              </div>
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white font-semibold mb-2">
                Exclusive Dealers
              </p>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">Trusted partners nationwide</p>
            </motion.div>

            {/* Stat Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 sm:p-9 lg:p-11 xl:p-12 text-center border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 flex flex-col items-center justify-center"
            >
              <div className="mb-5 sm:mb-6">
                <h3 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-none tracking-tight">
                  {statsInView && <CountUp end={800} duration={2.5} />}
                  <span className="text-[#E6A02A] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl ml-1.5">+</span>
                </h3>
              </div>
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white font-semibold mb-2">
                Pumps Sold / Day
              </p>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">Daily customer satisfaction</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Slogan Section */}
      <section className="w-full bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-22">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center flex flex-col items-center justify-center"
          >
            <div className="inline-flex items-center gap-4 sm:gap-5 lg:gap-6 mb-5 sm:mb-6">
              <div className="w-16 sm:w-20 lg:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#7C2A47] to-[#7C2A47]"></div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
                Quality • Trust • Service
              </h2>
              <div className="w-16 sm:w-20 lg:w-24 h-0.5 bg-gradient-to-l from-transparent via-[#7C2A47] to-[#7C2A47]"></div>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-semibold max-w-2xl mx-auto leading-relaxed">
              Driven by performance, powered by integrity.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
