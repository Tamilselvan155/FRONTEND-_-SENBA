'use client';
import React from 'react'
import { motion } from 'framer-motion'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'

const OurSpecs = () => {
    return (
        <div className='w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 bg-white'>
            <div className='max-w-7xl mx-auto'>
                <Title 
                    visibleButton={false} 
                    title='Our Specifications' 
                    description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free." 
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mt-6 sm:mt-8 lg:mt-10'>
                    {
                        ourSpecsData.map((spec, index) => {
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    className='group relative bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 lg:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden'
                                >
                                    {/* Subtle background gradient on hover */}
                                    <div className='absolute inset-0 bg-gradient-to-br from-gray-50/0 to-gray-50/0 group-hover:from-gray-50/50 group-hover:to-white transition-all duration-300 pointer-events-none' />
                                    
                                    {/* Icon Container */}
                                    <div 
                                        className='relative mb-4 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 z-10'
                                        style={{ backgroundColor: spec.accent || '#7C2A47' }}
                                    >
                                        <div className='absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                        <spec.icon 
                                            size={24} 
                                            className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" 
                                        />
                                    </div>
                                    
                                    {/* Content */}
                                    <div className='relative z-10 flex-1 flex flex-col'>
                                        <h3 className='text-gray-900 text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-[#7C2A47] transition-colors duration-300'>
                                            {spec.title}
                                        </h3>
                                        <p className='text-xs sm:text-sm text-gray-600 leading-relaxed font-normal'>
                                            {spec.description}
                                        </p>
                                    </div>
                                    
                                    {/* Bottom accent line */}
                                    <div 
                                        className='absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                        style={{ 
                                            background: `linear-gradient(to right, transparent, ${spec.accent || '#7C2A47'}, transparent)`,
                                        }}
                                    />
                                </motion.div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default OurSpecs
