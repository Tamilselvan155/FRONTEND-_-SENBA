'use client'

import { useRouter } from "next/navigation"
import DataTable from "@/components/common/DataTable"
import { ImageIcon } from "lucide-react"

export default function AdminBanners() {
    const router = useRouter()

    const banners = [
        {
            id: 1,
            sn: 1,
            title: "Banner",
            slug: "banner",
            photo: "http://ecomm.test/storage/photos/1/Banner/banner-01.jpg",
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
            key: 'photo',
            label: 'Photo',
            render: (value) => (
                <div className="flex items-center gap-2">
                    <ImageIcon size={20} className="text-gray-400" />
                    <span className="text-xs text-gray-500 break-all max-w-xs">
                        {value}
                    </span>
                </div>
            ),
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
        router.push(`/admin/banners/edit/${banner.id}`)
    }

    const handleDelete = (banner) => {
        // Implement delete logic here
        console.log('Deleting banner:', banner)
    }

    return (
        <div className="space-y-6">
            <DataTable
                columns={columns}
                data={banners}
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
            />
        </div>
    )
}
