'use client'
import React, { useState } from 'react'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import TrustBadges from './TrustBadges'

const Newsletter = () => {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address')
            return
        }
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            toast.success('Successfully subscribed to newsletter!')
            setEmail('')
            setIsSubmitting(false)
        }, 1000)
    }

    return (
        <section className="w-full bg-white py-12 sm:py-16 lg:pt-10 lg:pb-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Get exclusive discounts & promotions
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        Subscribe to our newsletter to get exclusive discounts and promotions sent direct to your inbox. You will receive 10% off on all parts. We never spam :)
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:bg-white sm:rounded-full sm:p-1.5 sm:shadow-lg sm:border sm:border-gray-200">
                        <div className="flex items-center w-full sm:flex-1 bg-white sm:bg-transparent rounded-full sm:rounded-none px-4 sm:px-0 py-3 sm:py-0 shadow-lg sm:shadow-none border border-gray-200 sm:border-0">
                            <Mail className="text-gray-500 ml-0 sm:ml-5 mr-3 w-5 h-5 flex-shrink-0" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email"
                                className="flex-1 outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400 bg-transparent"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-[#7C2A47] to-[#8B3A5A] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base hover:from-[#6a2340] hover:to-[#7a2a4a] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
                        >
                            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </div>
                </form>
                <div className="mt-10">
                    <TrustBadges />
                </div>
            </div>
        </section>
    )
}

export default Newsletter