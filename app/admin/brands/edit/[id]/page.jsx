'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { ChevronDown } from "lucide-react"
import { fetchBrandByIdAsync, updateBrandAsync } from "@/lib/features/brand/brandSlice"
import toast from "react-hot-toast"

export default function EditBrandPage() {
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()
    const { currentBrand, loading } = useSelector((state) => state.brand)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        status: 'active'
    })

    useEffect(() => {
        if (params.id) {
            dispatch(fetchBrandByIdAsync(params.id))
        }
    }, [params.id, dispatch])

    useEffect(() => {
        if (currentBrand && currentBrand.data) {
            const brand = currentBrand.data;
            setFormData({
                title: brand.title || '',
                slug: brand.slug || '',
                status: brand.status || 'active'
            })
        } else if (currentBrand && currentBrand.title) {
            setFormData({
                title: currentBrand.title || '',
                slug: currentBrand.slug || '',
                status: currentBrand.status || 'active'
            })
        }
    }, [currentBrand])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'title' && { slug: value.toLowerCase().replace(/\s+/g, '-') })
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await dispatch(updateBrandAsync({ 
                id: params.id, 
                data: {
                    title: formData.title,
                    slug: formData.slug,
                    status: formData.status
                }
            })).unwrap()
            toast.success('Brand updated successfully!')
            router.push('/admin/brands')
        } catch (err) {
            toast.error(err || 'Failed to update brand')
        }
    }

    if (loading && !currentBrand) {
        return <div className="p-4 text-center">Loading...</div>
    }

    return (
        <div className="p-4">
            <div className="w-full">
                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            placeholder="Enter slug"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

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

                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/brands')}
                            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

