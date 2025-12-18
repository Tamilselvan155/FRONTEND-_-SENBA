'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { useCart } from "@/lib/hooks/useCart";
import { Trash2Icon, CheckCircle } from "lucide-react";
import Image from "next/image";
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
    const [orderedItems, setOrderedItems] = useState([]);
    const hasFetchedCart = useRef(false);
    
    // Pagination for cart items
    const [cartPage, setCartPage] = useState(1);
    const cartItemsPerPage = 5;
    
    // Pagination for ordered items
    const [ordersPage, setOrdersPage] = useState(1);
    const ordersPerPage = 5;
    
    // Reset pagination when cart items change
    useEffect(() => {
        setCartPage(1);
    }, [cartArray.length]);
    
    // Reset pagination when orders change
    useEffect(() => {
        setOrdersPage(1);
    }, [orderedItems.length]);

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

    // Fetch orders from backend for logged-in users
    useEffect(() => {
        const fetchOrders = async () => {
            if (isLoggedIn) {
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders/my-orders`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (data.success && data.data) {
                                console.log('✅ Fetched orders from backend:', data.data.length);
                                // Convert backend orders to display format
                                const formattedOrders = data.data.map(order => ({
                                    items: order.items.map(item => {
                                        // Handle productId - can be ObjectId or populated object
                                        const product = item.productId && typeof item.productId === 'object' 
                                            ? item.productId 
                                            : null;
                                        
                                        return {
                                            id: product?._id?.toString() || item.productId?.toString() || item.productId,
                                            name: item.name || product?.title || product?.name || 'Product',
                                            price: Number(item.price || product?.price || 0),
                                            quantity: Number(item.quantity || 1),
                                            images: Array.isArray(item.images) && item.images.length > 0
                                                ? item.images
                                                : (Array.isArray(product?.images) && product.images.length > 0
                                                    ? product.images
                                                    : []),
                                            sku: item.sku || product?.sku || null,
                                        };
                                    }),
                                    totalPrice: Number(order.totalPrice || 0),
                                    totalQuantity: Number(order.totalQuantity || 0),
                                    orderedAt: order.createdAt || order.orderedAt,
                                }));
                                setOrderedItems(formattedOrders);
                                return; // Don't load from localStorage if backend has orders
                            }
                        } else {
                            console.warn('Failed to fetch orders from backend:', response.status);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching orders from backend:', error);
                }
            }
            
            // Fallback to localStorage for guest users or if backend fetch fails
            if (typeof window !== 'undefined') {
                try {
                    const savedOrders = localStorage.getItem('orderedItems');
                    if (savedOrders) {
                        const orders = JSON.parse(savedOrders);
                        setOrderedItems(orders);
                    }
                } catch (error) {
                    console.error('Error loading ordered items from localStorage:', error);
                }
            }
        };

        fetchOrders();
    }, [isLoggedIn]);

    // Listen for storage changes and order placed events to refresh
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'orderedItems' && !isLoggedIn) {
                try {
                    const orders = JSON.parse(e.newValue || '[]');
                    setOrderedItems(orders);
                } catch (error) {
                    console.error('Error parsing ordered items:', error);
                }
            }
        };

        const handleOrderPlaced = async () => {
            // Refresh orders from backend if logged in
            if (isLoggedIn) {
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders/my-orders`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (data.success && data.data) {
                                const formattedOrders = data.data.map(order => ({
                                    items: order.items.map(item => {
                                        const product = item.productId && typeof item.productId === 'object' 
                                            ? item.productId 
                                            : null;
                                        
                                        return {
                                            id: product?._id?.toString() || item.productId?.toString() || item.productId,
                                            name: item.name || product?.title || product?.name || 'Product',
                                            price: Number(item.price || product?.price || 0),
                                            quantity: Number(item.quantity || 1),
                                            images: Array.isArray(item.images) && item.images.length > 0
                                                ? item.images
                                                : (Array.isArray(product?.images) && product.images.length > 0
                                                    ? product.images
                                                    : []),
                                            sku: item.sku || product?.sku || null,
                                        };
                                    }),
                                    totalPrice: Number(order.totalPrice || 0),
                                    totalQuantity: Number(order.totalQuantity || 0),
                                    orderedAt: order.createdAt || order.orderedAt,
                                }));
                                setOrderedItems(formattedOrders);
                                return;
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error refreshing orders:', error);
                }
            } else {
                // For guest users, load from localStorage
                try {
                    const savedOrders = localStorage.getItem('orderedItems');
                    if (savedOrders) {
                        const orders = JSON.parse(savedOrders);
                        setOrderedItems(orders);
                    }
                } catch (error) {
                    console.error('Error loading ordered items:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('orderPlaced', handleOrderPlaced);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('orderPlaced', handleOrderPlaced);
        };
    }, [isLoggedIn]);

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
                        // Use item.price if set and > 0, otherwise use product.price, fallback to 0
                        const itemPrice = Number(item.price) || 0;
                        const productPriceValue = Number(product.price) || 0;
                        // Prioritize item.price, then product.price, but don't use 0 if product has a valid price
                        let productPrice = 0;
                        if (itemPrice > 0) {
                            productPrice = itemPrice;
                        } else if (productPriceValue > 0) {
                            productPrice = productPriceValue;
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
                    const productPrice = Number(product.price) || 0;
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
    const ordersStartIndex = (ordersPage - 1) * ordersPerPage;
    const ordersEndIndex = ordersStartIndex + ordersPerPage;
    const paginatedOrders = orderedItems.slice(ordersStartIndex, ordersEndIndex);
    const totalOrdersPages = Math.ceil(orderedItems.length / ordersPerPage);

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800">

            <div className="max-w-7xl mx-auto ">
                {/* Title */}
                <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">

                    <div className="w-full max-w-4xl">
                        <table className="w-full text-slate-600 table-auto">
                        <thead>
                            <tr className="max-sm:text-sm">
                                <th className="text-left">Product</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th className="max-md:hidden">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartArray.map((item, index) => {
                                    // Safely handle images
                                    const itemImages = item.images && Array.isArray(item.images) && item.images.length > 0 
                                        ? item.images 
                                        : [];
                                    const itemImage = itemImages[0] || '/placeholder-image.jpg';
                                    
                                    // Handle category - can be string or object
                                    let categoryName = '';
                                    if (item.category) {
                                        if (typeof item.category === 'object') {
                                            categoryName = item.category.title || item.category.name || item.category.englishName || '';
                                        } else {
                                            // Don't display if it's a MongoDB ID
                                            const catStr = String(item.category);
                                            if (!/^[0-9a-f]{24}$/i.test(catStr)) {
                                                categoryName = catStr;
                                            }
                                        }
                                    } else if (item.categoryId) {
                                        if (typeof item.categoryId === 'object') {
                                            categoryName = item.categoryId.title || item.categoryId.name || item.categoryId.englishName || '';
                                        } else {
                                            // Don't display if it's a MongoDB ID
                                            const catIdStr = String(item.categoryId);
                                            if (!/^[0-9a-f]{24}$/i.test(catIdStr)) {
                                                categoryName = catIdStr;
                                            }
                                        }
                                    }
                                    
                                    // Filter out any MongoDB ID-like values from item before rendering
                                    const safeItem = { ...item };
                                    for (const [key, value] of Object.entries(safeItem)) {
                                        // Remove any field that contains a MongoDB ID as a string
                                        if (typeof value === 'string' && /^[0-9a-f]{24}$/i.test(value)) {
                                            delete safeItem[key];
                                        }
                                    }
                                    
                                    return (
                                        <tr key={item.id || item._id || index} className="space-x-2">
                                            <td className="flex gap-3 my-4">
                                                <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                                    <Image 
                                                        src={itemImage} 
                                                        className="h-14 w-auto" 
                                                        alt={item.name || item.title || 'Product'} 
                                                        width={45} 
                                                        height={45}
                                                        unoptimized
                                                    />
                                                </div>
                                                <div>
                                                    <p className="max-sm:text-sm font-medium">{item.name || item.title || 'Product'}</p>
                                                    {categoryName && <p className="text-xs text-slate-500">{categoryName}</p>}
                                                    {/* Only show SKU if it exists and is not a MongoDB ID */}
                                                    {item.sku && typeof item.sku === 'string' && item.sku.length > 0 && !/^[0-9a-f]{24}$/i.test(item.sku) && (
                                                        <p className="text-xs text-slate-400">{item.sku}</p>
                                                    )}
                                                    {/* Display price - ensure it's a valid number */}
                                                    <p className="font-semibold text-slate-700">
                                                        {currency}{Number(item.price || 0) > 0 ? Number(item.price).toLocaleString() : '0'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <Counter 
                                                    productId={item.id || item._id} 
                                                    initialQuantity={item.quantity}
                                                    productPrice={item.price}
                                                />
                                            </td>
                                            <td className="text-center font-semibold">{currency}{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}</td>
                                            <td className="text-center max-md:hidden">
                                                <button onClick={() => handleDeleteItemFromCart(item.id || item._id)} className=" text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all">
                                                    <Trash2Icon size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                        
                        {/* Cart Items Pagination */}
                        {totalCartPages > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Showing {cartStartIndex + 1} to {Math.min(cartEndIndex, cartArray.length)} of {cartArray.length} items
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCartPage(prev => Math.max(1, prev - 1))}
                                        disabled={cartPage === 1}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {cartPage} of {totalCartPages}
                                    </span>
                                    <button
                                        onClick={() => setCartPage(prev => Math.min(totalCartPages, prev + 1))}
                                        disabled={cartPage === totalCartPages}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>

                {/* Ordered Items Section */}
                {orderedItems.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-slate-200">
                        <div className="flex items-center gap-2 mb-6">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h2 className="text-xl font-semibold text-slate-800">Ordered Items</h2>
                        </div>
                        
                        <div className="space-y-6">
                            {paginatedOrders.map((order, orderIndex) => (
                                <div key={orderIndex} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-medium text-green-900">
                                                Order placed on {new Date(order.orderedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            <p className="text-xs text-green-700 mt-1">
                                                Total: {currency}{order.totalPrice.toLocaleString()} • {order.totalQuantity} item{order.totalQuantity !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                                            Ordered
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {order.items.map((item, itemIndex) => {
                                            // Handle images - can be from item.images
                                            const itemImages = item.images && Array.isArray(item.images) && item.images.length > 0 
                                                ? item.images 
                                                : [];
                                            const itemImage = itemImages.length > 0 
                                                ? (getImageUrl(itemImages[0]) || '/placeholder-image.jpg')
                                                : '/placeholder-image.jpg';
                                            
                                            return (
                                                <div key={itemIndex} className="flex items-center gap-4 bg-white rounded-lg p-3">
                                                    <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                                        <Image 
                                                            src={itemImage} 
                                                            className="h-14 w-auto" 
                                                            alt={item.name || item.title || 'Product'} 
                                                            width={45} 
                                                            height={45}
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-800">{item.name || item.title || 'Product'}</p>
                                                        <p className="text-xs text-slate-500">Quantity: {item.quantity}</p>
                                                        <p className="text-sm font-semibold text-slate-700 mt-1">
                                                            {currency}{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Orders Pagination */}
                        {totalOrdersPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Showing {ordersStartIndex + 1} to {Math.min(ordersEndIndex, orderedItems.length)} of {orderedItems.length} orders
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setOrdersPage(prev => Math.max(1, prev - 1))}
                                        disabled={ordersPage === 1}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {ordersPage} of {totalOrdersPages}
                                    </span>
                                    <button
                                        onClick={() => setOrdersPage(prev => Math.min(totalOrdersPages, prev + 1))}
                                        disabled={ordersPage === totalOrdersPages}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div className="min-h-screen mx-6">
            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />
                
                <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
                </div>

                {/* Ordered Items Section - Show even when cart is empty */}
                {orderedItems.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-slate-200">
                        <div className="flex items-center gap-2 mb-6">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h2 className="text-xl font-semibold text-slate-800">Ordered Items</h2>
                        </div>
                        
                        <div className="space-y-6">
                            {paginatedOrders.map((order, orderIndex) => (
                                <div key={orderIndex} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-medium text-green-900">
                                                Order placed on {new Date(order.orderedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            <p className="text-xs text-green-700 mt-1">
                                                Total: {currency}{order.totalPrice.toLocaleString()} • {order.totalQuantity} item{order.totalQuantity !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                                            Ordered
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {order.items.map((item, itemIndex) => {
                                            // Handle images - can be from item.images
                                            const itemImages = item.images && Array.isArray(item.images) && item.images.length > 0 
                                                ? item.images 
                                                : [];
                                            const itemImage = itemImages.length > 0 
                                                ? (getImageUrl(itemImages[0]) || '/placeholder-image.jpg')
                                                : '/placeholder-image.jpg';
                                            
                                            return (
                                                <div key={itemIndex} className="flex items-center gap-4 bg-white rounded-lg p-3">
                                                    <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                                        <Image 
                                                            src={itemImage} 
                                                            className="h-14 w-auto" 
                                                            alt={item.name || item.title || 'Product'} 
                                                            width={45} 
                                                            height={45}
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-800">{item.name || item.title || 'Product'}</p>
                                                        <p className="text-xs text-slate-500">Quantity: {item.quantity}</p>
                                                        <p className="text-sm font-semibold text-slate-700 mt-1">
                                                            {currency}{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Orders Pagination */}
                        {totalOrdersPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Showing {ordersStartIndex + 1} to {Math.min(ordersEndIndex, orderedItems.length)} of {orderedItems.length} orders
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setOrdersPage(prev => Math.max(1, prev - 1))}
                                        disabled={ordersPage === 1}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {ordersPage} of {totalOrdersPages}
                                    </span>
                                    <button
                                        onClick={() => setOrdersPage(prev => Math.min(totalOrdersPages, prev + 1))}
                                        disabled={ordersPage === totalOrdersPages}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}