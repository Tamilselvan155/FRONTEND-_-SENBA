'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchAttributeByIdAsync, updateAttributeAsync } from "@/lib/features/attribute/attributeSlice"
import toast from "react-hot-toast"

export default function EditAttributePage() {
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()
    const { currentAttribute, loading } = useSelector((state) => state.attribute)
    const [formData, setFormData] = useState({
        title: ''
    })

    useEffect(() => {
        if (params.id) {
            dispatch(fetchAttributeByIdAsync(params.id))
        }
    }, [params.id, dispatch])

    useEffect(() => {
        if (currentAttribute && currentAttribute.data) {
            const attribute = currentAttribute.data;
            setFormData({
                title: attribute.title || ''
            })
        } else if (currentAttribute && currentAttribute.title) {
            setFormData({
                title: currentAttribute.title || ''
            })
        }
    }, [currentAttribute])

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
            await dispatch(updateAttributeAsync({ id: params.id, data: formData })).unwrap()
            toast.success('Attribute updated successfully!')
            router.push('/admin/attribute')
        } catch (err) {
            toast.error(err || 'Failed to update attribute')
        }
    }

    if (loading && !currentAttribute) {
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

                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/attribute')}
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

