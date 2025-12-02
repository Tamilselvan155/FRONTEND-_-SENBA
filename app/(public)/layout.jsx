'use client'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Banner from '@/components/Banner';

export default function PublicLayout({ children }) {
    const pathname = usePathname();
    const { email } = useSelector((state) => state.auth);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const hasEmail = email && email.trim() !== '';
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            const authenticated = hasEmail || (token !== null && userStr !== null);
            setIsAuthenticated(authenticated);
            setIsChecking(false);
        };
        
        checkAuth();
        
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
    }, [email]);

    // Check if we're showing login page (not authenticated and on root route or admin login)
    const isLoginPage = (pathname === '/' || pathname === '/admin/login' || pathname === '/admin') && !isAuthenticated;

    // Show navbar only when not on login page and not checking
    const shouldShowNavbar = !isChecking && !isLoginPage;

    return (
        <>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable={false}
              pauseOnHover
              theme="light"
              toastClassName="custom-toast"
              bodyClassName="custom-toast-body"
              progressClassName="custom-toast-progress"
              style={{
                zIndex: 9999,
              }}
            />
            {shouldShowNavbar && (
                <>
                    <Banner />
                    <Navbar />
                </>
            )}
            {children}
            {shouldShowNavbar && <Footer />}
        </>
    );
}
