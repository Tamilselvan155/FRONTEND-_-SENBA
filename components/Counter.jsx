'use client'
import { useCart } from "@/lib/hooks/useCart";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const Counter = ({ productId, initialQuantity, productPrice }) => {
    const { cartItems, addToCart, removeFromCart, isLoggedIn } = useCart();
    const cartItemsWithDetails = useSelector(state => state.cart.items || []);

    const addToCartHandler = () => {
        // Get price from prop, or from cart item, or use 0
        let price = productPrice || 0;
        
        // Try to get price from cart item if available
        if (isLoggedIn && cartItemsWithDetails && Array.isArray(cartItemsWithDetails)) {
            const cartItem = cartItemsWithDetails.find(item => {
                const itemProductId = typeof item.productId === 'object' 
                    ? (item.productId._id || item.productId.id) 
                    : item.productId;
                return itemProductId && itemProductId.toString() === productId.toString();
            });
            if (cartItem && cartItem.price && cartItem.price > 0) {
                price = cartItem.price;
            } else if (cartItem && cartItem.productId && typeof cartItem.productId === 'object') {
                const product = cartItem.productId;
                if (product.price && product.price > 0) {
                    price = product.price;
                }
            }
        }
        
        addToCart({ 
            productId,
            price: price
        })
    }

    const removeFromCartHandler = () => {
        removeFromCart(productId)
    }

    // Get quantity from cart state - this will be reactive to changes
    const quantity = useMemo(() => {
        // For logged-in users, get quantity from cartItemsWithDetails
        if (isLoggedIn && cartItemsWithDetails && Array.isArray(cartItemsWithDetails)) {
            const cartItem = cartItemsWithDetails.find(item => {
                const itemProductId = typeof item.productId === 'object' 
                    ? (item.productId._id || item.productId.id) 
                    : item.productId;
                return itemProductId && itemProductId.toString() === productId.toString();
            });
            if (cartItem) {
                return cartItem.quantity || 0;
            }
        }
        
        // Fallback to cartItems object (for guest users or if cartItemsWithDetails not available)
        if (cartItems) {
            const productIdStr = productId?.toString();
            return cartItems[productIdStr] || cartItems[productId] || initialQuantity || 0;
        }
        
        // Final fallback to initialQuantity prop
        return initialQuantity || 0;
    }, [productId, cartItemsWithDetails, cartItems, isLoggedIn, initialQuantity]);

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
