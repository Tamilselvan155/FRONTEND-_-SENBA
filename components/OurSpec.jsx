'use client';
import React from 'react'

import Title from './Title'
import { ourSpecsData } from '@/assets/assets'

const OurSpecs = () => {
    // Theme color: #7C2A47 (maroon) - primary brand color
    const themeColor = {
        bg: 'bg-[#7C2A47]/10',
        border: 'border-[#7C2A47]/30',
        icon: 'bg-[#7C2A47]'
    };

    return (
        <div className='w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white'>
            <div className='max-w-7xl mx-auto'>
                <Title 
                    visibleButton={false} 
                    title='Our Specifications' 
                    description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free." 
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mt-10 sm:mt-12 lg:mt-16'>
                    {
                        ourSpecsData.map((spec, index) => {
                            return (
                                <div 
                                    className={`relative pt-10 sm:pt-12 pb-6 sm:pb-8 px-5 sm:px-6 lg:px-8 flex flex-col items-center justify-center w-full text-center border-2 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[180px] sm:min-h-[200px] ${themeColor.bg} ${themeColor.border}`}
                                    key={index}
                                >
                                    <div 
                                        className={`absolute -top-5 sm:-top-6 text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg shadow-lg z-10 ${themeColor.icon}`}
                                    >
                                        <spec.icon size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h3 className='text-gray-900 text-lg sm:text-xl lg:text-2xl font-bold mt-2 sm:mt-3 mb-3 sm:mb-4'>
                                        {spec.title}
                                    </h3>
                                    <p className='text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed px-2 font-medium'>
                                        {spec.description}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default OurSpecs
