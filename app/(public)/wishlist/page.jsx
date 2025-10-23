"use client";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart } from "@/lib/features/cart/cartSlice";

import {
  removeFromWishlist,
  clearWishlist,
} from "../../../lib/features/wishlist/wishlistSlice";
import { X, CheckCircle, FolderHeart,Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function Wishlist() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const { wishlistItems } = useSelector((state) => state.wishlist);
  const products = useSelector((state) => state.product.list);
    const router = useRouter();

  const dispatch = useDispatch();

  const [wishlistArray, setWishlistArray] = useState([]);

  const createWishlistArray = () => {
    const array = [];
    for (const [key] of Object.entries(wishlistItems)) {
      const product = products.find((p) => p.id === key);
      if (product) array.push(product);
    }
    setWishlistArray(array);
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromWishlist({ productId }));
  };

  useEffect(() => {
    if (products.length > 0) createWishlistArray();
  }, [wishlistItems, products]);

   const addToCartHandler =  async (productId) => {
    console.log("Adding to cart:", productId);
        await dispatch(addToCart({ productId }));
        await dispatch(removeFromWishlist({ productId }));
}
 

  if (wishlistArray.length === 0 ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <FolderHeart className="w-16 h-16 text-indigo-600 mb-4" />
        <h2 className="text-xl font-medium mb-4">Your wishlist is empty!</h2>
        <button
          onClick={() => router.push("/shop")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Your Wishlist</h1>
          <button
            onClick={() => dispatch(clearWishlist())}
            className="text-indigo-600 hover:underline"
          >
            Clear Wishlist Cart
          </button>
        </div>

        {/* 👇 Scroll container for mobile */}
        <div className="overflow-x-auto">
    <table className="min-w-max border-separate border-spacing-y-3 w-full">
        <thead>
        <tr className="text-left text-gray-600 text-sm">
            <th className="py-2 px-4">Product</th>
            <th className="py-2 px-4">Unit Price</th>
            <th className="py-2 px-4">Stock Status</th>
            <th className="py-2 px-4">Action</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        {wishlistArray.map((item) => (
            <tr
            key={item.id}
            className="bg-gray-50 hover:bg-gray-100 rounded-xl"
            >
            <td className="flex items-center gap-4 py-3 px-4">
                <Image
                    src={item.images[0]}
                    className="h-14 w-auto"
                    alt={item.name}
                    width={45}
                    height={45}
                    />
                <span className="font-medium text-gray-800">{item.name}</span>
            </td>
            <td className="text-gray-700 px-4">${item.price}</td>
            <td className="text-green-600 gap-1 px-4 ">
                <p className="flex items-center gap-1"><CheckCircle className="w-4 h-4" />In Stock</p>
            </td>
            <td className="px-4">
                <button
                onClick={()=>{addToCartHandler(item.id)}}
                className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white transition"
                >
                Add to Cart
                </button>
            </td>
            <td className="px-4">
                <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all"
                      >
                {/* <X className="w-5 h-5 text-gray-500" />
                 */}
                 <Trash className="w-5 h-5 text-gray-500 hover:text-red-500" />
                </button>
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
        {/* 👆 End of scroll container */}
      </div>
    </div>
  );
}
