

'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Title = ({ title, visibleButton = true, href = '' }) => {
    return (
        <div className="flex items-center justify-between mb-5 w-full gap-3">
            {/* Title + Line */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {/* Vertical colored bar */}
                <div className="w-2 h-8 sm:h-10 rounded-full bg-gradient-to-b from-[#c31e5aff] to-[#c31e5aff] shadow-lg flex-shrink-0"></div>

                {/* Title text */}
                <p className="text-[20px] sm:text-[20px]  font-semibold text-slate-800 whitespace-nowrap truncate">
                    {title}
                </p>

                {/* Horizontal line */}
                <div className="flex-1 h-px bg-gradient-to-r from-[#c31e5aff] to-transparent"></div>
            </div>

            {/* View More Button */}
            {visibleButton && (
                <div className="flex-shrink-0 ml-3">
                    <Link
                        href={href}
                        className="flex items-center gap-1 text-[13px] sm:text-xl text-[#c31e5aff] whitespace-nowrap transition-all duration-300 group relative"
                    >
                        <span className="relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:left-0 after:-bottom-1 after:bg-[#c31e5aff] after:transition-all after:duration-300 group-hover:after:w-full">
                            View more
                        </span>
                        <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Title
