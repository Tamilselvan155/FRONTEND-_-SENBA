'use client'

import { ArrowLeft, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddAttributeValuePage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        attribute: '',
        value: ''
    })

    // Sample attributes - in real app, this would come from API
    const attributes = [
        { id: 1, name: "kw" },
        { id: 2, name: "Type" },
        { id: 3, name: "Pipe Size" },
        { id: 4, name: "HP" },
    ]

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

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission here
        console.log('Form submitted:', formData)
        router.push('/admin/attribute-value')
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-md transition"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h2 className="text-2xl font-semibold text-gray-800">Add Attribute Value</h2>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 w-full max-w-2xl">
                {/* Select Attribute Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Attribute <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="attribute"
                            value={formData.attribute}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="">--Choose Attribute--</option>
                            {attributes.map((attr) => (
                                <option key={attr.id} value={attr.id}>
                                    {attr.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown 
                            size={20} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Value Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Value <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="value"
                        value={formData.value}
                        onChange={handleInputChange}
                        placeholder="Enter value (e.g., Red, XL)"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

