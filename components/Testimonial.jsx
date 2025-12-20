'use client';
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { dummyRatingsData } from "@/assets/assets";

const Testimonial = () => {
  const [current, setCurrent] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [mounted, setMounted] = useState(false);

  // ✅ Responsive: Update visibleCards based on screen width
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 768) setVisibleCards(2);
      else if (window.innerWidth < 1024) setVisibleCards(3);
      else setVisibleCards(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxStart = useMemo(() => Math.max(0, dummyRatingsData.length - visibleCards), [visibleCards]);

  const prev = useCallback(() => {
    setCurrent((v) => Math.max(0, v - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((v) => Math.min(maxStart, v + 1));
  }, [maxStart]);

  const showing = useMemo(() => 
    dummyRatingsData.slice(current, current + visibleCards),
    [current, visibleCards]
  );

  // Reset to first card when visibleCards changes
  useEffect(() => {
    setCurrent(0);
  }, [visibleCards]);

  if (!mounted) {
    return (
      <section className="w-full py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-400">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pt-4 sm:pt-6 pb-12 sm:pb-16 md:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We value every piece of feedback — here's what our happy customers have to say!
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative px-4 sm:px-12 md:px-16">
          {/* Left Arrow */}
          <button
            className={`absolute left-0 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-50 hover:shadow-xl active:scale-95 transition-all duration-200 z-10 border border-gray-200 ${
              current === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous testimonial"
          >
            <ChevronLeft
              size={20}
              className={current === 0 ? "text-gray-400" : "text-gray-700"}
              strokeWidth={2.5}
            />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden pb-4">
            <div 
              className="flex transition-transform duration-500 ease-in-out items-stretch"
              style={{
                transform: `translateX(-${current * (100 / visibleCards)}%)`,
                gap: visibleCards === 1 ? '0px' : visibleCards === 2 ? '1rem' : visibleCards === 3 ? '1.25rem' : '1.5rem'
              }}
            >
              {dummyRatingsData.map((item) => {
                // Calculate width accounting for gaps
                const gapPx = visibleCards === 1 ? 0 : visibleCards === 2 ? 16 : visibleCards === 3 ? 20 : 24;
                const totalGaps = (visibleCards - 1) * gapPx;
                const cardWidth = visibleCards === 1 
                  ? '100%' 
                  : `calc(${100 / visibleCards}% - ${totalGaps / visibleCards}px)`;
                
                return (
                <div
                  key={item.id}
                  className="flex-shrink-0 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 p-5 sm:p-6 md:p-8 flex flex-col h-full"
                  style={{
                    width: cardWidth,
                    minWidth: cardWidth,
                    maxWidth: cardWidth
                  }}
                >
                  {/* User Image */}
                  <div className="flex justify-center mb-4 flex-shrink-0">
                    <div className="relative">
                      <Image
                        src={item.user.image}
                        alt={item.user.name}
                        className="rounded-full object-cover ring-4 ring-gray-100"
                        width={80}
                        height={80}
                        style={{
                          width: '80px',
                          height: '80px',
                        }}
                      />
                    </div>
                  </div>

                  {/* User Name */}
                  <h3 className="text-base font-bold text-gray-900 mb-2 text-center flex-shrink-0">
                    {item.user.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mb-4 flex-shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(item.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs text-gray-600 font-semibold">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-gray-600 leading-relaxed text-center line-clamp-4 flex-grow">
                    "{item.review}"
                  </p>
                </div>
                );
              })}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            className={`absolute right-0 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-50 hover:shadow-xl active:scale-95 transition-all duration-200 z-10 border border-gray-200 ${
              current === maxStart ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            onClick={next}
            disabled={current === maxStart}
            aria-label="Next testimonial"
          >
            <ChevronRight
              size={20}
              className={current === maxStart ? "text-gray-400" : "text-gray-700"}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-10 sm:mt-12 md:mt-14">
          {Array.from({ length: maxStart + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === index
                  ? "bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] w-8"
                  : "bg-gray-300 w-2.5 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="text-center mt-4 text-xs text-gray-500">
          {current + 1} / {maxStart + 1}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;