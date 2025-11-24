'use client'

import { Plus } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminAssetManager() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('Images')
    const [assets, setAssets] = useState({
        Images: [],
        Videos: [],
        Shorts: []
    })

    const tabs = ['Images', 'Videos', 'Shorts']

    const handleUpload = () => {
        router.push('/admin/asset-manager/upload')
    }

    const getEmptyMessage = () => {
        switch (activeTab) {
            case 'Images':
                return 'No images found.'
            case 'Videos':
                return 'No videos found.'
            case 'Shorts':
                return 'No shorts found.'
            default:
                return 'No assets found.'
        }
    }

    return (
        <div className="bg-white">
            {/* Header Section */}
            <div className="flex items-center justify-between p-6">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Uploaded Assets</h1>
                <button
                    onClick={handleUpload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                    <Plus size={18} />
                    Upload New
                </button>
            </div>

            {/* Tabs Section */}
            <div>
                <div className="flex gap-6 px-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-1 text-sm font-medium transition-colors relative ${
                                activeTab === tab
                                    ? 'text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {assets[activeTab] && assets[activeTab].length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {assets[activeTab].map((asset, index) => (
                            <div
                                key={index}
                                className="overflow-hidden transition-shadow"
                            >
                                {activeTab === 'Images' ? (
                                    <img
                                        src={asset.url}
                                        alt={asset.name}
                                        className="w-full h-32 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-400">Video/Short</span>
                                    </div>
                                )}
                                <div className="p-2">
                                    <p className="text-xs text-gray-600 truncate">{asset.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-sm">{getEmptyMessage()}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
