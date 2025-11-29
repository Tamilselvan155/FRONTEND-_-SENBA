'use client'

import { Settings } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { createAttributeAsync } from "@/lib/features/attribute/attributeSlice"
import toast from "react-hot-toast"

export default function AddAttributePage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.attribute)
    const [formData, setFormData] = useState({
        title: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleReset = () => {
        setFormData({
            title: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await dispatch(createAttributeAsync(formData)).unwrap()
            toast.success('Attribute created successfully!')
        router.push('/admin/attribute')
        } catch (err) {
            toast.error(err || 'Failed to create attribute')
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
