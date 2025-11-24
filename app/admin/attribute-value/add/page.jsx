'use client'

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddAttributeValuePage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        attribute: '',
        value: ''
    })

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
        console.log('Form submitted:', formData)
        router.push('/admin/attribute-value')
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
                                        <option key={attr.id} value={attr.id}>
                                            {attr.name}
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
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
