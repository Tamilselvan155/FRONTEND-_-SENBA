
'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import ModalPopup from './PopupModel';

const ProductDetails = ({ product }) => {
  const productId = product.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  const cart = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();

  const router = useRouter();
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addToCartHandler = () => {
    dispatch(addToCart({ productId }));
  };

  
  // ✅ HP options and selected state
  const hpOptions = ["0.5 HP", "1 HP", "1.5 HP", "2.0 HP"];
  const [selectedHP, setSelectedHP] = useState(hpOptions[0]);

  const averageRating = product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length;

  const handleSendWhatsApp = ({ userName, userMobile }) => {
    const quantity = cart[productId] || 1;
    const productLink = typeof window !== 'undefined' ? window.location.href : '';

    let message = `Hi, I'm interested in booking an enquiry for the following product:
🛍️ *Product:* ${product.name}
💰 *Price:* ${currency}${product.price}
📦 *Quantity:* ${quantity}
🖼️ *Product Link:* ${productLink}`;

    if (userName && userMobile) {
      message += `\n🙋 *Name:* ${userName}\n📱 *Mobile:* ${userMobile}`;
    }

    message += `\nPlease let me know the next steps.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "9345795629";

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex max-lg:flex-col gap-12 max-w-7xl mx-auto my-10 px-4">
        {/* Images Section */}
        <div className="flex max-sm:flex-col-reverse gap-3 mx-auto">
          {/* Thumbnails */}
          {/* Thumbnails */}
<div className="flex sm:flex-col mt-2 sm:mt-0 sm:mr-2 gap-3">
  {product.images.map((image, index) => (
    <div 
      key={index} 
      onClick={() => setMainImage(product.images[index])} 
      className="flex items-center justify-center rounded-lg cursor-pointer overflow-hidden border border-gray-200 transition hover:scale-105 active:scale-95 w-14 h-14" // increased size
    >
      <Image 
        src={image} 
        alt={product.name} 
        width={56} 
        height={56} 
        className="object-cover w-full h-full"
      />
    </div>
  ))}
</div>


          {/* Main Image */}
          <div className="flex justify-center items-center w-[320px] h-[430px] sm:h-[540px] sm:w-[405px] md:h-[540px] md:w-[405px] rounded-lg overflow-hidden">
            <Image 
              src={mainImage} 
              alt={product.name} 
              width={500} 
              height={500} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 mx-auto  flex flex-col">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">{product.name}</h1>
          <div className='flex items-center mt-2'>
            {Array(5).fill('').map((_, index) => (
              <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#c31e5aff" : "#D1D5DB"} />
            ))}
            <p className="text-sm ml-3 text-slate-500">{product.rating.length} Reviews</p>
          </div>
          <div className="flex items-start my-6 gap-3 text-xl sm:text-2xl font-semibold text-slate-800">
            <p> {currency}{product.price} </p>
            <p className="text-lg sm:text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
          </div>
                    {/* ✅ HP Options Section */}
          <div className="mt-1 mb-6">
            <p className="text-lg font-semibold text-slate-800 mb-2">
              Available Options:
            </p>
            <div className="flex flex-wrap gap-3">
              {hpOptions.map((hp) => (
                <button
                  key={hp}
                  onClick={() => setSelectedHP(hp)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-all
                    ${
                      selectedHP === hp
                        ? "bg-[#c31e5aff] text-white border-[#c31e5aff]"
                        : "border-gray-300 text-slate-700 hover:bg-gray-100"
                    }`}
                >
                  {hp}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-md sm:text-lg text-slate-500">
            <TagIcon size={14} />
            <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
          </div>

         {/* <div className="flex flex-wrap items-end gap-5 mt-10">
            {cart[productId] && (
              <div className="flex flex-col gap-3">
                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                <Counter productId={productId} />
              </div>
            )}
            <button 
              onClick={() => !cart[productId] ? addToCartHandler() : router.push('/cart')} 
              className="bg-slate-900 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-700 active:scale-95 transition"
            >
              {!cart[productId] ? 'Add to Cart' : 'View Cart'}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
            className="bg-[#c31e5aff] text-white px-10 py-3 text-sm font-medium rounded hover:bg-[#d44a70] active:scale-95 transition"
            >
              Book Enquiry
            </button>
          </div> */}
          <div className="flex flex-wrap items-end gap-5 mt-10">
  {cart[productId] && (
    <div className="flex flex-col gap-3 min-w-[150px] sm:min-w-[180px]">
      <p className="text-lg text-slate-800 font-semibold">Quantity</p>
      <Counter productId={productId} />
    </div>
  )}

  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
    <button
      onClick={() =>
        !cart[productId] ? addToCartHandler() : router.push('/cart')
      }
      className="flex-1 sm:flex-none bg-slate-900 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-700 active:scale-95 transition w-full sm:w-44"
    >
      {!cart[productId] ? 'Add to Cart' : 'View Cart'}
    </button>

    <button
      onClick={() => setIsModalOpen(true)}
      className="flex-1 sm:flex-none bg-[#c31e5a] text-white px-10 py-3 text-sm font-medium rounded hover:bg-[#d44a70] active:scale-95 transition w-full sm:w-44"
    >
      Book Enquiry
    </button>
  </div>
</div>


          <hr className="border-gray-300 my-5" />

          <div className="flex flex-col gap-4 text-slate-500 text-md sm:text-lg">
            <p className="flex gap-3"> <EarthIcon className="text-slate-400 " /> Free shipping worldwide </p>
            <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
            <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
          </div>
        </div>
      </div>

      <ModalPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={[{
          name: product.name,
          price: product.price,
          quantity: cart[productId] || 1
        }]}
        totalPrice={product.price * (cart[productId] || 1)}
        totalQuantity={cart[productId] || 1}
        currency={currency}
        onSendWhatsApp={handleSendWhatsApp}
      />
    </>
  );
};

export default ProductDetails;
