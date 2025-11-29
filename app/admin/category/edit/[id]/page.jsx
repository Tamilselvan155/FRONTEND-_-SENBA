'use client'

import { ChevronDown, ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategoryByIdAsync, updateCategoryAsync, fetchCategoriesForDropdownAsync } from "@/lib/features/category/categorySlice"
import toast from "react-hot-toast"
import axiosInstance from "@/lib/api/axios"
import { getImageUrl } from "@/lib/utils/imageUtils"

export default function EditCategoryPage() {
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()
    const { currentCategory, loading, categoriesForDropdown } = useSelector((state) => state.category)
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
    const [existingPhoto, setExistingPhoto] = useState(null)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)

    useEffect(() => {
        if (params.id) {
            dispatch(fetchCategoryByIdAsync(params.id))
            dispatch(fetchCategoriesForDropdownAsync())
        }
    }, [params.id, dispatch])

    useEffect(() => {
        if (currentCategory) {
            // Handle different response structures from backend
            // Backend returns: { success: true, data: category }
            // Redux stores: response.data which is { success: true, data: category }
            let category = currentCategory;
            
            // Extract category from nested structure
            if (currentCategory.data && typeof currentCategory.data === 'object') {
                category = currentCategory.data;
            } else if (currentCategory.success && currentCategory.data) {
                category = currentCategory.data;
            }
            
            // Handle parentId - could be populated object or just ID string
            let parentId = '';
            if (category.parentId) {
                if (typeof category.parentId === 'object' && category.parentId !== null) {
                    // Populated parentId object
                    parentId = category.parentId._id || category.parentId.id || String(category.parentId) || '';
                } else {
                    // Just the ID string
                    parentId = String(category.parentId);
                }
            }
            
            // Determine isParent - if parentId exists and is not empty, it's not a parent
            const isParentValue = category.isParent !== undefined 
                ? Boolean(category.isParent)
                : (!parentId || parentId === '' || parentId === 'null');
            
            // Set form data with all fields properly mapped
            setFormData({
                title: String(category.title || ''),
                isParent: isParentValue,
                parentCategory: parentId || '',
                englishName: String(category.englishName || ''),
                slug: String(category.slug || ''),
                menuPosition: category.menuPosition !== undefined && category.menuPosition !== null 
                    ? String(category.menuPosition) 
                    : '',
                sortOrder: category.sortOrder !== undefined && category.sortOrder !== null 
                    ? String(category.sortOrder) 
                    : '0',
                showOnHomepage: Boolean(category.showOnHomepage || false),
                displayPosition: String(category.displayPosition || 'Center'),
                photo: null,
                photoName: '',
                type: String(category.type || 'Common'),
                summary: String(category.summary || ''),
                status: String(category.status || 'active')
            })

            // Set existing photo
            const photoValue = category.photo
            if (photoValue) {
                setExistingPhoto(photoValue)
            } else {
                setExistingPhoto(null)
            }
        }
    }, [currentCategory])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let photoUrl = existingPhoto

            // Upload new photo if one was selected
            if (formData.photo) {
                const newPhotoUrl = await uploadPhoto()
                if (!newPhotoUrl) {
                    toast.error('Failed to upload photo. Please try again.')
                    return
                }
                photoUrl = newPhotoUrl
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
            await dispatch(updateCategoryAsync({ id: params.id, data: categoryData })).unwrap()
            toast.success('Category updated successfully!')
            router.push('/admin/category')
        } catch (err) {
            toast.error(err || 'Failed to update category')
        }
    }

    if (loading && !currentCategory) {
        return <div className="p-4 text-center">Loading category data...</div>
    }

    if (!loading && !currentCategory && params.id) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-500">Category not found</p>
                <button
                    onClick={() => router.push('/admin/category')}
                    className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                    Back to Categories
                </button>
            </div>
        )
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
                            placeholder={formData.isParent ? "Enter parent category title" : "Enter sub category title"}
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
                            <span className="text-sm text-gray-700">Is Parent Category</span>
                        </label>
                    </div>

                    {/* 3. Parent Category - Only show when Is Parent is unchecked */}
                    {!formData.isParent && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Parent Category <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="parentCategory"
                                    value={formData.parentCategory}
                                    onChange={handleInputChange}
                                    required={!formData.isParent}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                                >
                                    <option value="">--Select Parent Category--</option>
                                    {categoriesForDropdown
                                        .filter(cat => cat.isParent && (cat._id !== params.id && cat.id !== params.id))
                                        .map((cat) => (
                                            <option key={cat._id || cat.id} value={cat._id || cat.id}>
                                                {cat.title}
                                            </option>
                                        ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Select the parent category under which this sub category will be added
                            </p>
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
                                Slug
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
                            {(() => {
                                const displayPhotoUrl = photoPreview || (existingPhoto ? getImageUrl(existingPhoto) : null)
                                return displayPhotoUrl ? (
                                    <div className="relative w-48 h-32 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-100">
                                        <img
                                            src={displayPhotoUrl}
                                            alt="Category"
                                            className="object-cover w-full h-full"
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                display: 'block',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                const parent = e.target.parentElement
                                                if (parent && !parent.querySelector('.error-placeholder')) {
                                                    parent.innerHTML = `
                                                        <div class="error-placeholder flex items-center justify-center w-full h-full bg-gray-50">
                                                            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                            <span class="ml-2 text-sm text-gray-500">Category</span>
                                                        </div>
                                                    `
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center w-48 h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                        <div className="text-center">
                                            <ImageIcon size={32} className="text-gray-400 mx-auto mb-2" />
                                            <p className="text-xs text-gray-500">No image</p>
                                        </div>
                                    </div>
                                )
                            })()}
                            <div className="flex items-center gap-2">
                                <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded cursor-pointer transition">
                                    {formData.photo ? 'Change Photo' : 'Choose New Photo'}
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
                                    placeholder={existingPhoto ? "Current photo will be kept" : "No file chosen"}
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
                    <div className="flex items-center justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/category')}
                            className="px-4 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

