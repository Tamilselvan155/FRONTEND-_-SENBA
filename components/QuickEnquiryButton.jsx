import { MessageCircle } from 'lucide-react'
import Link from 'next/link';
import React from 'react'
export default function QuickEnquiryButton() {
  return (
    <Link href="/contact">
<div className="fixed bottom-6 right-6 z-50">
  <button
    className="flex flex-col items-center justify-center bg-[#7C2A47] text-white 
               px-4 py-4 rounded-full hover:bg-[#8B3A5A] transition-all duration-300 shadow-lg hover:shadow-xl"
    
  >
    <MessageCircle size={24} />
    {/* <span className="mt-2 text-xs sm:text-sm font-semibold tracking-wider [writing-mode:vertical-rl] rotate-180">
      QUICK ENQUIRY
    </span> */}
  </button>
</div>
</Link>
  );
}
