'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId }) => {

    const { cartItems } = useSelector(state => state.cart);

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    const quantity = cartItems[productId] || 0;

    return (
        <div className="flex items-center border border-gray-300 rounded-lg w-fit overflow-hidden">
            <button 
                onClick={removeFromCartHandler}
                disabled={quantity <= 1}
                className="px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                -
            </button>
            <input 
                type="number" 
                value={quantity} 
                readOnly
                className="w-12 sm:w-16 text-center border-x border-gray-300 py-2 focus:outline-none text-sm sm:text-base font-medium bg-white"
                min="1"
            />
            <button 
                onClick={addToCartHandler}
                className="px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors text-sm sm:text-base font-medium"
            >
                +
            </button>
        </div>
    )
}

export default Counter
