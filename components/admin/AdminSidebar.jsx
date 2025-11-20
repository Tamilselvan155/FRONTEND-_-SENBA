'use client'

import { usePathname } from "next/navigation"
import { ImageIcon, Tag, List, FolderTree, Building2, Package, FolderOpen, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { assets } from "@/assets/assets"

const AdminSidebar = ({ isCollapsed = false }) => {

    const pathname = usePathname()

    const sidebarLinks = [
        { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
        { name: 'Attribute', href: '/admin/attribute', icon: Tag },
        { name: 'Attribute value', href: '/admin/attribute-value', icon: List },
        { name: 'Category', href: '/admin/category', icon: FolderTree },
        { name: 'Brands', href: '/admin/brands', icon: Building2 },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Asset Manager', href: '/admin/asset-manager', icon: FolderOpen },
    ]

    return (
        <aside className={`flex h-screen flex-col bg-blue-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
            {/* Logo Section */}
            <div className={`flex h-14 items-center justify-center bg-white shadow-sm w-full ${isCollapsed ? 'px-2' : 'px-3'}`}>
                {isCollapsed ? (
                    <Image 
                        src={assets.gs_logo} 
                        alt="Logo" 
                        width={40} 
                        height={40} 
                        className="object-contain w-10 h-10"
                        priority
                    />
                ) : (
                    <Image 
                        src={assets.gs_logo} 
                        alt="Logo" 
                        width={240} 
                        height={40} 
                        className="object-contain w-full h-full max-h-12"
                        priority
                    />
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-900">
                <ul className="space-y-1">
                    {sidebarLinks.map((link, index) => {
                        const isActive = pathname === link.href
                        return (
                            <li key={index}>
                                <Link 
                                    href={link.href} 
                                    title={isCollapsed ? link.name : ''}
                                    className={`group relative flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
                                        isCollapsed ? 'justify-center px-2' : 'justify-between gap-3 px-3'
                                    } ${
                                        isActive
                                            ? 'bg-blue-800 text-white shadow-sm' 
                                            : 'text-blue-100 hover:bg-blue-800/70 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <link.icon 
                                            size={18} 
                                            className={`flex-shrink-0 transition-colors ${
                                                isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                                            }`} 
                                        />
                                        {!isCollapsed && (
                                            <span className="truncate">{link.name}</span>
                                        )}
                                    </div>
                                    {!isCollapsed && (
                                        <ChevronRight 
                                            size={14} 
                                            className={`flex-shrink-0 transition-colors ${
                                                isActive ? 'text-white' : 'text-blue-400 group-hover:text-white'
                                            }`} 
                                        />
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}

export default AdminSidebar