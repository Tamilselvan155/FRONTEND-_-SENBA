'use client'

import { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Banner from '@/components/Banner';

export default function PublicLayout({ children }) {

    return (
        <>
        <Toaster position="top-center" reverseOrder={false} />
            <Banner />
            <Navbar />
            {children}
        
            <Footer />
        </>
    );
}
