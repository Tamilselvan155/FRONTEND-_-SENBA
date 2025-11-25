'use client'

import { ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchAttributeValueByIdAsync, updateAttributeValueAsync } from "@/lib/features/attributeValue/attributeValueSlice"
import { fetchAttributesAsync } from "@/lib/features/attribute/attributeSlice"
import toast from "react-hot-toast"

export default function EditAttributeValuePage() {
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()
    const { currentAttributeValue, loading } = useSelector((state) => state.attributeValue)
    const { attributes } = useSelector((state) => state.attribute)
    const [formData, setFormData] = useState({
        attribute: '',
        value: ''
    })

    useEffect(() => {
        if (params.id) {
            dispatch(fetchAttributeValueByIdAsync(params.id))
            dispatch(fetchAttributesAsync())
        }
    }, [params.id, dispatch])

    useEffect(() => {
        if (currentAttributeValue) {
            const attrValue = currentAttributeValue.data || currentAttributeValue;
            setFormData({
                attribute: attrValue.attributeId ? (attrValue.attributeId._id || attrValue.attributeId.id || attrValue.attributeId) : '',
                value: attrValue.value || ''
            })
        }
    }, [currentAttributeValue])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await dispatch(updateAttributeValueAsync({
                id: params.id,
                data: {
                    attributeId: formData.attribute,
                    value: formData.value
                }
            })).unwrap()
            toast.success('Attribute value updated successfully!')
            router.push('/admin/attribute-value')
        } catch (err) {
            toast.error(err || 'Failed to update attribute value')
        }
    }

    if (loading && !currentAttributeValue) {
        return <div className="p-4 text-center">Loading...</div>
    }

    return (
        <div className="p-4">
            <div className="w-full">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/attribute-value')}
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

