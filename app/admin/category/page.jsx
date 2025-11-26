'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "@/components/common/DataTable"
import ConfirmModal from "@/components/common/ConfirmModal"
import { ImageIcon } from "lucide-react"
import { fetchCategoriesAsync, deleteCategoryAsync } from "@/lib/features/category/categorySlice"
import toast from "react-hot-toast"

export default function AdminCategory() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { categories, loading } = useSelector((state) => state.category)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)

    useEffect(() => {
        dispatch(fetchCategoriesAsync())
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
            key: 'englishName',
            label: 'English Name',
            sortable: true,
        },
        {
            key: 'homepage',
            label: 'Homepage?',
            sortable: true,
            filterable: true,
            filters: [
                { text: 'Yes', value: 'Yes' },
                { text: 'No', value: 'No' }
            ],
        },
        {
            key: 'slug',
            label: 'Slug',
            sortable: true,
        },
        {
            key: 'isParent',
            label: 'Is Parent',
            sortable: true,
            filterable: true,
            filters: [
                { text: 'Yes', value: 'Yes' },
                { text: 'No', value: 'No' }
            ],
        },
        {
            key: 'parentCategory',
            label: 'Parent Category',
            sortable: true,
            filterable: true,
            render: (value) => value || '-',
        },
        {
            key: 'photo',
            label: 'Photo',
            render: () => <ImageIcon size={20} className="text-gray-400" />,
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

    const handleEdit = (category) => {
        router.push(`/admin/category/edit/${category.id || category._id}`)
    }

    const handleDelete = (category) => {
        setSelectedCategory(category)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (selectedCategory) {
            try {
                await dispatch(deleteCategoryAsync(selectedCategory.id || selectedCategory._id)).unwrap()
                toast.success('Category deleted successfully!')
                dispatch(fetchCategoriesAsync()) // Refresh the list
                setSelectedCategory(null)
            } catch (err) {
                toast.error(err || 'Failed to delete category')
            }
        }
    }

    // Format data for table and add serial numbers
    const formattedData = categories.map((cat, index) => ({
        ...cat,
        id: cat.id || cat._id,
        sn: index + 1,
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
                    searchPlaceholder="Search categories..."
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
                    setSelectedCategory(null)
                }}
                onConfirm={confirmDelete}
                title="Delete Category"
                message={selectedCategory ? `Are you sure you want to delete "${selectedCategory.title}"? This action cannot be undone.` : 'Are you sure you want to delete this category?'}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    )
}
