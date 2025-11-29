'use client'

import { ChevronDown, Tag } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { createBrandAsync } from "@/lib/features/brand/brandSlice"
import toast from "react-hot-toast"

export default function AddBrandPage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.brand)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        status: 'active'
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Auto-generate slug from title
            ...(name === 'title' && { slug: value.toLowerCase().replace(/\s+/g, '-') })
        }))
    }

    const handleReset = () => {
        setFormData({
            title: '',
            slug: '',
            status: 'active'
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.slug) {
            formData.slug = formData.title.toLowerCase().replace(/\s+/g, '-')
        }
        try {
            await dispatch(createBrandAsync({
                title: formData.title,
                slug: formData.slug,
                status: formData.status.toLowerCase()
            })).unwrap()
            toast.success('Brand created successfully!')
            router.push('/admin/brands')
        } catch (err) {
            toast.error(err || 'Failed to create brand')
        }
    }

    return (
        <div className="p-4">
            {/* Form */}
            <div className="w-full">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter title"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Slug Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            placeholder="Enter slug (auto-generated from title)"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Status Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <ChevronDown 
                                size={16} 
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
