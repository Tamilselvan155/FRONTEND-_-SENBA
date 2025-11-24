'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import DataTable from "@/components/common/DataTable"

export default function AdminProducts() {
    const router = useRouter()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const products = [
        {
            id: 1,
            sn: 33,
            title: "CAR WASHING TRIPLE PISTON PUMP (three phase motor)",
            category: "Water-Pumps SS monobloc pump",
            isFeatured: "Yes",
            status: "active"
        },
        {
            id: 2,
            sn: 28,
            title: "CAR WASHING TRIPLE PISTON PUMP (single phase motor)",
            category: "Water-Pumps SS monobloc pump",
            isFeatured: "Yes",
            status: "active"
        },
        {
            id: 3,
            sn: 26,
            title: "MINI PETROL GENERATOR",
            category: "Water-Pumps Petrol engine pump",
            isFeatured: "Yes",
            status: "active"
        },
        {
            id: 4,
            sn: 25,
            title: "BARE PETROL ENGINE",
            category: "Water-Pumps Petrol engine pump",
            isFeatured: "Yes",
            status: "active"
        },
        {
            id: 5,
            sn: 24,
            title: "PETROL ENGINE WATER PUMP",
            category: "Water-Pumps Petrol engine pump",
            isFeatured: "Yes",
            status: "active"
        },
        {
            id: 6,
            sn: 21,
            title: "STAINLESS STEEL MONOBLOC PUMP",
            category: "Water-Pumps SS monobloc pump",
            isFeatured: "Yes",
            status: "active"
        }
    ]

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
        router.push(`/admin/products/edit/${product.id}`)
    }

    const handleDelete = (product) => {
        setSelectedProduct(product)
        setDeleteModalOpen(true)
    }

    const confirmDelete = () => {
        // Implement delete logic here
        console.log('Deleting product:', selectedProduct)
        setDeleteModalOpen(false)
        setSelectedProduct(null)
    }

    return (
        <div className="space-y-6">
            <DataTable
                columns={columns}
                data={products}
                rowKey="id"
                enableSearch={true}
                searchPlaceholder="Search products..."
                enablePagination={true}
                pageSize={10}
                enableSorting={true}
                enableFiltering={true}
                enableExport={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
            />
        </div>
    )
}
