'use client'

import { useRouter } from "next/navigation"
import DataTable from "@/components/common/DataTable"

export default function AdminAttributeValue() {
    const router = useRouter()
    
    const attributeValues = [
        { id: 1, attribute: "kw", value: "93" },
        { id: 2, attribute: "kw", value: "75" },
        { id: 3, attribute: "kw", value: "55" },
        { id: 4, attribute: "kw", value: "45" },
        { id: 5, attribute: "kw", value: "37" },
        { id: 6, attribute: "kw", value: "30" },
        { id: 7, attribute: "kw", value: "26" },
        { id: 8, attribute: "kw", value: "22" },
        { id: 9, attribute: "kw", value: "18.5" },
    ]

    const columns = [
        {
            key: 'id',
            label: '#',
            sortable: true,
            width: 80,
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
        router.push(`/admin/attribute-value/edit/${item.id}`)
    }

    const handleDelete = (item) => {
        // Implement delete logic here
        console.log('Deleting attribute value:', item)
    }

    return (
        <div className="space-y-6">
            <DataTable
                columns={columns}
                data={attributeValues}
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
        </div>
    )
}
