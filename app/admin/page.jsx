'use client'

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { FolderTree, Package, ClipboardList, FolderOpen } from "lucide-react"

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Sample data - replace with actual API calls
    const stats = {
        category: 15,
        products: 20,
        order: 0,
        post: 0
    }

    // Sample earnings data for ApexCharts
    const earningsData = {
        series: [{
            name: 'Earnings',
            data: [0, 0, 0, 0, 0, 0]
        }],
        options: {
            chart: {
                type: 'line',
                height: 250,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 2,
                colors: ['#3b82f6']
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.3,
                    stops: [0, 90, 100],
                    colorStops: [
                        {
                            offset: 0,
                            color: '#3b82f6',
                            opacity: 0.1
                        },
                        {
                            offset: 100,
                            color: '#3b82f6',
                            opacity: 0
                        }
                    ]
                }
            },
            markers: {
                size: 4,
                colors: ['#3b82f6'],
                strokeColors: '#fff',
                strokeWidth: 2,
                hover: {
                    size: 6
                }
            },
            xaxis: {
                categories: ['January', 'March', 'May', 'July', 'September', 'November'],
                labels: {
                    style: {
                        colors: '#6b7280',
                        fontSize: '12px'
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return "$" + val
                    },
                    style: {
                        colors: '#6b7280',
                        fontSize: '12px'
                    }
                },
                min: -1,
                max: 1
            },
            grid: {
                borderColor: '#e5e7eb',
                strokeDashArray: 3,
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            },
            tooltip: {
                theme: 'light',
                y: {
                    formatter: function (val) {
                        return "$" + val
                    }
                }
            },
            legend: {
                show: true,
                position: 'bottom',
                horizontalAlign: 'left',
                markers: {
                    width: 8,
                    height: 8,
                    radius: 4
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 0
                }
            }
        }
    }

    return (
        <div className="space-y-6">
            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Card */}
                <div className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Category</p>
                            <p className="text-3xl font-bold text-blue-900">{stats.category}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl ml-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <FolderTree size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Products Card */}
                <div className="relative bg-gradient-to-br from-green-50 via-green-100 to-green-50 border-l-4 border-green-600 p-6 rounded-r-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Products</p>
                            <p className="text-3xl font-bold text-green-900">{stats.products}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl ml-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Package size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Order Card */}
                <div className="relative bg-gradient-to-br from-teal-50 via-teal-100 to-teal-50 border-l-4 border-teal-600 p-6 rounded-r-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">Order</p>
                            <p className="text-3xl font-bold text-teal-900">{stats.order}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl ml-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <ClipboardList size={28} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Post Card */}
                <div className="relative bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">Post</p>
                            <p className="text-3xl font-bold text-yellow-900">{stats.post}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl ml-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <FolderOpen size={28} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings Overview and Users Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings Overview */}
                <div className="bg-white p-6 shadow-sm rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Earnings Overview</h2>
                    {mounted ? (
                        <Chart
                            options={earningsData.options}
                            series={earningsData.series}
                            type="line"
                            height={250}
                        />
                    ) : (
                        <div className="h-[250px] flex items-center justify-center">
                            <p className="text-gray-400">Loading chart...</p>
                        </div>
                    )}
                </div>

                {/* Users Section */}
                <div className="bg-white p-6 shadow-sm rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Users</h2>
                    <p className="text-sm text-gray-600 mb-6">Last 7 Days registered user</p>
                    <div className="flex items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-500">No data</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
