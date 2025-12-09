'use client'

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductHelpBanner() {
  return (
    <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-[#7C2A47] via-[#8B3A5A] to-[#7C2A47] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl"
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
              {/* Left Section - Icon and Content */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left flex-1">
                {/* Icon Container */}
                <div className="flex-shrink-0">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center p-3 sm:p-4 border-2 border-white/30 shadow-lg">
                    <Image 
                      src={assets.productHelpBanner} 
                      alt="Help Icon" 
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                    Need help deciding on the right products?
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl">
                    Try our product selection guide to help you in your decision making
                  </p>
                </div>
              </div>

              {/* Right Section - CTA Button */}
              <div className="flex-shrink-0">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-white text-[#7C2A47] text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 flex items-center justify-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 whitespace-nowrap"
                  >
                    <span>Start Now</span>
                    <ArrowRight 
                      size={18} 
                      className="sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" 
                    />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
