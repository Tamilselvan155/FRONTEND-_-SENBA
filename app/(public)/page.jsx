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
import TrustBadges from "@/components/TrustBadges";
import PromotionalBanners from "@/components/PromotionalBanners";
import ShopByCategory from "@/components/ShopByCategory";

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
            
            {/* Product Tabs Section */}
            <div className="bg-white py-0 sm:py-8 lg:py-10">
                <ProductTabs />
            </div>

             {/* Shop by Category Section */}
             <div className="bg-white">
                <ShopByCategory />
            </div>
            

              {/* Service/Applications Section */}
              {/* <Service /> */}

              {/* Promotional Banners Section
              <PromotionalBanners /> */}

               {/* Our Specs Section */}
            <div className="bg-white py-5 sm:py-16 lg:py-0">
                <OurSpecs />
            </div>
            

             

               {/* Product Help Banner */}
            <div className="bg-white pt-8 sm:pt-10 lg:pt-12 pb-4 sm:pb-6">
                <ProductHelpBanner/>
            </div>

               {/* Recent Products Section */}
            {/* <div className="bg-white pb-4 sm:pb-16 lg:pb-0 pt-12 sm:pt-16 lg:pt-0">
                <RecentProducts/>
            </div> */}
            
            {/* Testimonial Section */}
            <div className="bg-white pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20">
                <Testimonial />
            </div>
            
            {/* Newsletter Section
            <div className="bg-white">
                <Newsletter />
            </div> */}
            
            {/* Quick Enquiry Button - Fixed Position */}
            <QuickEnquiryButton/>

             
        </div>
    );
}