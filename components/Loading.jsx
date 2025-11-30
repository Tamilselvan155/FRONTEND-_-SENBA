'use client'

import { useEffect, useState } from 'react'

const Loading = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Prevent hydration mismatch - only render on client
    if (!mounted) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='w-11 h-11 rounded-full border-3 border-gray-300 border-t-green-500'></div>
            </div>
        )
    }

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='w-11 h-11 rounded-full border-3 border-gray-300 border-t-green-500 animate-spin'></div>
        </div>
    )
}

export default Loading