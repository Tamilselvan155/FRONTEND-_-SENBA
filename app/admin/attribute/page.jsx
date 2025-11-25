'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "@/components/common/DataTable"
import ConfirmModal from "@/components/common/ConfirmModal"
import { fetchAttributesAsync, deleteAttributeAsync } from "@/lib/features/attribute/attributeSlice"
import toast from "react-hot-toast"

export default function AdminAttribute() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { attributes, loading } = useSelector((state) => state.attribute)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedAttribute, setSelectedAttribute] = useState(null)

    useEffect(() => {
        dispatch(fetchAttributesAsync())
    }, [dispatch])

    const columns = [
        {
            key: 'id',
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
    ]

    const handleEdit = (attribute) => {
        router.push(`/admin/attribute/edit/${attribute.id || attribute._id}`)
    }

    const handleDelete = (attribute) => {
        setSelectedAttribute(attribute)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (selectedAttribute) {
            try {
                await dispatch(deleteAttributeAsync(selectedAttribute.id || selectedAttribute._id)).unwrap()
                toast.success('Attribute deleted successfully!')
                dispatch(fetchAttributesAsync()) // Refresh the list
                setSelectedAttribute(null)
            } catch (err) {
                toast.error(err || 'Failed to delete attribute')
            }
        }
    }

    // Format data for table (handle both id and _id)
    const formattedData = attributes.map(attr => ({
        ...attr,
        id: attr.id || attr._id,
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
                    searchPlaceholder="Search attributes..."
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
                    setSelectedAttribute(null)
                }}
                onConfirm={confirmDelete}
                title="Delete Attribute"
                message={selectedAttribute ? `Are you sure you want to delete "${selectedAttribute.title}"? This action cannot be undone.` : 'Are you sure you want to delete this attribute?'}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    )
}
