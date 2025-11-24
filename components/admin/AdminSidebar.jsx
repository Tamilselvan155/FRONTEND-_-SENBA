'use client'

import { usePathname } from "next/navigation"
import { Gauge, ImageIcon, Tag, List, FolderTree, Building2, Package, FolderOpen, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { assets } from "@/assets/assets"

const AdminSidebar = ({ isSidebarOpen, isSidebarHovered, toggleSidebar, onMouseEnter, onMouseLeave }) => {
    const pathname = usePathname()
    
    // Sidebar is expanded when pinned (open) or hovered on desktop
    const isExpanded = isSidebarOpen || (typeof window !== 'undefined' && isSidebarHovered && window.innerWidth >= 1024)

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: Gauge },
        { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
        { name: 'Attribute', href: '/admin/attribute', icon: Tag },
        { name: 'Attribute value', href: '/admin/attribute-value', icon: List },
        { name: 'Category', href: '/admin/category', icon: FolderTree },
        { name: 'Brands', href: '/admin/brands', icon: Building2 },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Asset Manager', href: '/admin/asset-manager', icon: FolderOpen },
    ]

    const isActiveRoute = (path) => {
        return pathname === path
    }

    return (
        <>
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={`
                    fixed lg:static inset-y-0 left-0 z-30
                    bg-white border-r border-gray-200 shadow-lg
                    transform transition-all duration-200 ease-in-out
                    ${isExpanded ? 'w-64' : 'w-0 lg:w-20'}
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className={`flex items-center h-16 border-b border-gray-200 ${isExpanded ? 'justify-between px-6' : 'justify-center px-2'}`}>
                        <Link href="/admin" className={`flex items-center ${isExpanded ? 'space-x-2' : 'justify-center'}`}>
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Image 
                                    src={assets.gs_logo} 
                                    alt="Logo" 
                                    width={32} 
                                    height={32} 
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            {isExpanded && (
                                <span className="text-xl font-bold text-gray-900 whitespace-nowrap">GoCart</span>
                            )}
                        </Link>
                        {isSidebarOpen && (
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
                        {sidebarLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => typeof window !== 'undefined' && window.innerWidth < 1024 && toggleSidebar()}
                                title={!isExpanded ? item.name : ''}
                                className={`
                                    flex items-center rounded-lg text-sm font-medium transition-colors
                                    ${isExpanded ? 'space-x-3 px-4 py-3' : 'justify-center p-3'}
                                    ${
                                        isActiveRoute(item.href)
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }
                                `}
                            >
                                <span className={isActiveRoute(item.href) ? 'text-blue-700' : 'text-gray-500'}>
                                    <item.icon className="w-5 h-5" />
                                </span>
                                {isExpanded && <span className="whitespace-nowrap">{item.name}</span>}
                            </Link>
                        ))}
                    </nav>

                    {/* User Section */}
                    {isExpanded ? (
                        <div className="border-t border-gray-200 p-4">
                            <Link
                                href="/admin/profile"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">My Profile</p>
                                    <p className="text-xs text-gray-500">View settings</p>
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className="border-t border-gray-200 p-2 hidden lg:block">
                            <Link
                                href="/admin/profile"
                                title="My Profile"
                                className="flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-600" />
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}

export default AdminSidebar
