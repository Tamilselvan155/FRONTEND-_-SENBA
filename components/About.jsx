'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import WVlogo from "@/assets/YUCHII LOGO.png";

export default function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,   // Only trigger once
    threshold: 0.3       // Trigger when 30% is visible
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#3A3634]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <Image src={WVlogo} alt="Senba Pumps & Motors"  width={300} height={200} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h1 className="text-[19px] sm:text-2xl font-semibold  text-[#7C2A47] mb-4">
              About <span className="text-[#E6A02A]">Senba Pumps & Motors</span>
            </h1>
            <p className="text-[16px] sm:text-lg leading-relaxed">
              At <strong>Senba Pumps & Motors</strong>, we are committed to delivering reliable
              and energy-efficient pumping solutions for all your industrial and domestic needs.
              With decades of experience and a focus on quality craftsmanship, our products stand
              for durability and trust.
            </p>

            <p className="mt-4 text-[16px] sm:text-lg leading-relaxed">
              Our mission is to empower every customer with sustainable and innovative motor
              technologies that ensure long-term performance and efficiency.
            </p>
          </motion.div>
        </div>

        {/* ✅ Statistics Section */}
        <div ref={ref} className="mt-12 grid grid-cols-1 sm:grid-cols-3 text-center sm:gap-10 gap-7">
          <div>
            <h2 className="text-[32px] sm:text-6xl font-bold text-[#7C2A47]">
              {inView && <CountUp end={5000} duration={3} />}
              <sup className="text-[#f48638]">+</sup>
            </h2>
            <p className="text-[16px] sm:text-xl mt-1 sm:mt-5  text-gray-700 tracking-wide  py-2 rounded-lg">
              Total Products
            </p>
          </div>

          <div>
            <h2 className="text-[32px] sm:text-6xl font-bold text-[#7C2A47]">
              {inView && <CountUp end={1200} duration={3} />}
              <sup className="text-[#f48638]">+</sup>
              
            </h2>
            <p className="text-[16px] sm:text-xl mt-1 sm:mt-5 text-gray-700 tracking-wide  py-2 rounded-lg">
              Exclusive Dealers
            </p>
          </div>

          <div>
            <h2 className="text-[32px] sm:text-6xl font-bold text-[#7C2A47]">
              {inView && <CountUp end={800} duration={3} />}
              <sup className="text-[#f48638]">+</sup>

            </h2>
            <p className="text-[16px] sm:text-xl mt-1 sm:mt-5  text-gray-700 tracking-wide py-2 rounded-lg">
              Pumps Sold / Day
            </p>
          </div>
        </div>
      </div>

      {/* Footer slogan section */}
      <div className="w-full flex justify-center mt-0">
        <div className="bg-[#7C2A47] text-[#F5F5F5] mb-9 mr-6 ml-6 py-2 px-4 sm:py-4 sm:px-8 text-center w-full sm:w-[1200px] rounded-lg shadow-md">
          <h2 className="text-[18px] sm:text-2xl font-semibold mb-2">
            Quality • Trust • Service
          </h2>
          <p className="text-[14px]  sm:text-xl">Driven by performance, powered by integrity.</p>
        </div>
      </div>
    </div>
  );
}
