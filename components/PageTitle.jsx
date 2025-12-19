'use client'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

const PageTitle = ({ heading, text, path = "/", linkText }) => {
    return (
        <div className="my-6">
            <h2 className="text-2xl font-bold text-gray-900">{heading}</h2>
            <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600">{text}</p>
                {linkText && (
                    <Link href={path} className="flex items-center gap-1 text-[#7C2A47] text-sm font-medium hover:text-[#6a243d] transition-colors">
                        {linkText} <ArrowRightIcon size={14} />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default PageTitle