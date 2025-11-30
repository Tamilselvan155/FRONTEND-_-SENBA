'use client'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import AdminLogin from '@/components/admin/AdminLogin';
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import Categories from "@/components/Categories";
import About from "@/components/About";
import Testimonial from "@/components/Testimonial";
import Service from "@/components/Service"
import ProductHelpBanner from "@/components/ProductHelpBanner";
import QuickEnquiryButton from "@/components/QuickEnquiryButton";
import BottomBanner from "@/components/BottomBanner";
import RecentProducts from "@/components/RecentProducts";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const { email } = useSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        // Check immediately on mount - before any state updates
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user.role === 'admin') {
                        // Immediately redirect using window.location to prevent any rendering
                        window.location.href = '/admin';
                        return;
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            }
        }

        const checkAuth = () => {
            // Check if user is logged in via Redux state
            const hasEmail = email && email.trim() !== '';
            
            // Also check localStorage for token (backup check)
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            
            const authenticated = hasEmail || (token !== null && userStr !== null);
            
            // Get user role from localStorage
            let role = null;
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    role = user.role;
                    
                    // If admin, redirect immediately
                    if (role === 'admin') {
                        window.location.href = '/admin';
                        return;
                    }
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }
            
            setIsAuthenticated(authenticated);
            setUserRole(role);
            setIsChecking(false);
        };
        
        checkAuth();
        
        // Listen for storage changes (in case login/logout happens in another tab)
        if (typeof window !== 'undefined') {
            const handleStorageChange = (e) => {
                if (e.key === 'token' || e.key === 'user') {
                    checkAuth();
                }
            };
            
            window.addEventListener('storage', handleStorageChange);
            window.addEventListener('adminLogout', checkAuth);
            
            return () => {
                window.removeEventListener('storage', handleStorageChange);
                window.removeEventListener('adminLogout', checkAuth);
            };
        }
    }, [email, router]);

    if (isChecking) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    // If not authenticated, show login page
    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    // If user is admin, they should be redirected (but show loading while redirecting)
    if (userRole === 'admin') {
        return <div className="flex items-center justify-center h-screen">Redirecting to admin dashboard...</div>;
    }

    // If authenticated and user is not admin, show ecommerce homepage
    return (
        <div>
            <Hero />
            <Service />
            <QuickEnquiryButton/> 
            <Categories/>
            <LatestProducts />
            <BestSelling />
            <RecentProducts/>
            {/* <BottomBanner/> */}
            <ProductHelpBanner/>
            <About />
            <OurSpecs />
            <Testimonial />
            {/* <Newsletter /> */}
        </div>
    );
}