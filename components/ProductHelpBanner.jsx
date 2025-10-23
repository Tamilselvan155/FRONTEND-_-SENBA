// components/ProductHelpBanner.jsx
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { assets } from "@/assets/assets";
import Image from "next/image";

export default function ProductHelpBanner() {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 my-20 mx-auto w-full max-w-[95%] sm:max-w-[90%] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">

    <section className="w-full bg-[#fef4ea] rounded-[2rem] px-6 sm:px-10 py-8 sm:py-10 my-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg text-[#7C2A47]">
      
      {/* Left Icon + Text */}
      <div className="flex items-center gap-4 text-center sm:text-left">
        {/* Icon */}
        <div className="flex items-center justify-center w-[30vw] max-w-[7.5rem] sm:max-w-[5rem] aspect-square bg-[#7C2A47] border-2 border-white rounded-full ">
          {/* <HelpCircle size={36} strokeWidth={2.5} className="text-white" /> */}
          <Image src={assets.productHelpBanner} alt="Help Icon" className="w-9 h-9 sm:w-12 sm:h-12" />
        </div>

        {/* Text Content */}
        <div>
          <h2 className="text-[18px] sm:text-2xl font-semibold leading-snug">
            Need help deciding on the right products?
          </h2>
          <p className="text-[15px] sm:text-lg text-[#7C2A47] mt-1">
            Try our product selection guide to help you in your decision making
          </p>
        </div>
      </div>

      {/* Right Button */}
      <Link
        href="/contact"
        className="bg-white text-[#7C2A47] text-[15px] font-semibold rounded-full px-6 py-3 sm:px-8 sm:py-4 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
      >
        Start Now
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </section>
    </div>
  );
}
