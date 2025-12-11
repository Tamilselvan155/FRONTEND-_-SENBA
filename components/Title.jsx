'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Title = ({ title, visibleButton = true, href = '', description }) => {
    const isCentered = !visibleButton;
    
    return (
        <div className={`flex flex-col ${isCentered ? 'items-center' : 'sm:flex-row sm:items-center sm:justify-between'} gap-3 sm:gap-4 mb-6 sm:mb-8 w-full`}>
            {/* Title Section */}
            <div className={`flex flex-col gap-1 ${isCentered ? 'items-center text-center' : ''}`}>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                    {title}
                </h2>
                {description && (
                    <p className={`text-sm sm:text-base text-gray-600 font-normal ${isCentered ? 'max-w-2xl' : ''}`}>
                        {description}
                    </p>
                )}
            </div>

            {/* Right Section - View All Button */}
            {visibleButton && href && (
                <div className="flex-shrink-0">
                    <Link
                        href={href}
                        className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#c31e5aff] hover:text-[#a01a47ff] transition-colors duration-200 group"
                    >
                        <span>View All</span>
                        <ArrowRight
                            size={18}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Title
