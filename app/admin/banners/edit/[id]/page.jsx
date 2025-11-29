'use client'

import { ChevronDown, ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchBannerByIdAsync, updateBannerAsync } from "@/lib/features/banner/bannerSlice"
import axiosInstance from "@/lib/api/axios"
import toast from "react-hot-toast"
import { getImageUrl } from "@/lib/utils/imageUtils"

export default function EditBannerPage() {
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()
    const { currentBanner, loading: bannerLoading } = useSelector((state) => state.banner)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        photo: null,
        photoName: '',
        status: 'active'
    })
    const [photoPreview, setPhotoPreview] = useState(null)
    const [existingPhoto, setExistingPhoto] = useState(null)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)

    useEffect(() => {
        if (params.id) {
            dispatch(fetchBannerByIdAsync(params.id))
        }
    }, [params.id, dispatch])

    // Populate form when banner data is loaded
    useEffect(() => {
        if (currentBanner) {
            // The Redux slice already extracts data, so currentBanner should be the banner object directly
            // But handle nested structure if present
            let banner = currentBanner;
            if (currentBanner.data && typeof currentBanner.data === 'object' && !Array.isArray(currentBanner.data)) {
                banner = currentBanner.data;
            }

            setFormData({
                title: banner.title || '',
                description: banner.description || '',
                photo: null,
                photoName: '',
                status: banner.status || 'active'
            })

            // Set existing photo - ensure we get the actual photo value
            const photoValue = banner.photo
            if (photoValue) {
                setExistingPhoto(photoValue)
            } else {
                setExistingPhoto(null)
            }
        }
    }, [currentBanner])

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

            const response = await axiosInstance.post('/upload/banner', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (response.data.success) {
                // Return only the relative path, not the full URL
                // The full URL will be constructed when displaying
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
        
        if (!formData.title) {
            toast.error('Title is required')
            return
        }

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

            if (!photoUrl) {
                toast.error('Photo is required')
                return
            }

            const submitData = {
                title: formData.title,
                description: formData.description || null,
                photo: photoUrl,
                status: formData.status.toLowerCase() === 'active' ? 'active' : 'inactive'
            }

            await dispatch(updateBannerAsync({ id: params.id, data: submitData })).unwrap()
            toast.success('Banner updated successfully!')
            router.push('/admin/banners')
        } catch (error) {
            toast.error(error || 'Failed to update banner')
        }
    }

    if (bannerLoading && !currentBanner) {
        return <div className="p-4 text-center">Loading banner data...</div>
    }

    if (!bannerLoading && !currentBanner && params.id) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-500">Banner not found</p>
                <button
                    onClick={() => router.push('/admin/banners')}
                    className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                    Back to Banners
                </button>
            </div>
        )
    }

    // Construct photo URL for display
    const displayPhotoUrl = photoPreview || (existingPhoto ? getImageUrl(existingPhoto) : null)

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
                            placeholder="Enter banner title"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Write description..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-sm"
                        />
                    </div>

                    {/* Photo Upload Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Photo <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-3">
                            {displayPhotoUrl ? (
                                <div className="relative w-48 h-32 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-100">
                                    <img
                                        src={displayPhotoUrl}
                                        alt="Banner"
                                        className="object-cover w-full h-full"
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            display: 'block',
                                            objectFit: 'cover'
                                        }}
                                        crossOrigin="anonymous"
                                        onError={(e) => {
                                            // Replace with placeholder on error
                                            const parent = e.target.parentElement
                                            if (parent && !parent.querySelector('.error-placeholder')) {
                                                parent.innerHTML = `
                                                    <div class="error-placeholder flex items-center justify-center w-full h-full bg-gray-50">
                                                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                        <span class="ml-2 text-sm text-gray-500">Banner</span>
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
                            )}
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

                    {/* Status Field */}
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
                            <ChevronDown 
                                size={16} 
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/banners')}
                            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={bannerLoading || uploadingPhoto}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {bannerLoading || uploadingPhoto ? 'Processing...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

