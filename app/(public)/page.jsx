'use client'
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