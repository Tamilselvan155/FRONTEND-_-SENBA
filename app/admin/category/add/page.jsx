'use client'

import { ChevronDown, ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { createCategoryAsync, fetchCategoriesForDropdownAsync } from "@/lib/features/category/categorySlice"
import toast from "react-hot-toast"
import axiosInstance from "@/lib/api/axios"

export default function AddCategoryPage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { loading, error, categoriesForDropdown } = useSelector((state) => state.category)
    const [formData, setFormData] = useState({
        title: '',
        isParent: true,
        parentCategory: '',
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
        status: 'active'
    })
    const [photoPreview, setPhotoPreview] = useState(null)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }
            // If isParent is checked, clear parentCategory
            if (name === 'isParent' && checked) {
                newData.parentCategory = ''
            }
            return newData
        })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type and size
            const isValidType = file.type.startsWith('image/')
            const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
            
            if (!isValidType) {
                toast.error('Please select a valid image file')
                return
            }
            if (!isValidSize) {
                toast.error('Image size must be less than 5MB')
                return
            }

            setFormData(prev => ({
                ...prev,
                photo: file,
                photoName: file.name
            }))
            
            // Create preview
            const preview = URL.createObjectURL(file)
            setPhotoPreview(preview)
        }
    }

    const uploadPhoto = async () => {
        if (!formData.photo) return null

        setUploadingPhoto(true)
        try {
            const uploadFormData = new FormData()
            uploadFormData.append('photo', formData.photo)

            const response = await axiosInstance.post('/upload/category', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (response.data.success) {
                // Return only the relative path, not the full URL
                return response.data.url
            }
            return null
        } catch (error) {
            console.error('Error uploading photo:', error)
            toast.error(error.response?.data?.error || 'Failed to upload photo')
            return null
        } finally {
            setUploadingPhoto(false)
        }
    }

    const handleReset = () => {
        setFormData({
            title: '',
            isParent: true,
            parentCategory: '',
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
            status: 'active'
        })
        if (photoPreview) {
            URL.revokeObjectURL(photoPreview)
            setPhotoPreview(null)
        }
    }

    useEffect(() => {
        dispatch(fetchCategoriesForDropdownAsync())
    }, [dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Upload photo first if one was selected
            let photoUrl = null
            if (formData.photo) {
                photoUrl = await uploadPhoto()
                if (!photoUrl) {
                    toast.error('Failed to upload photo. Please try again.')
                    return
                }
            }

            const categoryData = {
                title: formData.title,
                englishName: formData.englishName || formData.title,
                slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
                isParent: formData.isParent,
                parentId: formData.isParent ? null : (formData.parentCategory || null),
                showOnHomepage: formData.showOnHomepage,
                status: formData.status.toLowerCase(),
                photo: photoUrl || null,
                menuPosition: formData.menuPosition ? parseInt(formData.menuPosition) : null,
                sortOrder: formData.sortOrder ? parseInt(formData.sortOrder) : null,
                displayPosition: formData.displayPosition || null,
                type: formData.type || null,
                summary: formData.summary || null,
            }
            await dispatch(createCategoryAsync(categoryData)).unwrap()
            toast.success('Category created successfully!')
            router.push('/admin/category')
        } catch (err) {
            toast.error(err || 'Failed to create category')
        }
    }

    return (
        <div className="p-4">
            {/* Form */}
            <div className="w-full">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 1. Title */}
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

                    {/* 2. Is Parent */}
                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isParent"
                                checked={formData.isParent}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Is Parent</span>
                        </label>
                    </div>

                    {/* 3. Parent Category - Only show when Is Parent is unchecked */}
                    {!formData.isParent && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Parent Category
                            </label>
                            <div className="relative">
                                <select
                                    name="parentCategory"
                                    value={formData.parentCategory}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                                >
                                    <option value="">--Select any category--</option>
                                    {categoriesForDropdown
                                        .filter(cat => cat.isParent)
                                        .map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.title}
                                            </option>
                                        ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* 4. English Name and 5. Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                English Name
                            </label>
                            <input
                                type="text"
                                name="englishName"
                                value={formData.englishName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                slug
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* 6. Menu Position and 7. Sort Order */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Menu Position
                            </label>
                            <div className="relative">
                                <select
                                    name="menuPosition"
                                    value={formData.menuPosition}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                                >
                                    <option value="">-- Select Position --</option>
                                    <option value="top">Top</option>
                                    <option value="middle">Middle</option>
                                    <option value="bottom">Bottom</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sort Order
                            </label>
                            <input
                                type="number"
                                name="sortOrder"
                                value={formData.sortOrder}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* 8. Show on Homepage */}
                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="showOnHomepage"
                                checked={formData.showOnHomepage}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Show on Homepage</span>
                        </label>
                    </div>

                    {/* 9. Display Position */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Position
                        </label>
                        <div className="relative">
                            <select
                                name="displayPosition"
                                value={formData.displayPosition}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                            >
                                <option value="Center">Center</option>
                                <option value="Left">Left</option>
                                <option value="Right">Right</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* 10. Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Photo
                        </label>
                        <div className="space-y-3">
                            {photoPreview && (
                                <div className="relative w-48 h-32 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-100">
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            display: 'block',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded cursor-pointer transition">
                                    {formData.photo ? 'Change Photo' : 'Choose Photo'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={uploadingPhoto}
                                    />
                                </label>
                                <input
                                    type="text"
                                    value={formData.photoName}
                                    readOnly
                                    placeholder="No file chosen"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                                />
                            </div>
                            {uploadingPhoto && (
                                <p className="text-sm text-blue-600">Uploading photo...</p>
                            )}
                            <p className="text-xs text-gray-500">
                                Maximum 5MB. Supported formats: JPEG, PNG, GIF, WebP
                            </p>
                        </div>
                    </div>

                    {/* 11. Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <div className="relative">
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                            >
                                <option value="Common">Common</option>
                                <option value="Featured">Featured</option>
                                <option value="Special">Special</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* 12. Summary */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Summary
                        </label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleInputChange}
                            placeholder="Write description..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-sm"
                        />
                    </div>

                    {/* 13. Status */}
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
                            <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
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
