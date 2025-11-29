'use client'

import { Plus, ImageIcon } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllMediaFilesAsync, deleteMediaFileAsync } from "@/lib/features/asset/assetSlice"
import { getImageUrl } from "@/lib/utils/imageUtils"
import ConfirmModal from "@/components/common/ConfirmModal"
import DataTable from "@/components/common/DataTable"
import toast from "react-hot-toast"

export default function AdminAssetManager() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { mediaFiles, loading } = useSelector((state) => state.asset)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [fileToDelete, setFileToDelete] = useState(null)

    useEffect(() => {
        dispatch(fetchAllMediaFilesAsync())
    }, [dispatch])

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const formatDate = (date) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const columns = useMemo(() => [
        {
            key: 'sn',
            label: 'S.N.',
            sortable: true,
            width: 80,
        },
        {
            key: 'thumbnail',
            label: 'Thumbnail',
            width: 120,
            render: (text, record) => {
                // Get the URL from record.url (the actual file URL from backend)
                // The backend returns url: '/uploads/banners/filename.png' or '/uploads/products/filename.jpg'
                const fileUrl = record?.url || text
                
                if (!fileUrl) {
                    return (
                        <div className="flex items-center justify-center w-20 h-12 rounded border border-gray-200 bg-gray-50">
                            <ImageIcon size={20} className="text-gray-400" />
                        </div>
                    )
                }
                
                // Construct the full image URL
                // Backend returns: '/uploads/banners/filename.png'
                // Backend serves static files from '/uploads' (NOT '/api/uploads')
                // Need: 'http://localhost:3001/uploads/banners/filename.png'
                const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
                // Ensure the path starts with / and remove any /api/ prefix
                let cleanPath = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`
                // Remove /api/ if it was accidentally added (static files are served from /uploads, not /api/uploads)
                if (cleanPath.startsWith('/api/uploads/')) {
                    cleanPath = cleanPath.replace('/api/uploads/', '/uploads/')
                } else if (cleanPath.startsWith('/api/')) {
                    // Remove /api/ from the beginning if present
                    cleanPath = cleanPath.replace('/api/', '/')
                }
                // Ensure baseURL doesn't have /api/ at the end
                const cleanBaseURL = baseURL.replace(/\/api\/?$/, '')
                const imageUrl = `${cleanBaseURL}${cleanPath}`
                
                // Show image for image type files
                if (record?.type === 'image') {
                    return (
                        <div className="flex items-center justify-center">
                            <div className="w-20 h-12 rounded overflow-hidden border border-gray-200 bg-gray-100 shadow-sm relative">
                                <img
                                    src={imageUrl}
                                    alt={record?.name || 'Thumbnail'}
                                    className="object-cover w-full h-full"
                                    style={{ 
                                        minWidth: '80px', 
                                        minHeight: '48px', 
                                        display: 'block',
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    loading="lazy"
                                    onError={(e) => {
                                        // Replace with placeholder on error
                                        const parent = e.target.parentElement
                                        if (parent && !parent.querySelector('.error-placeholder')) {
                                            parent.innerHTML = `
                                                <div class="error-placeholder flex items-center justify-center w-full h-full bg-gray-50">
                                                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>
                                            `
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )
                } else {
                    // Show placeholder for non-image files
                    return (
                        <div className="flex items-center justify-center w-20 h-12 rounded border border-gray-200 bg-gray-50">
                            <ImageIcon size={20} className="text-gray-400" />
                        </div>
                    )
                }
            },
        },
        {
            key: 'name',
            label: 'File Name',
            sortable: true,
        },
        {
            key: 'category',
            label: 'Category',
            sortable: true,
            filterable: true,
            filters: [
                { text: 'Banners', value: 'banners' },
                { text: 'Products', value: 'products' }
            ],
            render: (value) => (
                <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 capitalize">
                    {value}
                </span>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            filterable: true,
            filters: [
                { text: 'Image', value: 'image' },
                { text: 'Video', value: 'video' },
                { text: 'Other', value: 'other' }
            ],
            render: (value) => (
                <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 capitalize">
                    {value}
                </span>
            ),
        },
        {
            key: 'size',
            label: 'Size',
            sortable: true,
            render: (value) => formatFileSize(value),
        },
        {
            key: 'createdAt',
            label: 'Uploaded',
            sortable: true,
            render: (value) => formatDate(value),
        },
    ], [])

    const handleUpload = () => {
        router.push('/admin/asset-manager/upload')
    }

    const handleDelete = (file) => {
        setFileToDelete(file)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!fileToDelete) return
        
        try {
            await dispatch(deleteMediaFileAsync({
                category: fileToDelete.category,
                filename: fileToDelete.name
            })).unwrap()
            toast.success('Media file deleted successfully!')
            setDeleteModalOpen(false)
            setFileToDelete(null)
            // Refresh the list
            dispatch(fetchAllMediaFilesAsync())
        } catch (error) {
            toast.error(error || 'Failed to delete media file')
        }
    }

    // Prepare data for DataTable with serial numbers
    const tableData = useMemo(() => {
        return (mediaFiles || []).map((file, index) => ({
            ...file,
            id: file.id || `${file.category}-${file.name}`,
            sn: index + 1,
            thumbnail: file.url, // Pass URL for thumbnail rendering
        }))
    }, [mediaFiles])

    return (
        <>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Asset Manager</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage all uploaded media files ({mediaFiles.length} total)
                        </p>
                    </div>
                    <button
                        onClick={handleUpload}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                    >
                        <Plus size={18} />
                        Upload New
                    </button>
                </div>

                {/* DataTable */}
                <DataTable
                    columns={columns}
                    data={tableData}
                    rowKey="id"
                    enableSearch={true}
                    searchPlaceholder="Search media files..."
                    enablePagination={true}
                    pageSize={10}
                    enableSorting={true}
                    enableFiltering={true}
                    enableExport={true}
                    onDelete={handleDelete}
                    showActions={true}
                    loading={loading}
                />
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setFileToDelete(null)
                }}
                onConfirm={confirmDelete}
                title="Delete Media File"
                message={`Are you sure you want to delete "${fileToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </>
    )
}
