'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ fallbackUrl = '/', className = '', showText = true }) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-[#7C2A47] transition-colors duration-200 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft size={16} className="sm:w-4 sm:h-4" />
      {showText && <span className="text-xs sm:text-sm font-medium">Go Back</span>}
    </button>
  );
};

export default BackButton;

