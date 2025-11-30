'use client'

import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft, User, Settings, LogOut, ChevronDown, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { assets } from "@/assets/assets"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { signOut } from "@/lib/features/login/authSlice"
import { clearAuthData } from "@/lib/utils/authUtils"
import toast from "react-hot-toast"

const AdminNavbar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [userEmail, setUserEmail] = useState('admin@gocart.com')
    const [userName, setUserName] = useState('Admin')

    // Get user data from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user')
            if (userStr) {
                try {
                    const user = JSON.parse(userStr)
                    setUserEmail(user.email || 'admin@gocart.com')
                    setUserName(user.name || 'Admin')
                } catch (e) {
                    console.error('Error parsing user data:', e)
                }
            }
        }
    }, [])

    // Check if we're on a module page (not dashboard)
    const isModulePage = pathname !== '/admin' && pathname !== '/admin/'
    const isAddOrEditPage = pathname.includes('/add') || pathname.includes('/edit') || pathname.includes('/view')
    
    // Get module name from path
    const getModuleName = (path) => {
        if (path === '/admin') return ''
        if (path.includes('/products')) {
            if (path.includes('/add')) return 'Add Product'
            if (path.includes('/edit')) return 'Edit Product'
            if (path.includes('/view')) return 'View Product'
            return 'Products'
        }
        if (path.includes('/category')) {
            if (path.includes('/add')) return 'Add Category'
            return 'Categories'
        }
        if (path.includes('/brands')) {
            if (path.includes('/add')) return 'Add Brand'
            return 'Brands'
        }
        if (path.includes('/banners')) {
            if (path.includes('/add')) return 'Add Banner'
            return 'Banners'
        }
        if (path.includes('/attribute-value')) {
            if (path.includes('/add')) return 'Add Attribute Value'
            return 'Attribute Values'
        }
        if (path.includes('/attribute')) {
            if (path.includes('/add')) return 'Add Attribute'
            return 'Attributes'
        }
        if (path.includes('/stores')) return 'Stores'
        if (path.includes('/coupons')) return 'Coupons'
        if (path.includes('/asset-manager')) return 'Asset Manager'
        
        const pathName = path.split('/').pop()
        if (!pathName) return ''
        
        return pathName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    // Get add route for current module
    const getAddRoute = (path) => {
        if (path.includes('/products')) return '/admin/products/add'
        if (path.includes('/category')) return '/admin/category/add'
        if (path.includes('/brands')) return '/admin/brands/add'
        if (path.includes('/banners')) return '/admin/banners/add'
        if (path.includes('/attribute-value')) return '/admin/attribute-value/add'
        if (path.includes('/attribute')) return '/admin/attribute/add'
        return null
    }

    const moduleName = getModuleName(pathname)
    const addRoute = getAddRoute(pathname)
    const showAddButton = isModulePage && !isAddOrEditPage && addRoute

    // Get list route for current module
    const getListRoute = (path) => {
        if (path.includes('/products')) return '/admin/products'
        if (path.includes('/category')) return '/admin/category'
        if (path.includes('/brands')) return '/admin/brands'
        if (path.includes('/banners')) return '/admin/banners'
        if (path.includes('/attribute-value')) return '/admin/attribute-value'
        if (path.includes('/attribute')) return '/admin/attribute'
        if (path.includes('/asset-manager')) return '/admin/asset-manager'
        return '/admin'
    }

    const handleBack = () => {
        // If on edit, add, or view page, go to list page; otherwise go to dashboard
        if (isAddOrEditPage) {
            const listRoute = getListRoute(pathname)
            router.push(listRoute)
        } else {
            router.push('/admin')
        }
    }

    const handleLogout = async () => {
        try {
            // Show loading state
            const logoutToast = toast.loading('Logging out...')
            
            // Optional: Call logout API endpoint (if you want to invalidate token on server)
            // This is optional but recommended for security
            try {
                const token = localStorage.getItem('token')
                if (token) {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }).catch(() => {
                        // Ignore API errors - still proceed with client-side logout
                    })
                }
            } catch (apiError) {
                // Ignore API errors - still proceed with client-side logout
                console.log('Logout API call failed, proceeding with client-side logout')
            }
            
            // Clear Redux state
            dispatch(signOut())
            
            // Clear all authentication data (localStorage, sessionStorage, etc.)
            clearAuthData()
            
            // Dismiss loading toast and show success
            toast.dismiss(logoutToast)
            toast.success('Logged out successfully', { duration: 2000 })
            
            // Dispatch custom event to notify other components
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('adminLogout'))
            }
            
            // Small delay to ensure state is cleared before navigation
            setTimeout(() => {
                // Navigate to login page (root route)
                router.push('/')
                // Force a hard refresh to clear any cached state
                router.refresh()
            }, 100)
        } catch (error) {
            console.error('Logout error:', error)
            toast.error('Error during logout. Redirecting...')
            
            // Even if there's an error, clear everything and redirect
            dispatch(signOut())
            clearAuthData()
            
            setTimeout(() => {
                router.push('/')
                router.refresh()
            }, 500)
        }
    }

    return (
        <header className="bg-[#f0f9ff] border-b border-[#009fe3]/20 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between h-16 px-6">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    {isModulePage && (
                        <button
                            onClick={handleBack}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors cursor-pointer"
                            title="Back to Dashboard"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    
                    {!isModulePage && (
                        <div className="flex items-center space-x-3">
                            <Image 
                                src={assets.gs_logo || assets.WV_logo} 
                                alt="logo" 
                                width={100} 
                                height={100} 
                                className="cursor-pointer" 
                            />
                            <h1 className="text-2xl font-bold text-black">
                                GoCart Admin
                            </h1>
                        </div>
                    )}
                    
                    {isModulePage && (
                        <h2 className="text-xl font-semibold text-gray-900">{moduleName}</h2>
                    )}
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Add Button - Only on list pages */}
                    {showAddButton && (
                        <button
                            onClick={() => router.push(addRoute)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm font-medium"
                        >
                            <Plus size={16} />
                            Add
                        </button>
                    )}
                    
                    {/* Profile Dropdown - Only on Dashboard */}
                    {!isModulePage && (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 px-2 py-1.5 hover:bg-white/60 rounded-lg transition-colors group cursor-pointer"
                            >
                                <div className="hidden md:block text-left">
                                    <div className="text-sm font-medium text-gray-900">Admin</div>
                                    <div className="text-xs text-gray-500">Administrator</div>
                                </div>
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <ChevronDown className="hidden md:block text-gray-400 group-hover:text-gray-600 transition-colors w-3 h-3" />
                            </button>
                            
                            {showUserMenu && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <div className="font-semibold text-gray-900 text-sm">{userName}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{userEmail}</div>
                                        </div>
                                        <Link
                                            href="/admin/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User className="w-4 h-4 mr-3" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/admin/settings"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="w-4 h-4 mr-3" />
                                            Settings
                                        </Link>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={() => {
                                                handleLogout()
                                                setShowUserMenu(false)
                                            }}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default AdminNavbar
