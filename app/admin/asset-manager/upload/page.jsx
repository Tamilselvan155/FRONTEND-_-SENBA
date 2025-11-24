'use client'

import { ChevronDown, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AssetUploadPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        file: null,
        fileName: ''
    })

    const assetTypes = [
        'Image',
        'Video',
        'Short'
    ]

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({
                ...prev,
                file: file,
                fileName: file.name
            }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        router.push('/admin/asset-manager')
    }

    const handleBack = () => {
        router.push('/admin/asset-manager')
    }

    return (
        <div className="p-4">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Asset Upload</h2>
            </div>

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
                            placeholder="Enter asset title"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Type Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative w-full">
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                            >
                                <option value="">-- Select Type --</option>
                                {assetTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                            <ChevronDown 
                                size={16} 
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Upload File Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload File <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2 w-full">
                            <label className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded cursor-pointer transition">
                                Choose File
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    required
                                />
                            </label>
                            <input
                                type="text"
                                value={formData.fileName}
                                readOnly
                                placeholder="No file chosen"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
