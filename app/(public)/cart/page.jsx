'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { useCart } from "@/lib/hooks/useCart";
import { Trash2Icon, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductsAsync } from "@/lib/features/product/productSlice";
import { fetchCartAsync } from "@/lib/features/cart/cartSlice";
import { getImageUrl } from "@/lib/utils/imageUtils";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
    const dispatch = useDispatch();
    
    const { cartItems, deleteFromCart, isLoggedIn } = useCart();
    const cartItemsWithDetails = useSelector(state => state.cart.items || []); // Populated items from backend
    const products = useSelector(state => state.product.list || state.product.products || []);

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const hasFetchedCart = useRef(false);
    
    // Pagination for cart items
    const [cartPage, setCartPage] = useState(1);
    const cartItemsPerPage = 5;
    
    // Reset pagination when cart items change
    useEffect(() => {
        setCartPage(1);
    }, [cartArray.length]);

    // Fetch cart for logged-in users when page loads or when user logs in
    useEffect(() => {
        if (isLoggedIn && !hasFetchedCart.current) {
            // Fetch cart on mount for logged-in users
            dispatch(fetchCartAsync()).then(() => {
                hasFetchedCart.current = true;
            });
        } else if (!isLoggedIn) {
            // Reset flag when user logs out
            hasFetchedCart.current = false;
        }
    }, [isLoggedIn, dispatch]);

    // Fetch products if not loaded (for guest users)
    useEffect(() => {
        if (!isLoggedIn && (!products || products.length === 0)) {
            dispatch(fetchProductsAsync());
        }
    }, [isLoggedIn, products, dispatch]);


    // Helper function to clean product object and remove all MongoDB IDs
    const cleanProductObject = useCallback((product) => {
        if (!product || typeof product !== 'object') return product;
        
        const cleaned = {};
        const excludeFields = ['_id', '__v', 'createdAt', 'updatedAt', 'productId', 'categoryId', 'subcategory', 'brandIds'];
        const mongoIdPattern = /^[0-9a-f]{24}$/i;
        
        for (const [key, value] of Object.entries(product)) {
            // Skip MongoDB internal fields
            if (excludeFields.includes(key)) continue;
            
            // Skip fields that are MongoDB ObjectIds (24 char hex strings)
            if (typeof value === 'string' && mongoIdPattern.test(value)) continue;
            
            // Skip if value is an ObjectId object
            if (value && typeof value === 'object' && value.constructor && (value.constructor.name === 'ObjectID' || value.constructor.name === 'ObjectId')) continue;
            
            // Skip if key ends with 'Id' and value is a MongoDB ID string
            if (key.toLowerCase().endsWith('id') && typeof value === 'string' && mongoIdPattern.test(value)) continue;
            
            // Handle arrays
            if (Array.isArray(value)) {
                cleaned[key] = value.map(item => {
                    if (typeof item === 'object' && item !== null) {
                        // If it's an ObjectId, skip it
                        if (item.constructor && (item.constructor.name === 'ObjectID' || item.constructor.name === 'ObjectId')) return null;
                        // Recursively clean nested objects
                        return cleanProductObject(item);
                    }
                    // Skip MongoDB IDs in arrays
                    if (typeof item === 'string' && mongoIdPattern.test(item)) return null;
                    return item;
                }).filter(item => item !== null);
            }
            // Handle nested objects
            else if (value && typeof value === 'object' && value !== null) {
                // Skip if it's an ObjectId
                if (value.constructor && (value.constructor.name === 'ObjectID' || value.constructor.name === 'ObjectId')) continue;
                // Skip Date objects (they might be timestamps)
                if (value instanceof Date) {
                    cleaned[key] = value;
                } else {
                    cleaned[key] = cleanProductObject(value);
                }
            }
            // Handle primitive values - check if it's a MongoDB ID string
            else if (typeof value === 'string' && mongoIdPattern.test(value)) {
                // Don't include MongoDB ID strings
                continue;
            }
            else {
                cleaned[key] = value;
            }
        }
        
        return cleaned;
    }, []);

    const createCartArray = useCallback(() => {
        const cartArray = [];
        let calculatedTotal = 0;
        
        // For logged-in users, use populated items from backend
        if (isLoggedIn && cartItemsWithDetails && Array.isArray(cartItemsWithDetails) && cartItemsWithDetails.length > 0) {
            cartItemsWithDetails.forEach(item => {
                if (item.productId) {
                    const product = typeof item.productId === 'object' ? item.productId : null;
                    if (product) {
                        // Use item.price if set and > 0, otherwise extract from product
                        let productPrice = 0;
                        const itemPrice = Number(item.price) || 0;
                        
                        if (itemPrice > 0) {
                            productPrice = itemPrice;
                        } else {
                            // Extract price from multiple sources
                            // Check direct price field
                            if (product.price !== undefined && product.price !== null) {
                                productPrice = Number(product.price);
                            }
                            
                            // If price is 0, check MRP
                            if (productPrice === 0 && product.mrp !== undefined && product.mrp !== null) {
                                productPrice = Number(product.mrp);
                            }
                            
                            // If still 0, check brandVariants (for products with variants)
                            if (productPrice === 0 && product.brandVariants && Array.isArray(product.brandVariants) && product.brandVariants.length > 0) {
                                const firstVariant = product.brandVariants[0];
                                if (firstVariant.price !== undefined && firstVariant.price !== null) {
                                    productPrice = Number(firstVariant.price);
                                }
                            }
                        }
                        
                        const quantity = Number(item.quantity) || 0;
                        
                        // Clean product object to remove all MongoDB IDs
                        const cleanedProduct = cleanProductObject(product);
                        
                        cartArray.push({
                            ...cleanedProduct,
                            id: product._id?.toString() || product.id?.toString(),
                            quantity: quantity,
                            price: productPrice,
                        });
                        calculatedTotal += productPrice * quantity;
                    }
                }
            });
        } 
        // For guest users or when populated items not available, match with products from Redux
        else if (cartItems && typeof cartItems === 'object' && Object.keys(cartItems).length > 0) {
        for (const [key, value] of Object.entries(cartItems)) {
                const product = products.find(product => {
                    const productId = product.id || product._id;
                    return productId && productId.toString() === key.toString();
                });
            if (product) {
                    // Extract price from multiple sources
                    let productPrice = 0;
                    
                    // Check direct price field
                    if (product.price !== undefined && product.price !== null) {
                        productPrice = Number(product.price);
                    }
                    
                    // If price is 0, check MRP
                    if (productPrice === 0 && product.mrp !== undefined && product.mrp !== null) {
                        productPrice = Number(product.mrp);
                    }
                    
                    // If still 0, check originalProduct (for transformed products)
                    if (productPrice === 0 && product.originalProduct) {
                        const original = product.originalProduct;
                        if (original.price !== undefined && original.price !== null) {
                            productPrice = Number(original.price);
                        } else if (productPrice === 0 && original.mrp !== undefined && original.mrp !== null) {
                            productPrice = Number(original.mrp);
                        }
                    }
                    
                    // If still 0, check brandVariants (for products with variants)
                    if (productPrice === 0 && product.brandVariants && Array.isArray(product.brandVariants) && product.brandVariants.length > 0) {
                        const firstVariant = product.brandVariants[0];
                        if (firstVariant.price !== undefined && firstVariant.price !== null) {
                            productPrice = Number(firstVariant.price);
                        }
                    }
                    
                    // If still 0, check originalProduct.brandVariants
                    if (productPrice === 0 && product.originalProduct?.brandVariants && Array.isArray(product.originalProduct.brandVariants) && product.originalProduct.brandVariants.length > 0) {
                        const firstVariant = product.originalProduct.brandVariants[0];
                        if (firstVariant.price !== undefined && firstVariant.price !== null) {
                            productPrice = Number(firstVariant.price);
                        }
                    }
                    
                    const quantity = Number(value) || 0;
                    
                    // Clean product object to remove all MongoDB IDs
                    const cleanedProduct = cleanProductObject(product);
                    
                cartArray.push({
                        ...cleanedProduct,
                        id: product._id?.toString() || product.id?.toString(),
                        quantity: quantity,
                        price: productPrice,
                    });
                    calculatedTotal += productPrice * quantity;
                }
            }
        }
        
        setCartArray(cartArray);
        setTotalPrice(calculatedTotal);
    }, [isLoggedIn, cartItemsWithDetails, cartItems, products, cleanProductObject]);

    const handleDeleteItemFromCart = async (productId) => {
        await deleteFromCart(productId)
    }

    useEffect(() => {
        // Always try to create cart array when dependencies change
        // For logged-in users, use populated items (even if empty array)
        if (isLoggedIn) {
            if (cartItemsWithDetails && Array.isArray(cartItemsWithDetails)) {
                createCartArray();
            } else {
                // If cartItemsWithDetails is not available yet, wait a bit and try again
                // or use cartItems as fallback
                if (cartItems && Object.keys(cartItems).length > 0) {
                    createCartArray();
                } else {
                    setCartArray([]);
                    setTotalPrice(0);
                }
            }
        } 
        // For guest users, wait for products to be loaded
        else if (!isLoggedIn) {
        if (products && Array.isArray(products) && products.length > 0) {
            createCartArray();
        } else if (cartItems && Object.keys(cartItems).length > 0) {
                // Try with cartItems even if products not loaded
            createCartArray();
        } else {
            setCartArray([]);
            setTotalPrice(0);
        }
        }
    }, [cartItems, cartItemsWithDetails, products, isLoggedIn, createCartArray]);

    // Calculate paginated cart items
    const cartStartIndex = (cartPage - 1) * cartItemsPerPage;
    const cartEndIndex = cartStartIndex + cartItemsPerPage;
    const paginatedCartItems = cartArray.slice(cartStartIndex, cartEndIndex);
    const totalCartPages = Math.ceil(cartArray.length / cartItemsPerPage);

    // Calculate paginated ordered items

    // Calculate total savings (if MRP is higher than price)
    const calculateSavings = () => {
        let totalSavings = 0;
        cartArray.forEach(item => {
            const itemPrice = Number(item.price || 0);
            const itemMrp = Number(item.mrp || item.price || 0);
            if (itemMrp > itemPrice) {
                totalSavings += (itemMrp - itemPrice) * (item.quantity || 1);
            }
        });
        return totalSavings;
    };

    const totalSavings = calculateSavings();

    return cartArray.length > 0 ? (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">My basket</h1>
                    <p className="text-sm text-[#7C2A47] font-medium">
                        You are eligible for free delivery!
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Product List - Left Side */}
                    <div className="flex-1 lg:max-w-3xl">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                {cartArray.map((item, index) => {
                                    // Safely handle images
                                    const itemImages = item.images && Array.isArray(item.images) && item.images.length > 0 
                                        ? item.images 
                                        : [];
                                    const itemImage = itemImages[0] || '/placeholder-image.jpg';
                                    
                                    // Handle category/brand - can be string or object
                                    let brandName = '';
                                    if (item.brand) {
                                        brandName = typeof item.brand === 'string' ? item.brand : (item.brand.name || item.brand.title || '');
                                    } else if (item.category) {
                                        if (typeof item.category === 'object') {
                                            brandName = item.category.title || item.category.name || item.category.englishName || '';
                                        } else {
                                            const catStr = String(item.category);
                                            if (!/^[0-9a-f]{24}$/i.test(catStr)) {
                                                brandName = catStr;
                                            }
                                        }
                                    }
                                    
                                    const itemPrice = Number(item.price || 0);
                                    const itemMrp = Number(item.mrp || item.price || 0);
                                    const itemTotal = itemPrice * (item.quantity || 1);
                                    const hasDiscount = itemMrp > itemPrice;
                                    
                                    return (
                                        <div key={item.id || item._id || index} className="p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                        <Image 
                                                            src={itemImage} 
                                                            className="w-full h-full object-contain" 
                                                            alt={item.name || item.title || 'Product'} 
                                                            width={128} 
                                                            height={128}
                                                            unoptimized
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    {/* Brand */}
                                                    {brandName && (
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                            {brandName}
                                                        </p>
                                                    )}
                                                    
                                                    {/* Product Name */}
                                                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                                                        {item.name || item.title || 'Product'}
                                                    </h3>
                                                    
                                                    {/* Estimated Delivery */}
                                                    <p className="text-xs text-gray-500 mb-3">
                                                        Estimated Delivery: Monday 22nd December and Wednesday 24th December.
                                                    </p>
                                                    
                                                    {/* Price */}
                                                    <div className="flex items-baseline gap-2 mb-4">
                                                        <span className={`text-lg font-bold ${hasDiscount ? 'text-red-600' : 'text-[#7C2A47]'}`}>
                                                            {currency}{itemPrice.toLocaleString()}
                                                        </span>
                                                        {hasDiscount && (
                                                            <span className="text-sm text-gray-400 line-through">
                                                                {currency}{itemMrp.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Quantity and Remove */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                        <div className="flex items-center">
                                                            <Counter 
                                                                productId={item.id || item._id} 
                                                                initialQuantity={item.quantity}
                                                                productPrice={item.price}
                                                            />
                                                        </div>
                                                        <button 
                                                            onClick={() => handleDeleteItemFromCart(item.id || item._id)} 
                                                            className="text-sm text-[#7C2A47] hover:text-[#6a243d] font-medium underline self-start sm:self-auto transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {/* Individual Total */}
                                                <div className="flex-shrink-0 sm:text-right">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {currency}{itemTotal.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* Cart Items Pagination */}
                        {totalCartPages > 1 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-xs text-gray-600">
                                        Showing {cartStartIndex + 1} to {Math.min(cartEndIndex, cartArray.length)} of {cartArray.length} items
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCartPage(prev => Math.max(1, prev - 1))}
                                            disabled={cartPage === 1}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-xs text-gray-700 px-2">
                                            Page {cartPage} of {totalCartPages}
                                        </span>
                                        <button
                                            onClick={() => setCartPage(prev => Math.min(totalCartPages, prev + 1))}
                                            disabled={cartPage === totalCartPages}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Order Summary - Right Sidebar */}
                    <div className="w-full lg:w-96 lg:flex-shrink-0">
                        <OrderSummary totalPrice={totalPrice} items={cartArray} totalSavings={totalSavings} />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">My basket</h1>
                </div>
                
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-sm text-gray-600 mb-6">Add items to your cart to get started</p>
                        <Link 
                            href="/category/products"
                            className="inline-block px-6 py-3 bg-[#7C2A47] text-sm text-white font-semibold rounded-lg hover:bg-[#6a243d] active:scale-95 transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}