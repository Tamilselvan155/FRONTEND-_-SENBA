'use client'

import { Plus, Edit, Trash2, ChevronsUpDown, ImageIcon } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminBanners() {
    const router = useRouter()
    const [entriesPerPage, setEntriesPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")

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

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-blue-600">Banners List</h1>
                <button 
                    onClick={() => router.push('/admin/banners/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                    <Plus size={18} />
                    Add Banner
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
                                    Slug
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
                        {banners.map((banner) => (
                            <tr key={banner.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {banner.sn}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {banner.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {banner.slug}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon size={20} className="text-gray-400" />
                                        <span className="text-xs text-gray-500 break-all max-w-xs">
                                            {banner.photo}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                        {banner.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition">
                                            <Edit size={14} />
                                        </button>
                                        <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Section */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-700">
                    Showing 1 to {banners.length} of {banners.length} entries
                </p>
            </div>
        </div>
    )
}

