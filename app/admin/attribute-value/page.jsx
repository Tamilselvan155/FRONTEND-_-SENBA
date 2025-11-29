'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "@/components/common/DataTable"
import ConfirmModal from "@/components/common/ConfirmModal"
import { fetchAttributeValuesAsync, deleteAttributeValueAsync } from "@/lib/features/attributeValue/attributeValueSlice"
import toast from "react-hot-toast"

export default function AdminAttributeValue() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { attributeValues, loading } = useSelector((state) => state.attributeValue)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    useEffect(() => {
        dispatch(fetchAttributeValuesAsync())
    }, [dispatch])

    const columns = [
        {
            key: 'id',
            label: '#',
            sortable: true,
            width: 80,
            render: (_, record, index) => index + 1,
        },
        {
            key: 'attribute',
            label: 'Attribute',
            sortable: true,
            filterable: true,
        },
        {
            key: 'value',
            label: 'Value',
            sortable: true,
        },
    ]

    const handleEdit = (item) => {
        router.push(`/admin/attribute-value/edit/${item.id || item._id}`)
    }

    const handleDelete = (item) => {
        setSelectedItem(item)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (selectedItem) {
            try {
                await dispatch(deleteAttributeValueAsync(selectedItem.id || selectedItem._id)).unwrap()
                toast.success('Attribute value deleted successfully!')
                dispatch(fetchAttributeValuesAsync()) // Refresh the list
                setSelectedItem(null)
            } catch (err) {
                toast.error(err || 'Failed to delete attribute value')
            }
        }
    }

    // Format data for table
    const formattedData = attributeValues.map(av => ({
        ...av,
        id: av.id || av._id,
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
                    searchPlaceholder="Search attribute values..."
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
                    setSelectedItem(null)
                }}
                onConfirm={confirmDelete}
                title="Delete Attribute Value"
                message={selectedItem ? `Are you sure you want to delete this attribute value? This action cannot be undone.` : 'Are you sure you want to delete this attribute value?'}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    )
}
