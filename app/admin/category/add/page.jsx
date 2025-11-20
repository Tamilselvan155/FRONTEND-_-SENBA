'use client'

import { ArrowLeft, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddCategoryPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        isParent: true,
        englishName: '',
        slug: '',
        menuPosition: '',
        sortOrder: '0',
        showOnHomepage: false,
        displayPosition: 'Center',
        photo: null,
        photoName: '',
        type: 'Common',
        summary: '',
        status: 'Active'
    })

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({
                ...prev,
                photo: file,
                photoName: file.name
            }))
        }
    }

    const handleReset = () => {
        setFormData({
            title: '',
            isParent: true,
            englishName: '',
            slug: '',
            menuPosition: '',
            sortOrder: '0',
            showOnHomepage: false,
            displayPosition: 'Center',
            photo: null,
            photoName: '',
            type: 'Common',
            summary: '',
            status: 'Active'
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission here
        console.log('Form submitted:', formData)
        router.push('/admin/category')
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
                    <h2 className="text-2xl font-semibold text-gray-800">Add Category</h2>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 w-full">
                {/* Title Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter title"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Is Parent Field */}
                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isParent"
                            checked={formData.isParent}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Is Parent</span>
                        <span className="text-sm text-gray-500">Yes</span>
                    </label>
                </div>

                {/* English Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        English Name
                    </label>
                    <input
                        type="text"
                        name="englishName"
                        value={formData.englishName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Slug Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        slug
                    </label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Menu Position Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Menu Position
                    </label>
                    <div className="relative">
                        <select
                            name="menuPosition"
                            value={formData.menuPosition}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="">-- Select Position --</option>
                            <option value="top">Top</option>
                            <option value="middle">Middle</option>
                            <option value="bottom">Bottom</option>
                        </select>
                        <ChevronDown 
                            size={20} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Sort Order Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort Order
                    </label>
                    <input
                        type="number"
                        name="sortOrder"
                        value={formData.sortOrder}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Show on Homepage Field */}
                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="showOnHomepage"
                            checked={formData.showOnHomepage}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Show on Homepage</span>
                    </label>
                </div>

                {/* Display Position Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Position
                    </label>
                    <div className="relative">
                        <select
                            name="displayPosition"
                            value={formData.displayPosition}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="Center">Center</option>
                            <option value="Left">Left</option>
                            <option value="Right">Right</option>
                        </select>
                        <ChevronDown 
                            size={20} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Photo Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo
                    </label>
                    <div className="flex items-center gap-3">
                        <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition">
                            Choose
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        <input
                            type="text"
                            value={formData.photoName}
                            readOnly
                            placeholder="No file chosen"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                    </div>
                </div>

                {/* Type Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                    </label>
                    <div className="relative">
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="Common">Common</option>
                            <option value="Featured">Featured</option>
                            <option value="Special">Special</option>
                        </select>
                        <ChevronDown 
                            size={20} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Summary Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Summary
                    </label>
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        placeholder="Write short description....."
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    />
                </div>

                {/* Status Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown 
                            size={20} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
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

