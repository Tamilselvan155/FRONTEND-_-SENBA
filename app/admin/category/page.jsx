'use client'

import { Plus, Edit, ChevronsUpDown, ImageIcon } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminCategory() {
    const router = useRouter()
    const [entriesPerPage, setEntriesPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")

    const categories = [
        { id: 12, sn: 12, title: "PP ROPE", englishName: "PP ROPE", homepage: "Yes", slug: "PPROPE", isParent: "Yes", parentCategory: "", status: "active" },
        { id: 13, sn: 13, title: "Monobloc pump", englishName: "Monobloc pump", homepage: "Yes", slug: "Monoblocpump", isParent: "No", parentCategory: "Water-Pumps", status: "active" },
        { id: 14, sn: 14, title: "open well submersible pump", englishName: "open well submersible pump", homepage: "Yes", slug: "open-well-submersible-pump", isParent: "No", parentCategory: "Water-Pumps", status: "active" },
        { id: 15, sn: 15, title: "Borewell submersible pump", englishName: "Borewell submersible pump", homepage: "Yes", slug: "Borewell-submersible-pump", isParent: "No", parentCategory: "Water-Pumps", status: "active" },
        { id: 16, sn: 16, title: "Pressure booster pump", englishName: "Pressure booster pump", homepage: "Yes", slug: "Pressure-booster-pump", isParent: "No", parentCategory: "Water-Pumps", status: "active" },
        { id: 17, sn: 17, title: "Borewell jet pump", englishName: "Borewell jet pump", homepage: "No", slug: "Borewell-jet-pump", isParent: "No", parentCategory: "Water-Pumps", status: "active" },
    ]

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-blue-600">Category Lists</h1>
                <button 
                    onClick={() => router.push('/admin/category/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            {/* Controls Section */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Show</span>
                    <select 
                        value={entriesPerPage} 
                        onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-700">entries</span>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Search:</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=""
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    S.N.
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Title
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    English Name
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Homepage?
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Slug
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Is Parent
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Parent Category
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Photo
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Status
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Action
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {category.sn}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {category.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {category.englishName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {category.homepage}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {category.slug}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {category.isParent}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {category.parentCategory || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <ImageIcon size={20} className="text-gray-400" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                        {category.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition">
                                        <Edit size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Section */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-700">
                    Showing 1 to {categories.length} of {categories.length} entries
                </p>
            </div>
        </div>
    )
}

