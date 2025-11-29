'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "@/components/common/DataTable"
import ConfirmModal from "@/components/common/ConfirmModal"
import { fetchProductsAsync, deleteProductAsync } from "@/lib/features/product/productSlice"
import toast from "react-hot-toast"

export default function AdminProducts() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { products, loading } = useSelector((state) => state.product)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    useEffect(() => {
        // Always fetch to ensure we have the latest data
        dispatch(fetchProductsAsync())
    }, [dispatch])

    const columns = [
        {
            key: 'sn',
            label: 'S.N.',
            sortable: true,
            width: 80,
        },
        {
            key: 'title',
            label: 'Title',
            sortable: true,
        },
        {
            key: 'category',
            label: 'Category',
            sortable: true,
            filterable: true,
        },
        {
            key: 'isFeatured',
            label: 'Is Featured',
            sortable: true,
            filterable: true,
            filters: [
                { text: 'Yes', value: 'Yes' },
                { text: 'No', value: 'No' }
            ],
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

    const handleEdit = (product) => {
        router.push(`/admin/products/edit/${product.id || product._id}`)
    }

    const handleView = (product) => {
        router.push(`/admin/products/view/${product.id || product._id}`)
    }

    const handleDelete = (product) => {
        setSelectedProduct(product)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (selectedProduct) {
            try {
                await dispatch(deleteProductAsync(selectedProduct.id || selectedProduct._id)).unwrap()
                toast.success('Product deleted successfully!')
                dispatch(fetchProductsAsync()) // Refresh the list
                setSelectedProduct(null)
            } catch (err) {
                toast.error(err || 'Failed to delete product')
            }
        }
    }

    // Format data for table (serial numbers will be calculated by DataTable based on pagination)
    const formattedData = products && Array.isArray(products) ? products.map(product => ({
        ...product,
        id: product.id || product._id,
    })) : []

    // Show loading if we're loading AND there are no products yet
    // If products exist in Redux (from pre-fetch), show them immediately
    const isLoading = loading && formattedData.length === 0

    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={formattedData}
                    rowKey="id"
                    enableSearch={true}
                    searchPlaceholder="Search products..."
                    enablePagination={true}
                    pageSize={10}
                    enableSorting={true}
                    enableFiltering={true}
                    enableExport={true}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                    showActions={true}
                />
            )}
            
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setSelectedProduct(null)
                }}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={selectedProduct ? `Are you sure you want to delete "${selectedProduct.title}"? This action cannot be undone.` : 'Are you sure you want to delete this product?'}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    )
}
