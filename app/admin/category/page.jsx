'use client'

import { useRouter } from "next/navigation"
import DataTable from "@/components/common/DataTable"
import { ImageIcon } from "lucide-react"

export default function AdminCategory() {
    const router = useRouter()

    const categories = [
        { id: 12, sn: 12, title: "PP ROPE", englishName: "PP ROPE", homepage: "Yes", slug: "PPROPE", isParent: "Yes", parentCategory: "", status: "active" },
        { id: 13, sn: 13, title: "Monobloc pump", englishName: "Monobloc pump", homepage: "Yes", slug: "Monoblocpump", isParent: "No", parentCategory: "Water-Pumps", status: "active" },
        { id: 14, sn: 14, title: "open well submersible pump", englishName: "open well submersible pump", homepage: "Yes", slug: "open-well-submersible-pump", isParent: "No", parentCategory: "Water-Pumps", status: "active" },
        { id: 15, sn: 15, title: "Borewell submersible pump", englishName: "Borewell submersible pump", homepage: "Yes", slug: "Borewell-submersible-pump", isParent: "No", parentCategory: "Water-Pumps", status: "active" },
        { id: 16, sn: 16, title: "Pressure booster pump", englishName: "Pressure booster pump", homepage: "Yes", slug: "Pressure-booster-pump", isParent: "No", parentCategory: "Water-Pumps", status: "active" },
        { id: 17, sn: 17, title: "Borewell jet pump", englishName: "Borewell jet pump", homepage: "No", slug: "Borewell-jet-pump", isParent: "No", parentCategory: "Water-Pumps", status: "active" },
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
        router.push(`/admin/category/edit/${category.id}`)
    }

    const handleDelete = (category) => {
        // Implement delete logic here
        console.log('Deleting category:', category)
    }

    return (
        <div className="space-y-6">
            <DataTable
                columns={columns}
                data={categories}
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
        </div>
    )
}
