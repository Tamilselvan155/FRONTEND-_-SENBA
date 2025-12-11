'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchProducts } from "@/lib/actions/productActions";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ShoppingCart, Search, ArrowRight, Package } from "lucide-react";
import Image from "next/image";
import Loading from "@/components/Loading";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    if (!query || query.trim() === '') {
      setProducts([]);
      setLoading(false);
      setHasSearched(true);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await searchProducts(query);
      if (result.success) {
        setProducts(result.data || []);
      } else {
        setProducts([]);
        setError(result.error || 'Search failed');
      }
    } catch (err) {
      console.error('Search error:', err);
      setProducts([]);
      setError(err.message || 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const transformProduct = (apiProduct) => {
    if (!apiProduct) return null;

    // Handle images
    let productImages = [];
    if (apiProduct.images) {
      if (Array.isArray(apiProduct.images) && apiProduct.images.length > 0) {
        productImages = apiProduct.images
          .filter(img => img && img.trim() !== '')
          .map(img => {
            if (img.startsWith('http')) return img;
            return img.startsWith('/uploads/') ? `${baseUrl}${img}` : `${baseUrl}/uploads/${img}`;
          });
      } else if (typeof apiProduct.images === 'string' && apiProduct.images.trim() !== '') {
        const img = apiProduct.images.startsWith('http') 
          ? apiProduct.images 
          : apiProduct.images.startsWith('/uploads/') 
            ? `${baseUrl}${apiProduct.images}` 
            : `${baseUrl}/uploads/${apiProduct.images}`;
        productImages = [img];
      }
    }

    // Get category name
    let categoryNameValue = '';
    if (typeof apiProduct.category === 'string' && apiProduct.category.trim() !== '') {
      categoryNameValue = apiProduct.category;
    } else if (apiProduct.category?.title) {
      categoryNameValue = apiProduct.category.title;
    } else if (apiProduct.categoryId) {
      if (typeof apiProduct.categoryId === 'object') {
        if (apiProduct.categoryId.parentId && typeof apiProduct.categoryId.parentId === 'object' && apiProduct.categoryId.parentId.title) {
          categoryNameValue = apiProduct.categoryId.parentId.title;
        } else if (apiProduct.categoryId.isParent || !apiProduct.categoryId.parentId) {
          categoryNameValue = apiProduct.categoryId.title || '';
        } else {
          categoryNameValue = apiProduct.categoryId.title || '';
        }
      }
    }

    // Handle price
    let price = 0;
    if (apiProduct.hasVariants && apiProduct.brandVariants && Array.isArray(apiProduct.brandVariants) && apiProduct.brandVariants.length > 0) {
      const variantPrice = apiProduct.brandVariants[0]?.price;
      if (variantPrice !== undefined && variantPrice !== null) {
        price = Number(variantPrice);
      }
    } else if (apiProduct.price !== undefined && apiProduct.price !== null) {
      price = Number(apiProduct.price);
    }

    const discount = apiProduct.discount ? Number(apiProduct.discount) : 0;
    const finalPrice = discount > 0 ? price - (price * discount / 100) : price;

    return {
      id: apiProduct._id,
      title: apiProduct.title,
      category: categoryNameValue,
      images: productImages,
      price: finalPrice,
      originalPrice: price,
      discount: discount,
      stock: apiProduct.stock || 0,
      hasVariants: apiProduct.hasVariants || false,
      brandVariants: apiProduct.brandVariants || [],
    };
  };

  const handleAddToCart = (product) => {
    const transformedProduct = transformProduct(product);
    if (!transformedProduct) return;

    if (transformedProduct.hasVariants && transformedProduct.brandVariants.length > 0) {
      toast.error('Please select a variant first');
      return;
    }

    dispatch(addToCart({
      id: transformedProduct.id,
      name: transformedProduct.title,
      price: transformedProduct.price,
      image: transformedProduct.images[0] || '/placeholder-product.png',
      quantity: 1,
    }));

    toast.success(`${transformedProduct.title} added to cart!`);
  };

  const transformedProducts = products.map(transformProduct).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Products</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or category..."
                className="w-full px-4 py-3 pl-12 pr-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-white"
              />
              <Search 
                size={20} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#7C2A47] text-white rounded-lg hover:bg-[#7C2A47]/90 transition-colors"
                aria-label="Search"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-600 text-lg mb-4">Error: {error}</p>
            <button
              onClick={() => performSearch(searchQuery)}
              className="px-6 py-2 bg-[#7C2A47] text-white rounded-lg hover:bg-[#7C2A47]/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && hasSearched && transformedProducts.length === 0 && (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching &quot;{searchParams.get('q')}&quot;
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Try searching with different keywords or browse our categories
            </p>
            <Link
              href="/category/products"
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#7C2A47] text-white rounded-lg hover:bg-[#7C2A47]/90 transition-colors"
            >
              Browse All Products
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Results */}
        {!loading && !error && transformedProducts.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found <span className="font-semibold text-[#7C2A47]">{transformedProducts.length}</span> product{transformedProducts.length !== 1 ? 's' : ''} for &quot;{searchParams.get('q')}&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {transformedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden group"
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={48} className="text-gray-400" />
                        </div>
                      )}
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-[#7C2A47] text-white px-2 py-1 rounded text-xs font-semibold">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#7C2A47] transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    
                    {product.category && (
                      <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-[#7C2A47]">
                          {currency}{product.price.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {currency}{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const originalProduct = products.find(p => p._id === product.id);
                        if (originalProduct) handleAddToCart(originalProduct);
                      }}
                      disabled={product.stock === 0}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        product.stock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#7C2A47] text-white hover:bg-[#7C2A47]/90'
                      }`}
                    >
                      <ShoppingCart size={18} />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}






