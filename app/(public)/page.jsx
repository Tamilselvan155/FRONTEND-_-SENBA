'use client'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BestSelling from "@/components/BestSelling";
import ProductTabs from "@/components/ProductTabs";
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
    const [isChecking, setIsChecking] = useState(true);
    const { email } = useSelector((state) => state.auth);

    useEffect(() => {
        // Check if user is admin and redirect them to admin dashboard
        const checkAdminRedirect = () => {
            if (typeof window !== 'undefined') {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        if (user.role === 'admin') {
                            // Redirect admin users to admin dashboard
                            window.location.href = '/admin';
                            return;
                        }
                    } catch (e) {
                        // Ignore parse errors
                    }
                }
            }
            setIsChecking(false);
        };
        
        checkAdminRedirect();
        
        // Listen for storage changes (in case login/logout happens in another tab)
        if (typeof window !== 'undefined') {
            const handleStorageChange = (e) => {
                if (e.key === 'user') {
                    checkAdminRedirect();
                }
            };
            
            window.addEventListener('storage', handleStorageChange);
            window.addEventListener('adminLogout', checkAdminRedirect);
            
            return () => {
                window.removeEventListener('storage', handleStorageChange);
                window.removeEventListener('adminLogout', checkAdminRedirect);
            };
        }
    }, [email]);

    // Show loading only while checking for admin redirect
    if (isChecking) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    // Always show e-commerce homepage (public access)
    return (
        <div className="bg-white">
            {/* Hero Section - Starts after navbar */}
            <Hero />
            
            {/* Categories Section */}
            {/* <div className="bg-white py-8 sm:py-12">
                <Categories/>
            </div> */}
            
            {/* Latest Products Section */}
            {/* <div className="bg-gray-50 py-8 sm:py-12">
                <LatestProducts />
            </div> */}

             {/* About Section */}
             <div className="bg-gray-50 py-8 sm:py-12">
                <About />
            </div>
            
            {/* Product Tabs Section */}
            <div className="bg-white py-8 sm:py-12">
                <ProductTabs />
            </div>

            {/* Product Help Banner */}
            <div className="bg-white py-8 sm:py-12">
                <ProductHelpBanner/>
            </div>

             {/* Service/Applications Section */}
             <Service />
            
            {/* Recent Products Section */}
            <div className="bg-gray-50 py-8 sm:py-12">
                <RecentProducts/>
            </div>
            
            {/* Our Specs Section */}
            <div className="bg-white py-8 sm:py-12">
                <OurSpecs />
            </div>
            
            {/* Testimonial Section */}
            <div className="bg-gray-50 py-8 sm:py-12">
                <Testimonial />
            </div>
            
            {/* Quick Enquiry Button - Fixed Position */}
            <QuickEnquiryButton/>
        </div>
    );
}