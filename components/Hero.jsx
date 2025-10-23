'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon,ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React,{useState,useEffect} from 'react'
import Link from "next/link";
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    // const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'
     // 5 same images
  const images = [assets.banner3, assets.banner1, assets.banner2, assets.banner3];

  const [current, setCurrent] = useState(0);

  // You can change these to different images + texts later
  const slides = [
    {
      image: assets.banner1,
      title: "Your Solution for Consistent and Efficient Pumping",
      subtitle: "Built for performance and durability",
    },
    {
      image: assets.banner2,
      title: "Engineered for durability and long working hours.",
      subtitle: "Save more with our advanced motor technology",
    },
    {
      image: assets.banner3,
      title: "Delivers consistent performance, even under heavy-duty operations.",
      subtitle: "Engineered for industrial and domestic use",
    },
    {
      image: assets.banner1,
      title: "Your Solution for Consistent and Efficient Pumping",
      subtitle: "Delivering consistent pressure and performance",
    },
    {
      image: assets.banner2,
      title: "Engineered for durability and long working hours.",
      subtitle: "Crafted with care and cutting-edge tech",
    },
  ];
   // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

    return (
        <div className='bg-[#F7F7F7] py-1 px-5 sm:pt-6 sm:pb-10'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
            <div className='flex-1 flex flex-col justify-center items-start gap-6'>
           <div className="relative w-full flex-1 flex flex-col justify-center items-center rounded-3xl overflow-hidden">
          {/* Slide Images */}
      <div className="relative w-full h-[230px] sm:h-[350px] md:h-[450px] transition-all duration-700 ease-in-out">
        <Image
          src={slides[current].image}
          alt={slides[current].title}
          width={1200}
          height={500}
          priority
          className="w-full h-full object-cover sm:rounded-3xl"
        />
        {/* Text Overlay */}
        <div className="absolute left-2 top-10 flex flex-col justify-center items-center text-center text-white px-4 sm:px-8 transition-opacity duration-700">
          <div className="w-40 absolute left-7 top-6 sm:top-20 text-left text-[16px] sm:text-2xl md:text-4xl md:w-100 font-bold mb-2 drop-shadow-md text-[rgb(55,50,46)] ">
            {slides[current].title}
          </div>
        </div>

        <div className="absolute bottom-5 left-4 sm:bottom-6 sm:left-6 rounded-full">
            <Link href="/category/products"><button className="hidden sm:flex text-white bg-[rgb(55,50,46)] p-2 sm:p-3  rounded-xl text-sm sm:text-lg">View More</button></Link> 
            <Link href="/category/products"> <p className='text-sm sm:text-xl sm:hidden flex items-center  mt-4 text-[#c31e5a]'>View more <ArrowRightIcon className='group-hover:ml-2 mt-1 transition-all' size={15} /> </p></Link>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
              current === index ? "bg-black scale-110" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
           </div>
                </div>

                              <div className='hidden sm:flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <div className='flex-1 flex items-center justify-between w-full bg-green-100 rounded-3xl p-6 px-6 group'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-green-700 to-green-400 bg-clip-text text-transparent max-w-40'>
                                Best products
                            </p>
                           <Link href="/category/products">  <p className='text-[16px] flex items-center gap-1 mt-4 text-green-700'>
                                View more
                                <ArrowRightIcon className='text-green-600 group-hover:ml-2 transition-all' size={18} />
                            </p></Link>
                        </div>
                        <Image className='w-40 h-40 rounded-full' src={assets.product_img2} alt="" />
                    </div>

                    <div className='flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>20% discounts</p>
                          <Link href="/category/products"> <p className='text-[16px] flex items-center gap-1 mt-4'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p></Link>
                        </div>
                        <Image className='w-40 h-40 rounded-full' src={assets.product_img6} alt="" />
                    </div>
                </div>

            </div>
            {/* <CategoriesMarquee /> */}


        </div>


    )
}

export default Hero
