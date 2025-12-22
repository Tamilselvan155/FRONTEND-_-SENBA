'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import BackButton from "@/components/BackButton";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { fetchProductById } from "@/lib/actions/productActions";
import { assets } from "@/assets/assets";

export default function Product() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const products = useSelector(state => state.product.list || state.product.products || []);

    // Transform product data to match component expectations
    const transformProduct = (apiProduct) => {
        if (!apiProduct) return null;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        // Handle images - check if it's an array or single string
        let productImages = [];
        if (apiProduct.images) {
            if (Array.isArray(apiProduct.images) && apiProduct.images.length > 0) {
                productImages = apiProduct.images
                    .filter(img => img && img.trim() !== '') // Filter out empty strings
                    .map(img => {
                        if (img.startsWith('http')) return img;
                        return img.startsWith('/uploads/') ? `${baseUrl}${img}` : `${baseUrl}/uploads/${img}`;
                    });
            } else if (typeof apiProduct.images === 'string' && apiProduct.images.trim() !== '') {
                // Single image string
                const img = apiProduct.images.startsWith('http') 
                    ? apiProduct.images 
                    : apiProduct.images.startsWith('/uploads/') 
                        ? `${baseUrl}${apiProduct.images}` 
                        : `${baseUrl}/uploads/${apiProduct.images}`;
                productImages = [img];
            }
        }
        
        // Use placeholder if no images
        if (productImages.length === 0) {
            productImages = [assets.product_img0];
        }

        // Get category name - handle both simplified format (string) and full format (object)
        let categoryName = '';
        if (apiProduct.categoryId) {
            if (typeof apiProduct.categoryId === 'object') {
                // If categoryId has a populated parentId, use the parent's title
                if (apiProduct.categoryId.parentId && typeof apiProduct.categoryId.parentId === 'object' && apiProduct.categoryId.parentId.title) {
                    categoryName = apiProduct.categoryId.parentId.title;
                } 
                // If categoryId itself is a parent category, use its own title
                else if (apiProduct.categoryId.isParent || !apiProduct.categoryId.parentId) {
                    categoryName = apiProduct.categoryId.title || '';
                }
                // Fallback to categoryId title
                else {
                    categoryName = apiProduct.categoryId.title || '';
                }
            } else {
                categoryName = String(apiProduct.categoryId);
            }
        } 
        
        // Handle category field (could be string from simplified format or object from full format)
        if (!categoryName && apiProduct.category) {
            categoryName = typeof apiProduct.category === 'object' 
                ? (apiProduct.category.title || '') 
                : String(apiProduct.category);
        }

        // Handle price - check if product has variants (price might be in brandVariants)
        let price = 0;
        
        // Try multiple ways to get the price
        if (apiProduct.hasVariants && apiProduct.brandVariants && Array.isArray(apiProduct.brandVariants) && apiProduct.brandVariants.length > 0) {
            // If product has variants, get price from first variant
            const variantPrice = apiProduct.brandVariants[0]?.price;
            if (variantPrice !== undefined && variantPrice !== null) {
                price = Number(variantPrice);
            }
        }
        
        // If price is still 0, try root level price
        if (price === 0 && apiProduct.price !== undefined && apiProduct.price !== null) {
            price = Number(apiProduct.price);
        }
        
        // If still 0, check if price is stored as string "0" or empty
        if (price === 0) {
            const priceStr = String(apiProduct.price || '').trim();
            if (priceStr && priceStr !== '0' && priceStr !== '') {
                price = Number(priceStr);
            }
        }
        
        // Calculate MRP - calculate from discount if available, otherwise use MRP field
        let mrp = 0;
        if (apiProduct.hasVariants && apiProduct.brandVariants && apiProduct.brandVariants.length > 0) {
            // For variants, get discount from first variant to calculate base MRP
            const discount = Number(apiProduct.brandVariants[0]?.discount) || 0;
            if (discount > 0 && price > 0) {
                // MRP = Price / (1 - discount/100)
                mrp = Math.round(price / (1 - discount / 100));
            } else if (apiProduct.mrp && apiProduct.mrp > price) {
                // Use MRP from product if available
                mrp = Number(apiProduct.mrp);
            } else {
                // If no discount, MRP = price (no discount applied)
                mrp = price;
            }
        } else {
            // For regular products, calculate MRP from discount if available
            const discount = Number(apiProduct.discount) || 0;
            if (discount > 0 && price > 0) {
                // MRP = Price / (1 - discount/100)
                mrp = Math.round(price / (1 - discount / 100));
            } else if (apiProduct.mrp && apiProduct.mrp > price) {
                // Use MRP from product if available
                mrp = Number(apiProduct.mrp);
            } else {
                // If no discount, MRP = price (no discount applied)
                mrp = price;
            }
        }

        return {
            id: apiProduct._id || apiProduct.id,
            _id: apiProduct._id || apiProduct.id,
            name: apiProduct.title || apiProduct.name || 'Untitled Product',
            title: apiProduct.title || apiProduct.name || 'Untitled Product',
            description: apiProduct.description || '',
            price: price,
            mrp: mrp, // Set MRP to 20% more than price if not provided (for discount display)
            images: productImages,
            category: categoryName || '',
            subcategory: typeof apiProduct.subcategory === 'object' 
                ? (apiProduct.subcategory?.title || '') 
                : (apiProduct.subcategory || ''),
            rating: Array.isArray(apiProduct.rating) ? apiProduct.rating : [],
            stock: Number(apiProduct.stock) || 0,
            sku: apiProduct.sku || '',
            isFeatured: apiProduct.isFeatured || false,
            status: apiProduct.status || 'active',
            specificationGroups: Array.isArray(apiProduct.specificationGroups) ? apiProduct.specificationGroups : [],
            brandVariants: Array.isArray(apiProduct.brandVariants) ? apiProduct.brandVariants : [],
            hasVariants: apiProduct.hasVariants || false,
        };
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            
            // Always fetch from API to ensure we have complete product data including variants
            // Redux store might have incomplete data
            const response = await fetchProductById(productId);
            
            // fetchProductById returns response.data directly from axios
            // The API should return { success: true, data: product } or just the product object
            let productData = null;
            
            if (response) {
                // Check if response has success and data properties
                if (response.success && response.data) {
                    productData = response.data;
                } 
                // Check if response.data exists (might be nested)
                else if (response.data && typeof response.data === 'object' && !response.success) {
                    productData = response.data;
                } 
                // Response might be the product object directly
                else if (response._id || response.id) {
                    productData = response;
                }
            }
            
            if (productData) {
                const transformed = transformProduct(productData);
                setProduct(transformed);
            } else {
                // If API fetch fails, try Redux store as fallback
                if (products && Array.isArray(products) && products.length > 0) {
                    const foundProduct = products.find((p) => (p.id || p._id) === productId);
                    if (foundProduct) {
                        const transformed = transformProduct(foundProduct);
                        setProduct(transformed);
                    } else {
                        setProduct(null);
                    }
                } else {
                    setProduct(null);
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            // On error, try Redux store as fallback
            if (products && Array.isArray(products) && products.length > 0) {
                const foundProduct = products.find((p) => (p.id || p._id) === productId);
                if (foundProduct) {
                    const transformed = transformProduct(foundProduct);
                    setProduct(transformed);
                } else {
                    setProduct(null);
                }
            } else {
                setProduct(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProduct();
            scrollTo(0, 0);
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="mx-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading product...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="mx-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-gray-500">Product not found</p>
                        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
                            Go back to home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Go Back Button - Top Left Corner */}
                <div className="pt-4 sm:pt-5 lg:pt-6 pb-3 sm:pb-4">
                    <BackButton fallbackUrl="/category/products" />
                </div>
                {/* ✅ Breadcrumbs - Properly Aligned */}
                <div className="pb-4 sm:pb-6">
                    <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base">
                        <Link 
                            href="/" 
                            className="text-gray-600 hover:text-[#7C2A47] transition-colors duration-200"
                        >
                            Home
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link 
                            href={`/category/products`}
                            className="text-gray-600 hover:text-[#7C2A47] transition-colors duration-200"
                        >
                            Products
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-[300px] md:max-w-none">
                            {product?.category || 'Product'}
                        </span>
                    </nav>
                </div>

                {/* Product Details */}
                <ProductDetails product={product} />

                {/* Description & Reviews */}
                <ProductDescription product={product} />
            </div>
        </div>
    );
}