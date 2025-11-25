'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "@/components/common/DataTable"
import ConfirmModal from "@/components/common/ConfirmModal"
import { fetchBrandsAsync, deleteBrandAsync } from "@/lib/features/brand/brandSlice"
import toast from "react-hot-toast"

export default function AdminBrands() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { brands, loading } = useSelector((state) => state.brand)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedBrand, setSelectedBrand] = useState(null)

    useEffect(() => {
        dispatch(fetchBrandsAsync())
    }, [dispatch])

    const columns = [
        {
            key: 'sn',
            label: 'S.N.',
            sortable: true,
            width: 80,
            render: (_, record, index) => index + 1,
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

    const handleEdit = (brand) => {
        router.push(`/admin/brands/edit/${brand.id || brand._id}`)
    }

    const handleDelete = (brand) => {
        setSelectedBrand(brand)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (selectedBrand) {
            try {
                await dispatch(deleteBrandAsync(selectedBrand.id || selectedBrand._id)).unwrap()
                toast.success('Brand deleted successfully!')
                dispatch(fetchBrandsAsync()) // Refresh the list
                setSelectedBrand(null)
            } catch (err) {
                toast.error(err || 'Failed to delete brand')
            }
        }
    }

    // Format data for table
    const formattedData = brands.map(brand => ({
        ...brand,
        id: brand.id || brand._id,
    }))

    return (
        <div className="space-y-6">
            {loading && formattedData.length === 0 ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={formattedData}
                    rowKey="id"
                    enableSearch={true}
                    searchPlaceholder="Search brands..."
                    enablePagination={true}
                    pageSize={10}
                    enableSorting={true}
                    enableFiltering={true}
                    enableExport={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showActions={true}
                />
            )}
            
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setSelectedBrand(null)
                }}
                onConfirm={confirmDelete}
                title="Delete Brand"
                message={selectedBrand ? `Are you sure you want to delete "${selectedBrand.title}"? This action cannot be undone.` : 'Are you sure you want to delete this brand?'}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    )
}
