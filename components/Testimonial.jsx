
'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { dummyRatingsData } from "@/assets/assets";

const CARD_WIDTH = 320;  // fixed card width
const CARD_HEIGHT = 340; // fixed card height

const Testimonial = () => {
  const [current, setCurrent] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  // ✅ Responsive: Update visibleCards based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxStart = Math.max(0, dummyRatingsData.length - visibleCards);

  const prev = () => setCurrent((v) => Math.max(0, v - 1));
  const next = () => setCurrent((v) => Math.min(maxStart, v + 1));

  const showing = dummyRatingsData.slice(current, current + visibleCards);

  return (
    <section className="w-full py-15 bg-gray-50 ">
      <div className="max-w-6xl mx-auto px-3">
        <h2 className="text-[19px] sm:text-2xl font-semibold text-gray-800 mb-4 text-center">
          What Our Customers Say
        </h2>
        <p className="text-gray-900 text-[19px] sm:text-lg mb-10 text-center">
          We value every piece of feedback — here’s what our happy customers have to say!
        </p>

        <div className="relative flex items-center justify-center overflow-hidden">
          {/* Left Arrow */}
          <button
            className="absolute left-0 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition z-10"
            onClick={prev}
            disabled={current === 0}
            style={{ top: "45%", transform: "translateY(-50%)" }}
          >
            <ChevronLeft
              size={28}
              className={current === 0 ? "text-gray-300" : "text-gray-600"}
            />
          </button>

          {/* Cards Container */}
          <div
            className="flex gap-6 justify-center transition-transform duration-300 ease-in-out"
            style={{
              width: "100%",
              maxWidth: `${CARD_WIDTH * visibleCards + (visibleCards - 1) * 24}px`,
            }}
          >
            {showing.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl mb-3 shadow-md flex flex-col items-center text-center hover:shadow-lg transition-all"
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  minWidth: CARD_WIDTH,
                  minHeight: CARD_HEIGHT,
                  maxWidth: CARD_WIDTH,
                  maxHeight: CARD_HEIGHT,
                }}
              >
                <Image
                  src={item.user.image}
                  alt={item.user.name}
                  className="rounded-full object-cover mt-6"
                  width={80}
                  height={80}
                />
                <h3 className="mt-4 font-semibold text-[19px] sm:text-xl text-gray-800">
                  {item.user.name}
                </h3>

                {/* ⭐ Rating */}
                <div className="flex items-center justify-center mt-2">
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
                  <span className="ml-2 text-sm text-gray-600">
                    ({item.rating})
                  </span>
                </div>

                {/* 💬 Review */}
                <p className="mt-4 text-gray-600 text-[15px] sm:text-lg leading-relaxed px-4 line-clamp-4">
                  “{item.review}”
                </p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            className="absolute right-0 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition z-10"
            onClick={next}
            disabled={current === maxStart}
            style={{ top: "45%", transform: "translateY(-50%)" }}
          >
            <ChevronRight
              size={28}
              className={current === maxStart ? "text-gray-300" : "text-gray-600"}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;