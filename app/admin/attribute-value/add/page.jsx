'use client'

import { ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { createAttributeValueAsync } from "@/lib/features/attributeValue/attributeValueSlice"
import { fetchAttributesAsync } from "@/lib/features/attribute/attributeSlice"
import toast from "react-hot-toast"

export default function AddAttributeValuePage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.attributeValue)
    const { attributes } = useSelector((state) => state.attribute)
    const [formData, setFormData] = useState({
        attribute: '',
        value: ''
    })

    useEffect(() => {
        dispatch(fetchAttributesAsync())
    }, [dispatch])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleReset = () => {
        setFormData({
            attribute: '',
            value: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await dispatch(createAttributeValueAsync({
                attributeId: formData.attribute,
                value: formData.value
            })).unwrap()
            toast.success('Attribute value created successfully!')
            router.push('/admin/attribute-value')
        } catch (err) {
            toast.error(err || 'Failed to create attribute value')
        }
    }

    return (
        <div className="p-4">
            {/* Form */}
            <div className="w-full">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Attribute Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Attribute <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="attribute"
                                    value={formData.attribute}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                                >
                                    <option value="">--Choose Attribute--</option>
                                    {attributes.map((attr) => (
                                        <option key={attr.id || attr._id} value={attr.id || attr._id}>
                                            {attr.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown 
                                    size={16} 
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                />
                            </div>
                        </div>

                        {/* Value Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Value <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="value"
                                value={formData.value}
                                onChange={handleInputChange}
                                placeholder="Enter value"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
