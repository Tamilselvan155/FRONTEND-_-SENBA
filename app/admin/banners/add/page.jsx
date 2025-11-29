'use client'

import { ChevronDown, Image as ImageIcon, FileText, Upload } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { createBannerAsync } from "@/lib/features/banner/bannerSlice"
import axiosInstance from "@/lib/api/axios"
import toast from "react-hot-toast"
import Image from "next/image"

export default function AddBannerPage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.banner)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        photo: null,
        photoName: '',
        status: 'active'
    })
    const [photoPreview, setPhotoPreview] = useState(null)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)

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

    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            photo: null,
            photoName: '',
            status: 'active'
        })
        if (photoPreview) {
            URL.revokeObjectURL(photoPreview)
            setPhotoPreview(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.title || !formData.photo) {
            toast.error('Title and photo are required')
            return
        }

        try {
            // Upload photo first
            const photoUrl = await uploadPhoto()
            if (!photoUrl) {
                toast.error('Failed to upload photo. Please try again.')
                return
            }

            const submitData = {
                title: formData.title,
                description: formData.description || null,
                photo: photoUrl,
                status: formData.status.toLowerCase() === 'active' ? 'active' : 'inactive'
            }

            await dispatch(createBannerAsync(submitData)).unwrap()
            toast.success('Banner created successfully!')
            router.push('/admin/banners')
        } catch (error) {
            toast.error(error || 'Failed to create banner')
        }
    }

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
                            {photoPreview && (
                                <div className="relative w-48 h-32 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-100">
                                    <Image
                                        src={photoPreview}
                                        alt="Preview"
                                        width={192}
                                        height={128}
                                        className="object-cover w-full h-full"
                                        unoptimized
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
                                        required
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
                            onClick={handleReset}
                            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploadingPhoto}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading || uploadingPhoto ? 'Processing...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
