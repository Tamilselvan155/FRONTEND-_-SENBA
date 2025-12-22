'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchProducts } from "@/lib/actions/productActions";
import Link from "next/link";
import { Search, ArrowRight, Package } from "lucide-react";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import BackButton from "@/components/BackButton";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
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
    const mrp = apiProduct.mrp || price;
    const finalPrice = discount > 0 ? price - (price * discount / 100) : price;

    // Get brand
    const brand = apiProduct.brand || 
                  (typeof apiProduct.category === 'string' ? apiProduct.category : 
                   apiProduct.category?.englishName || apiProduct.category?.name || 
                   apiProduct.category?.title || '');

    // Handle rating
    let rating = [];
    if (apiProduct.rating) {
      if (Array.isArray(apiProduct.rating)) {
        rating = apiProduct.rating;
      } else if (typeof apiProduct.rating === 'number') {
        rating = [{ rating: apiProduct.rating }];
      }
    }

    return {
      id: apiProduct._id || apiProduct.id,
      name: apiProduct.title || apiProduct.name || 'Untitled Product',
      category: categoryNameValue,
      images: productImages,
      price: finalPrice,
      mrp: mrp,
      discount: discount,
      stock: apiProduct.stock || 0,
      inStock: (apiProduct.stock === undefined || apiProduct.stock === null) ? true : apiProduct.stock > 0,
      hasVariants: apiProduct.hasVariants || false,
      brandVariants: apiProduct.brandVariants || [],
      brand: brand,
      rating: rating,
    };
  };

  const transformedProducts = products.map(transformProduct).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Go Back Button - Top Left Corner */}
        <div className="mb-4 sm:mb-5">
          <BackButton fallbackUrl="/" />
        </div>
        {/* Search Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Search Products</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or category..."
                className="w-full px-4 py-3 pl-12 pr-24 sm:pr-28 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C2A47]/20 focus:border-[#7C2A47] transition-all duration-200 bg-white"
              />
              <Search 
                size={18} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2 bg-[#7C2A47] text-white rounded-lg hover:bg-[#6a243d] transition-colors text-sm sm:text-base font-medium"
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
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <Package size={48} className="mx-auto text-gray-400 mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">No Products Found</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
              We couldn't find any products matching &quot;<span className="font-medium">{searchParams.get('q')}</span>&quot;
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 px-4">
              Try searching with different keywords or browse our categories
            </p>
            <Link
              href="/category/products"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#7C2A47] text-white rounded-lg hover:bg-[#6a243d] transition-colors text-sm sm:text-base font-medium"
            >
              Browse All Products
              <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </Link>
          </div>
        )}

        {/* Results */}
        {!loading && !error && transformedProducts.length > 0 && (
          <>
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-600">
                Found <span className="font-semibold text-[#7C2A47]">{transformedProducts.length}</span> product{transformedProducts.length !== 1 ? 's' : ''} for &quot;<span className="font-medium text-gray-900">{searchParams.get('q')}</span>&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {transformedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

