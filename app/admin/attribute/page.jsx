'use client'

import { useRouter } from "next/navigation"
import DataTable from "@/components/common/DataTable"

export default function AdminAttribute() {
    const router = useRouter()
    
    const attributes = [
        { id: 8, title: "qwert" },
        { id: 7, title: "kw" },
        { id: 6, title: "Bore X stroke (mm)" },
        { id: 5, title: "Pipe Size" },
        { id: 4, title: "Type" },
        { id: 3, title: "HP" },
    ]

    const columns = [
        {
            key: 'id',
            label: 'S.N.',
            sortable: true,
            width: 80,
        },
        {
            key: 'title',
            label: 'Title',
            sortable: true,
        },
    ]

    const handleEdit = (attribute) => {
        router.push(`/admin/attribute/edit/${attribute.id}`)
    }

    const handleDelete = (attribute) => {
        // Implement delete logic here
        console.log('Deleting attribute:', attribute)
    }

    return (
        <div className="space-y-6">
            <DataTable
                columns={columns}
                data={attributes}
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
        </div>
    )
}
