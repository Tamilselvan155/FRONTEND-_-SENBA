
import Image from 'next/image';
import { assets } from '@/assets/assets';

export default function BottomBanner() {
    return (
       <div className='py-1 px-5 sm:pt-6'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto'>
            <div className='flex-1 flex flex-col justify-center items-start gap-6'>
           <div className="relative w-full flex-1 flex flex-col justify-center items-center rounded-3xl overflow-hidden">

      <div className="relative w-full h-[230px] sm:h-[350px] md:h-[450px] transition-all duration-700 ease-in-out">
        <Image
          src={assets.banner1}
          alt={"Wave"}
          width={1200}
          height={500}
          priority
          className="w-full h-full object-cover sm:rounded-3xl"
        />
      </div>   
           </div>
                </div>
            </div>
        </div>
    );
}

    

