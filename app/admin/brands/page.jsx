'use client'

import { useRouter } from "next/navigation"
import DataTable from "@/components/common/DataTable"

export default function AdminBrands() {
    const router = useRouter()

    const brands = [
        {
            id: 1,
            sn: 1,
            title: "SENBA",
            slug: "SENBA",
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
        router.push(`/admin/brands/edit/${brand.id}`)
    }

    const handleDelete = (brand) => {
        // Implement delete logic here
        console.log('Deleting brand:', brand)
    }

    return (
        <div className="space-y-6">
            <DataTable
                columns={columns}
                data={brands}
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
        </div>
    )
}
