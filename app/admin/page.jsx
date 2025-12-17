'use client'

import { useState, useEffect, useMemo, memo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { FolderTree, Package, ClipboardList, FolderOpen, Store, Tag, ImageIcon, Users } from "lucide-react"
import Link from "next/link"
import { fetchCategoriesAsync } from "@/lib/features/category/categorySlice"
import { fetchProductsAsync } from "@/lib/features/product/productSlice"
import { fetchBrandsAsync } from "@/lib/features/brand/brandSlice"
import { fetchAttributesAsync } from "@/lib/features/attribute/attributeSlice"
import { fetchAttributeValuesAsync } from "@/lib/features/attributeValue/attributeValueSlice"
import { fetchBannersAsync } from "@/lib/features/banner/bannerSlice"
import { fetchAllMediaFilesAsync } from "@/lib/features/asset/assetSlice"
import { fetchUsersAsync } from "@/lib/features/user/userSlice"
import AdminLogin from "@/components/admin/AdminLogin"

// Memoize module card to prevent unnecessary re-renders
const ModuleCard = memo(({ module, getIconColorClass }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden">
        {/* Main Card Content */}
        <Link
            href={module.route}
            className="w-full p-6 text-left cursor-pointer flex-shrink-0 block hover:bg-gray-50 transition-colors duration-150"
        >
            <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColorClass(module.color)}`}>
                        <module.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {module.name}
                        </h3>
                        {module.count !== undefined ? (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {`${module.count.toLocaleString()} items`}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 mt-0.5 h-5">
                                &nbsp;
                            </p>
                        )}
                    </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>

        {/* Sub-Navigation */}
        {module.subNav && module.subNav.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex-shrink-0">
                <div className={`grid ${module.subNav.length === 4 ? 'grid-cols-2' : module.subNav.length === 3 ? 'grid-cols-3' : 'grid-cols-1'} gap-2`}>
                    {module.subNav.map((subNavItem, index) => (
                        <Link
                            key={index}
                            href={subNavItem.route}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-white border border-gray-200 hover:border-gray-300 transition-all duration-150"
                        >
                            <subNavItem.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{subNavItem.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        )}
    </div>
));

ModuleCard.displayName = 'ModuleCard';

export default function AdminDashboard() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    
    // Get auth state from Redux
    const { email } = useSelector((state) => state.auth)
    
    // Check authentication on mount and when email changes
    useEffect(() => {
        const checkAuth = () => {
            // Check if user is logged in via Redux state
            const hasEmail = email && email.trim() !== ''
            
            // Also check localStorage for token (backup check)
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
            
            // Check user role FIRST before setting authenticated state
            if (userStr) {
                try {
                    const user = JSON.parse(userStr)
                    // If user is not admin, redirect to homepage immediately
                    if (user.role !== 'admin') {
                        router.replace('/')
                        setIsChecking(false)
                        return
                    }
                } catch (e) {
                    console.error('Error parsing user data:', e)
                }
            }
            
            const authenticated = hasEmail || (token !== null && userStr !== null)
            setIsAuthenticated(authenticated)
            setIsChecking(false)
        }
        
        checkAuth()
        
        // Also listen for storage changes (in case login/logout happens in another tab)
        if (typeof window !== 'undefined') {
            const handleStorageChange = (e) => {
                if (e.key === 'token' || e.key === 'user') {
                    checkAuth()
                }
            }
            
            window.addEventListener('storage', handleStorageChange)
            // Also listen for custom logout event
            window.addEventListener('adminLogout', checkAuth)
            
            return () => {
                window.removeEventListener('storage', handleStorageChange)
                window.removeEventListener('adminLogout', checkAuth)
            }
        }
    }, [email, router])
    
    // Get data from Redux store
    const categories = useSelector((state) => state.category.categories || [])
    const products = useSelector((state) => state.product.products || [])
    const brands = useSelector((state) => state.brand.brands || [])
    const attributes = useSelector((state) => state.attribute.attributes || [])
    const attributeValues = useSelector((state) => state.attributeValue.attributeValues || [])
    const banners = useSelector((state) => state.banner.banners || [])
    const assetManager = useSelector((state) => state.asset.mediaFiles?.length || 0)
    const users = useSelector((state) => state.user.users || [])
    
    // Fetch data on mount only if authenticated
    useEffect(() => {
        if (isAuthenticated && !isChecking) {
            dispatch(fetchCategoriesAsync())
            dispatch(fetchProductsAsync())
            dispatch(fetchBrandsAsync())
            dispatch(fetchAttributesAsync())
            dispatch(fetchAttributeValuesAsync())
            dispatch(fetchBannersAsync())
            dispatch(fetchAllMediaFilesAsync())
            dispatch(fetchUsersAsync())
        }
    }, [dispatch, isAuthenticated, isChecking])
    
    // Calculate actual counts from Redux store
    const stats = useMemo(() => ({
        category: Array.isArray(categories) ? categories.length : 0,
        products: Array.isArray(products) ? products.length : 0,
        brands: Array.isArray(brands) ? brands.length : 0,
        attributes: Array.isArray(attributes) ? attributes.length : 0,
        attributeValues: Array.isArray(attributeValues) ? attributeValues.length : 0,
        banners: Array.isArray(banners) ? banners.length : 0,
        assetManager: assetManager,
        users: Array.isArray(users) ? users.length : 0,
        order: 0,
        stores: 0,
    }), [categories, products, brands, attributes, attributeValues, banners, assetManager, users])

    const modules = useMemo(() => [
        {
            id: 'banners',
            name: 'Banners',
            count: stats.banners,
            color: 'orange',
            icon: ImageIcon,
            route: '/admin/banners',
            subNav: [
                { label: 'Add Banner', route: '/admin/banners/add', icon: ImageIcon }
            ]
        },
        {
            id: 'attributes',
            name: 'Attribute',
            count: stats.attributes,
            color: 'teal',
            icon: Tag,
            route: '/admin/attribute',
            subNav: [
                { label: 'Add Attribute', route: '/admin/attribute/add', icon: Tag }
            ]
        },
        {
            id: 'attribute-values',
            name: 'Attribute Value',
            count: stats.attributeValues,
            color: 'cyan',
            icon: Tag,
            route: '/admin/attribute-value',
            subNav: [
                { label: 'Add Attribute Value', route: '/admin/attribute-value/add', icon: Tag }
            ]
        },
        {
            id: 'categories',
            name: 'Category',
            count: stats.category,
            color: 'purple',
            icon: FolderTree,
            route: '/admin/category',
            subNav: [
                { label: 'Add Category', route: '/admin/category/add', icon: FolderTree }
            ]
        },
        {
            id: 'brands',
            name: 'Brands',
            count: stats.brands,
            color: 'green',
            icon: Store,
            route: '/admin/brands',
            subNav: [
                { label: 'Add Brand', route: '/admin/brands/add', icon: Store }
            ]
        },
        {
            id: 'products',
            name: 'Products',
            count: stats.products,
            color: 'blue',
            icon: Package,
            route: '/admin/products',
            subNav: [
                { label: 'View All', route: '/admin/products', icon: Package }
            ]
        },
        {
            id: 'asset-manager',
            name: 'Asset Manager',
            count: stats.assetManager,
            color: 'pink',
            icon: FolderOpen,
            route: '/admin/asset-manager',
            subNav: [
                { label: 'View All', route: '/admin/asset-manager', icon: FolderOpen }
            ]
        },
        {
            id: 'users',
            name: 'User Management',
            count: stats.users,
            color: 'indigo',
            icon: Users,
            route: '/admin/users',
            subNav: [
                { label: 'Add User', route: '/admin/users/add', icon: Users }
            ]
        },
    ], [stats])

    const getIconColorClass = useMemo(() => {
        const colorMap = {
            blue: 'bg-blue-500 text-white',
            purple: 'bg-purple-500 text-white',
            orange: 'bg-orange-500 text-white',
            indigo: 'bg-indigo-500 text-white',
            pink: 'bg-pink-500 text-white',
            green: 'bg-green-500 text-white',
            teal: 'bg-teal-500 text-white',
            emerald: 'bg-emerald-500 text-white',
            cyan: 'bg-cyan-500 text-white',
            violet: 'bg-violet-500 text-white',
            slate: 'bg-slate-500 text-white',
        };
        return (color) => colorMap[color] || 'bg-gray-500 text-white';
    }, []);


    // Show loading state while checking authentication
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return <AdminLogin />
    }

    // Show dashboard if authenticated
    return (
        <div className="h-full w-full">
            {/* Main Content */}
            <div className="w-full h-full">
                {/* Header Section */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage and access all your modules</p>
                    </div>
                </div>

                {/* Modules Grid */}
                {modules.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-6">
                        {modules.map((module) => (
                            <ModuleCard
                                key={module.id}
                                module={module}
                                getIconColorClass={getIconColorClass}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}
