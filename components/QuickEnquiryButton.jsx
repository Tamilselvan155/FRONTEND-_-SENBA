import { MessageCircle } from 'lucide-react'
import Link from 'next/link';
import React from 'react'
export default function QuickEnquiryButton() {
  return (
    <Link href="/contact">
<div className="fixed top-1/2 right-0 z-50 -translate-y-1/2">
  <button
    className="flex flex-col items-center justify-center bg-[#7C2A47] text-white 
               px-3 py-3 rounded-l-lg hover:bg-[#7C2A48] transition-all duration-300"
    
  >
    <MessageCircle size={20} />
    <span className="mt-2 text-xs sm:text-sm font-semibold tracking-wider [writing-mode:vertical-rl] rotate-180">
      QUICK ENQUIRY
    </span>
  </button>
</div>
</Link>
  );
}
