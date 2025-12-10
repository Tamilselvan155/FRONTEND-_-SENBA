'use client'

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductHelpBanner() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-[#7C2A47] via-[#8B3A5A] to-[#7C2A47] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative z-10 px-5 sm:px-7 md:px-9 lg:px-12 py-7 sm:py-9 md:py-11">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-7 lg:gap-10">
              {/* Left Section - Icon and Content */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7 text-center sm:text-left flex-1">
                {/* Icon Container */}
                <div className="flex-shrink-0">
                  <div className="relative w-18 h-18 sm:w-22 sm:h-22 md:w-28 md:h-28 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 sm:p-5 border-2 border-white/40 shadow-xl">
                    <Image 
                      src={assets.productHelpBanner} 
                      alt="Help Icon" 
                      width={72}
                      height={72}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 leading-tight tracking-tight drop-shadow-lg">
                    Need help deciding on the right products?
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed max-w-2xl font-semibold drop-shadow-md">
                    Try our product selection guide to help you in your decision making
                  </p>
                </div>
              </div>

              {/* Right Section - CTA Button */}
              <div className="flex-shrink-0">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-white text-[#7C2A47] text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl px-7 sm:px-9 md:px-12 py-3.5 sm:py-4 md:py-5 flex items-center justify-center gap-2.5 sm:gap-3 shadow-2xl hover:shadow-3xl transition-all duration-300 whitespace-nowrap min-h-[52px]"
                  >
                    <span>Start Now</span>
                    <ArrowRight 
                      size={20} 
                      className="sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1.5" 
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
