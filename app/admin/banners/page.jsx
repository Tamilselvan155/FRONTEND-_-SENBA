'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "@/components/common/DataTable"
import { ImageIcon } from "lucide-react"
import { fetchBannersAsync, deleteBannerAsync } from "@/lib/features/banner/bannerSlice"
import ConfirmModal from "@/components/common/ConfirmModal"
import toast from "react-hot-toast"
import { getImageUrl } from "@/lib/utils/imageUtils"

export default function AdminBanners() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { banners, loading } = useSelector((state) => state.banner)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [bannerToDelete, setBannerToDelete] = useState(null)

    useEffect(() => {
        dispatch(fetchBannersAsync())
    }, [dispatch])

    const columns = [
        {
            key: 'sn',
            label: 'S.N.',
            sortable: true,
            width: 80,
        },
        {
            key: 'photo',
            label: 'Photo',
            width: 120,
            render: (value, record) => {
                const imageUrl = getImageUrl(value)
                
                if (!imageUrl) {
                    return (
                        <div className="flex items-center justify-center w-20 h-12 rounded border border-gray-200 bg-gray-50">
                            <ImageIcon size={20} className="text-gray-400" />
                        </div>
                    )
                }
                
                return (
                    <div className="flex items-center justify-center">
                        <div className="w-20 h-12 rounded overflow-hidden border border-gray-200 bg-gray-100 shadow-sm relative group">
                            <img
                                src={imageUrl}
                                alt={record?.title || 'Banner thumbnail'}
                                className="object-cover w-full h-full transition-opacity duration-200"
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
            },
        },
        {
            key: 'title',
            label: 'Title',
            sortable: true,
        },
        {
            key: 'slug',
            label: 'Slug',
            sortable: true,
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            filterable: true,
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' }
            ],
            render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                    value === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                }`}>
                    {value}
                </span>
            ),
        },
    ]

    const handleEdit = (banner) => {
        const bannerId = banner.id || banner._id
        router.push(`/admin/banners/edit/${bannerId}`)
    }

    const handleDelete = (banner) => {
        setBannerToDelete(banner)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!bannerToDelete) return
        
        try {
            const bannerId = bannerToDelete.id || bannerToDelete._id
            await dispatch(deleteBannerAsync(bannerId)).unwrap()
            toast.success('Banner deleted successfully!')
            setDeleteModalOpen(false)
            setBannerToDelete(null)
        } catch (error) {
            toast.error(error || 'Failed to delete banner')
        }
    }

    return (
        <>
            <div className="space-y-6">
                <DataTable
                    columns={columns}
                    data={banners || []}
                    rowKey="id"
                    enableSearch={true}
                    searchPlaceholder="Search banners..."
                    enablePagination={true}
                    pageSize={10}
                    enableSorting={true}
                    enableFiltering={true}
                    enableExport={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showActions={true}
                    loading={loading}
                />
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setBannerToDelete(null)
                }}
                onConfirm={confirmDelete}
                title="Delete Banner"
                message={`Are you sure you want to delete "${bannerToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </>
    )
}
