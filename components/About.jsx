'use client';
import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
              <span className="text-[#7C2A47]">ABOUT US</span>
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#7C2A47] to-[#E6A02A] mx-auto rounded-full"></div>
          </motion.div>

          {/* Main Content Section */}
          <div className="w-full max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full"
            >
              <div className="space-y-8 sm:space-y-10">
                {/* First Paragraph */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative pl-6 sm:pl-8 border-l-4 border-[#7C2A47] bg-white rounded-xl p-6 sm:p-8 shadow-md border-t border-r border-b border-gray-100 w-full"
                >
                  <p className="text-base leading-relaxed text-gray-800 font-medium text-left w-full break-words hyphens-auto">
                    <span className="text-[#7C2A47] font-bold">SENBA</span> offers a wide range of pumps for applications in{' '}
                    <span className="font-semibold text-gray-900">residential, agriculture, water resource management, and other industrial sectors</span>, 
                    with a strong focus on <span className="text-[#7C2A47] font-semibold">energy efficiency</span> and{' '}
                    <span className="text-[#7C2A47] font-semibold">innovative solutions</span>.
                    We are a leading <span className="text-[#7C2A47] font-bold">consumer durables & lighting brand</span> managed by{' '}
                    <span className="font-semibold text-gray-900">proficient industry experts</span>. Our commitment towards enhancing the life of every consumer with{' '}
                    <span className="text-[#7C2A47] font-semibold">modern & trustworthy solutions</span> has established us as a{' '}
                    <span className="font-bold text-gray-900">winning brand</span> in the industry. As leaders actively shaping the landscape of consumer durables,{' '}
                    <span className="text-[#7C2A47] font-bold">our mission remains steadfast</span>:
                  </p>
                </motion.div>


                {/* Key Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-4"
                >
                  <div className="flex items-start gap-4 bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#7C2A47]/30 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <div className="w-4 h-4 rounded-full bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-base">Energy Efficiency</h3>
                      <p className="text-base text-gray-700 leading-relaxed">Innovative & sustainable solutions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#7C2A47]/30 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <div className="w-4 h-4 rounded-full bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-base">Industry Experts</h3>
                      <p className="text-base text-gray-700 leading-relaxed">Proficient management team</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#7C2A47]/30 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <div className="w-4 h-4 rounded-full bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-base">Wide Applications</h3>
                      <p className="text-base text-gray-700 leading-relaxed">Residential, agriculture & industrial</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#7C2A47]/30 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#7C2A47] to-[#8B3A5A] flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <div className="w-4 h-4 rounded-full bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-base">Trusted Brand</h3>
                      <p className="text-base text-gray-700 leading-relaxed">Modern & trustworthy solutions</p>
                    </div>
                  </div>
                </motion.div>
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
            <h2 className="text-2xl sm:text-2xl lg:text-2xl font-bold text-white mb-4 tracking-tight">
              Our Achievements
            </h2>
            <p className="text-white/95 text-base font-medium">
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
                <h3 className="text-4xl sm:text-4xl lg:text-4xl font-bold text-white leading-none tracking-tight">
                  {statsInView && <CountUp end={5000} duration={2.5} />}
                  <span className="text-[#E6A02A] text-4xl ml-1.5">+</span>
                </h3>
              </div>
              <p className="text-base text-white font-semibold mb-2">
                Total Products
              </p>
              <p className="text-base text-white/90 leading-relaxed font-medium">Premium quality range</p>
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
                <h3 className="text-4xl sm:text-4xl lg:text-4xl font-bold text-white leading-none tracking-tight">
                  {statsInView && <CountUp end={1200} duration={2.5} />}
                  <span className="text-[#E6A02A] text-4xl ml-1.5">+</span>
                </h3>
              </div>
              <p className="text-base text-white font-semibold mb-2">
                Exclusive Dealers
              </p>
              <p className="text-base text-white/90 leading-relaxed font-medium">Trusted partners nationwide</p>
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
                <h3 className="text-4xl sm:text-4xl lg:text-4xl font-bold text-white leading-none tracking-tight">
                  {statsInView && <CountUp end={800} duration={2.5} />}
                  <span className="text-[#E6A02A] text-4xl ml-1.5">+</span>
                </h3>
              </div>
              <p className="text-base text-white font-semibold mb-2">
                Customers Served
              </p>
              <p className="text-base text-white/90 leading-relaxed font-medium">Daily customer satisfaction</p>
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
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
                Quality • Trust • Service
              </h2>
              <div className="w-16 sm:w-20 lg:w-24 h-0.5 bg-gradient-to-l from-transparent via-[#7C2A47] to-[#7C2A47]"></div>
            </div>
            <p className="text-base text-gray-700 font-semibold max-w-2xl mx-auto leading-relaxed">
              Driven by performance, powered by integrity.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
