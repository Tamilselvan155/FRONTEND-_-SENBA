'use client'
import { useEffect, useState, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"

const AdminLayout = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    
    // Check if user is authenticated
    const { email } = useSelector((state) => state.auth)
    const isAuthenticated = useMemo(() => {
        if (email && email.trim() !== '') return true
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token')
            const user = localStorage.getItem('user')
            return token !== null && user !== null
        }
        return false
    }, [email])

    // Handle client-side mounting to prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    const fetchIsAdmin = useCallback(async () => {
        setIsAdmin(true)
        setLoading(false)
    }, [])

    useEffect(() => {
        if (mounted) {
            fetchIsAdmin()
        }
    }, [fetchIsAdmin, mounted])

    const isDashboard = useMemo(() => pathname === '/admin' || pathname === '/admin/', [pathname])
    
    // If showing login page (not authenticated), don't wrap with admin layout
    const isLoginPage = useMemo(() => {
        return (pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/login') && !isAuthenticated
    }, [pathname, isAuthenticated])

    // If it's the login page, render children directly without layout (no navbar, no header)
    if (isLoginPage) {
        return <>{children}</>
    }

    // Prevent hydration mismatch by not rendering Loading on initial server render
    if (!mounted || loading) {
        return <Loading />
    }

    // Only render navbar and layout if user is authenticated and is admin
    return isAdmin ? (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header - Only show navbar when authenticated */}
            {isAuthenticated && <AdminNavbar />}

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className={`${isDashboard ? 'container mx-auto px-6 py-8' : 'mx-auto px-6 py-8'}`}>
                    {children}
                </div>
            </main>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default AdminLayout