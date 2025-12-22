'use client';

import React, { useState, useEffect } from "react";
import { fetchProducts } from "@/lib/actions/productActions";
import { useSelector } from "react-redux";
import { useCart } from "@/lib/hooks/useCart";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowRight, Send, ChevronLeft, ChevronRight } from "lucide-react";
import ProductFilters from "./ProductFilters";
import Loading from "./Loading";
import BackButton from "./BackButton";
import { assets } from "@/assets/assets";

export default function CategoryProductsFilter({ categoryName, subCategoryName }) {
  const { cartItems, addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [selectedHpOptions, setSelectedHpOptions] = useState({}); // Track selected HP for each product
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    selectedPipeSizes: [],
    selectedSpeeds: [],
    selectedHeadRanges: [],
    selectedFlowRanges: [],
    selectedHPs: [],
    selectedCategories: [],
    inStockOnly: false,
    outOfStockOnly: false,
    sortBy: "default",
  });

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Transform API product to match component expectations (same as Categoryproducts)
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

    // Get subcategory name
    let subCategoryNameValue = '';
    if (typeof apiProduct.subcategory === 'string' && apiProduct.subcategory.trim() !== '') {
      subCategoryNameValue = apiProduct.subcategory;
    } else if (apiProduct.subcategory?.title) {
      subCategoryNameValue = apiProduct.subcategory.title;
    } else if (apiProduct.categoryId && typeof apiProduct.categoryId === 'object' && apiProduct.categoryId.parentId) {
      if (!apiProduct.categoryId.isParent && apiProduct.categoryId.title) {
        subCategoryNameValue = apiProduct.categoryId.title;
      }
    }

    // Handle price
    let price = 0;
    if (apiProduct.hasVariants && apiProduct.brandVariants && Array.isArray(apiProduct.brandVariants) && apiProduct.brandVariants.length > 0) {
      const variantPrice = apiProduct.brandVariants[0]?.price;
      if (variantPrice !== undefined && variantPrice !== null) {
        price = Number(variantPrice);
      }
    }
    if (price === 0 && apiProduct.price !== undefined && apiProduct.price !== null) {
      price = Number(apiProduct.price);
    }

    // Transform specificationGroups to specs array
    let specs = [];
    if (apiProduct.specificationGroups && Array.isArray(apiProduct.specificationGroups)) {
      apiProduct.specificationGroups.forEach(group => {
        if (group.specifications) {
          if (Array.isArray(group.specifications)) {
            group.specifications.forEach(spec => {
              specs.push({
                label: spec.label || spec.attributeName || '',
                value: spec.value || spec.attributeValue || ''
              });
            });
          } else if (typeof group.specifications === 'object') {
            Object.entries(group.specifications).forEach(([key, value]) => {
              specs.push({
                label: key,
                value: value || ''
              });
            });
          }
        }
      });
    }

    // Transform brandVariants to options array (HP options)
    let options = [];
    const hpOptions = new Set();
    
    if (apiProduct.brandVariants && Array.isArray(apiProduct.brandVariants)) {
      apiProduct.brandVariants.forEach(variant => {
        if (variant.attributes && Array.isArray(variant.attributes)) {
          variant.attributes.forEach(attr => {
            const attrName = attr.attributeName || attr.attributeId?.title || '';
            const attrValue = attr.attributeValue || attr.attributeValueId?.value || '';
            
            if (attrName && (attrName.toLowerCase().includes('hp') || attrName.toLowerCase().includes('horsepower'))) {
              if (attrValue && attrValue.trim() !== '') {
                if (attrValue.toLowerCase().includes('hp')) {
                  hpOptions.add(attrValue);
                } else {
                  hpOptions.add(`HP: ${attrValue}`);
                }
              }
            } else if (attrValue && (attrValue.toLowerCase().includes('hp') || attrValue.toLowerCase().includes('horsepower'))) {
              hpOptions.add(attrValue);
            } else if (attr.attributeId && typeof attr.attributeId === 'object' && attr.attributeId.title) {
              const attrIdTitle = attr.attributeId.title.toLowerCase();
              if (attrIdTitle.includes('hp') || attrIdTitle.includes('horsepower')) {
                const value = attrValue || attr.attributeValueId?.value || '';
                if (value) {
                  hpOptions.add(`HP: ${value}`);
                }
              }
            }
          });
        }
      });
    }
    
    // Also check specifications for HP information
    if (apiProduct.specificationGroups && Array.isArray(apiProduct.specificationGroups)) {
      apiProduct.specificationGroups.forEach(group => {
        if (group.specifications) {
          if (Array.isArray(group.specifications)) {
            group.specifications.forEach(spec => {
              const label = spec.label || spec.attributeName || '';
              const value = spec.value || spec.attributeValue || '';
              
              if (label && (label.toLowerCase().includes('power') || label.toLowerCase().includes('hp'))) {
                if (value) {
                  const hpMatches = value.match(/(\d+\.?\d*)\s*HP/gi);
                  if (hpMatches) {
                    hpMatches.forEach(match => {
                      const numMatch = match.match(/(\d+\.?\d*)/);
                      if (numMatch) {
                        hpOptions.add(`HP: ${numMatch[1]}`);
                      }
                    });
                  }
                }
              }
            });
          } else if (typeof group.specifications === 'object') {
            Object.entries(group.specifications).forEach(([key, value]) => {
              if (key && (key.toLowerCase().includes('power') || key.toLowerCase().includes('hp'))) {
                if (value && typeof value === 'string') {
                  const hpMatches = value.match(/(\d+\.?\d*)\s*HP/gi);
                  if (hpMatches) {
                    hpMatches.forEach(match => {
                      const numMatch = match.match(/(\d+\.?\d*)/);
                      if (numMatch) {
                        hpOptions.add(`HP: ${numMatch[1]}`);
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
    
    if (hpOptions.size > 0) {
      options = Array.from(hpOptions).sort((a, b) => {
        const extractNum = (str) => {
          const match = str.match(/(\d+\.?\d*)/);
          return match ? parseFloat(match[1]) : 0;
        };
        return extractNum(a) - extractNum(b);
      });
    }

    if (options.length === 0 && apiProduct.options && Array.isArray(apiProduct.options)) {
      options = apiProduct.options;
    }

    // Create mapping of HP options to variant prices
    const hpToPriceMap = {};
    if (apiProduct.brandVariants && Array.isArray(apiProduct.brandVariants)) {
      apiProduct.brandVariants.forEach(variant => {
        if (variant.attributes && Array.isArray(variant.attributes)) {
          variant.attributes.forEach(attr => {
            const attrName = attr.attributeName || attr.attributeId?.title || '';
            const attrValue = attr.attributeValue || attr.attributeValueId?.value || '';
            
            if (attrName && (attrName.toLowerCase().includes('hp') || attrName.toLowerCase().includes('horsepower'))) {
              if (attrValue && attrValue.trim() !== '') {
                const hpKey = attrValue.toLowerCase().includes('hp') ? attrValue : `HP: ${attrValue}`;
                const variantPrice = variant.price !== undefined && variant.price !== null ? Number(variant.price) : price;
                hpToPriceMap[hpKey] = variantPrice;
              }
            } else if (attrValue && (attrValue.toLowerCase().includes('hp') || attrValue.toLowerCase().includes('horsepower'))) {
              const variantPrice = variant.price !== undefined && variant.price !== null ? Number(variant.price) : price;
              hpToPriceMap[attrValue] = variantPrice;
            } else if (attr.attributeId && typeof attr.attributeId === 'object' && attr.attributeId.title) {
              const attrIdTitle = attr.attributeId.title.toLowerCase();
              if (attrIdTitle.includes('hp') || attrIdTitle.includes('horsepower')) {
                const value = attrValue || attr.attributeValueId?.value || '';
                if (value) {
                  const hpKey = `HP: ${value}`;
                  const variantPrice = variant.price !== undefined && variant.price !== null ? Number(variant.price) : price;
                  hpToPriceMap[hpKey] = variantPrice;
                }
              }
            }
          });
        }
      });
    }

    return {
      id: apiProduct.id || apiProduct._id,
      name: apiProduct.title || apiProduct.name || 'Untitled Product',
      description: apiProduct.description || '',
      price: price,
      mrp: apiProduct.mrp || price,
      images: productImages.length > 0 ? productImages : [],
      category: categoryNameValue,
      subCategory: subCategoryNameValue,
      inStock: (apiProduct.stock !== undefined && apiProduct.stock !== null) ? apiProduct.stock > 0 : true,
      stock: Number(apiProduct.stock) || 0,
      options: options,
      specs: specs,
      rating: Array.isArray(apiProduct.rating) ? apiProduct.rating : [],
      createdAt: apiProduct.createdAt || new Date().toISOString(),
      hpToPriceMap: hpToPriceMap, // Map HP options to prices
      originalProduct: apiProduct, // Store original for reference
    };
  };

  // Fetch products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchProducts();
        
        let productsData = [];
        if (response && response.success && response.data) {
          productsData = response.data;
        } else if (Array.isArray(response)) {
          productsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          productsData = response.data;
        }

        const transformedProducts = productsData
          .map(transformProduct)
          .filter(product => product !== null);

        setProducts(transformedProducts);
        
        // Initialize selected HP options - select first option for each product
        const initialHpSelections = {};
        transformedProducts.forEach(product => {
          if (product.options && product.options.length > 0) {
            initialHpSelections[product.id] = product.options[0];
          }
        });
        setSelectedHpOptions(initialHpSelections);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryName, subCategoryName]);

  // Auto-select category from URL query params after products are loaded
  useEffect(() => {
    if (categoryName && categoryName !== "products" && products.length > 0 && filters.selectedCategories.length === 0) {
      // Normalize category name for matching - handle both hyphens and spaces
      const normalizeCategory = (cat) => {
        if (!cat) return '';
        // Convert to lowercase, replace hyphens with spaces, normalize spaces
        return cat.trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ');
      };
      
      // Decode URL-encoded category name
      const decodedCategoryName = decodeURIComponent(categoryName);
      const normalizedCategoryName = normalizeCategory(decodedCategoryName);
      
      // Find matching category from available categories
      const allCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
      const matchingCategory = allCategories.find(cat => {
        const normalizedCat = normalizeCategory(cat);
        // Exact match first
        if (normalizedCat === normalizedCategoryName) {
          return true;
        }
        // Check if category names match when comparing word by word
        const catWords = normalizedCat.split(' ').filter(w => w.length > 0);
        const nameWords = normalizedCategoryName.split(' ').filter(w => w.length > 0);
        // Match if all words from one are in the other
        if (catWords.length > 0 && nameWords.length > 0) {
          return catWords.every(word => nameWords.includes(word)) || 
                 nameWords.every(word => catWords.includes(word));
        }
        return false;
      });
      
      if (matchingCategory) {
        setFilters(prev => ({
          ...prev,
          selectedCategories: [matchingCategory]
        }));
      }
    }
  }, [categoryName, products, filters.selectedCategories.length]);

  // Apply filters and sorting
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Handle HP option selection
  const handleHpOptionSelect = (productId, hpOption) => {
    setSelectedHpOptions(prev => ({
      ...prev,
      [productId]: hpOption
    }));
  };

  // Get display price for a product based on selected HP
  const getDisplayPrice = (product) => {
    const selectedHp = selectedHpOptions[product.id];
    if (selectedHp && product.hpToPriceMap && product.hpToPriceMap[selectedHp]) {
      return product.hpToPriceMap[selectedHp];
    }
    return product.price;
  };

  // Initialize filteredProducts when products change
  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products);
      
      // Initialize selected HP options for new products
      setSelectedHpOptions(prev => {
        const updated = { ...prev };
        products.forEach(product => {
          if (product.options && product.options.length > 0 && !updated[product.id]) {
            updated[product.id] = product.options[0];
          }
        });
        return updated;
      });
    } else {
      setFilteredProducts([]);
    }
  }, [products]);

  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let updatedProducts = [...products];

    // Helper function to normalize category/subcategory names - handle hyphens and spaces
    const normalizeCategory = (cat) => {
      if (!cat) return '';
      // Convert to lowercase, replace hyphens with spaces, normalize spaces
      return cat.trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ');
    };

    // Apply subcategory filter first (if subcategory is provided from query params)
    if (subCategoryName) {
      const decodedSubCategoryName = decodeURIComponent(subCategoryName);
      const normalizedSubCategoryName = normalizeCategory(decodedSubCategoryName);
      updatedProducts = updatedProducts.filter((p) => {
        const productSubCat = normalizeCategory(p.subCategory || '');
        return productSubCat === normalizedSubCategoryName ||
               productSubCat.includes(normalizedSubCategoryName) ||
               normalizedSubCategoryName.includes(productSubCat);
      });
    }

    // Apply category filter (OR logic - match ANY selected category)
    // Apply filter if categories are selected OR if categoryName is provided from query params
    if (filters.selectedCategories.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        // Match if product category matches ANY selected category
        filters.selectedCategories.some(selectedCat => {
          const productCat = normalizeCategory(p.category || '');
          const selectedCatLower = normalizeCategory(selectedCat);
          // Exact match first
          if (productCat === selectedCatLower) return true;
          // Word-by-word matching for better accuracy
          const productWords = productCat.split(' ').filter(w => w.length > 0);
          const selectedWords = selectedCatLower.split(' ').filter(w => w.length > 0);
          if (productWords.length > 0 && selectedWords.length > 0) {
            return productWords.every(word => selectedWords.includes(word)) || 
                   selectedWords.every(word => productWords.includes(word));
          }
          return false;
        })
      );
    } else if (categoryName && categoryName !== "products" && !subCategoryName) {
      // If no categories selected but categoryName provided (and no subcategory), filter by it
      const decodedCategoryName = decodeURIComponent(categoryName);
      const normalizedCategoryName = normalizeCategory(decodedCategoryName);
      
      updatedProducts = updatedProducts.filter((p) => {
        const productCat = normalizeCategory(p.category || '');
        // Exact match first
        if (productCat === normalizedCategoryName) return true;
        // Word-by-word matching for better accuracy
        const productWords = productCat.split(' ').filter(w => w.length > 0);
        const nameWords = normalizedCategoryName.split(' ').filter(w => w.length > 0);
        if (productWords.length > 0 && nameWords.length > 0) {
          return productWords.every(word => nameWords.includes(word)) || 
                 nameWords.every(word => productWords.includes(word));
        }
        return false;
      });
    }

    // Apply pipe size filter (OR logic - match ANY selected option)
    if (filters.selectedPipeSizes.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.specs && p.specs.some(
          (spec) => {
            const label = spec.label || '';
            const value = spec.value || '';
            // Match if label contains "Pipe size" and value matches ANY selected pipe size
            return label.toLowerCase().includes('pipe size') && 
                   filters.selectedPipeSizes.some(selectedSize => 
                     value.includes(selectedSize) || selectedSize.includes(value)
                   );
          }
        )
      );
    }

    // Apply speed filter (OR logic - match ANY selected option)
    if (filters.selectedSpeeds.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.specs && p.specs.some(
          (spec) => {
            const label = spec.label || '';
            const value = spec.value || '';
            // Match if label contains "Speed" and value matches ANY selected speed
            return label.toLowerCase().includes('speed') && 
                   filters.selectedSpeeds.some(selectedSpeed => 
                     value.includes(selectedSpeed) || selectedSpeed.includes(value)
                   );
          }
        )
      );
    }

    // Apply head range filter (OR logic - match ANY selected option)
    if (filters.selectedHeadRanges.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.specs && p.specs.some(
          (spec) => {
            const label = spec.label || '';
            const value = spec.value || '';
            // Match if label contains "Head range" and value matches ANY selected head range
            return label.toLowerCase().includes('head range') && 
                   filters.selectedHeadRanges.some(selectedHeadRange => 
                     value.includes(selectedHeadRange) || selectedHeadRange.includes(value)
                   );
          }
        )
      );
    }

    // Apply flow range filter (OR logic - match ANY selected option)
    if (filters.selectedFlowRanges.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.specs && p.specs.some(
          (spec) => {
            const label = spec.label || '';
            const value = spec.value || '';
            // Match if label contains "Flow range" and value matches ANY selected flow range
            return label.toLowerCase().includes('flow range') && 
                   filters.selectedFlowRanges.some(selectedFlowRange => 
                     value.includes(selectedFlowRange) || selectedFlowRange.includes(value)
                   );
          }
        )
      );
    }

    // Apply HP filter (OR logic - match ANY selected option)
    if (filters.selectedHPs.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.options && p.options.length > 0 && 
        // Match if ANY option matches ANY selected HP
        filters.selectedHPs.some(selectedHP => 
          p.options.some(opt => {
            // Normalize HP values for comparison
            const optValue = opt.replace('HP:', '').replace('HP', '').trim();
            const selectedValue = selectedHP.replace('HP:', '').replace('HP', '').trim();
            return opt.includes(selectedHP) || selectedHP.includes(opt) || 
                   optValue === selectedValue || opt === selectedHP;
          })
        )
      );
    }

    // Apply stock filter
    if (filters.inStockOnly) {
      updatedProducts = updatedProducts.filter((p) => p.inStock);
    } else if (filters.outOfStockOnly) {
      updatedProducts = updatedProducts.filter((p) => !p.inStock);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "priceLowToHigh":
        updatedProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        updatedProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        updatedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "rating":
        updatedProducts.sort((a, b) => {
          const avgA = a.rating && a.rating.length > 0 
            ? a.rating.reduce((sum, r) => sum + (typeof r === 'object' ? r.rating : r), 0) / a.rating.length 
            : 0;
          const avgB = b.rating && b.rating.length > 0 
            ? b.rating.reduce((sum, r) => sum + (typeof r === 'object' ? r.rating : r), 0) / b.rating.length 
            : 0;
          return avgB - avgA;
        });
        break;
      default:
        break;
    }

    setFilteredProducts(updatedProducts);
  }, [filters, products]);

  // 🛒 Add to Cart
  const handleAddToCart = async (product) => {
    try {
      const productPrice = product.price || 0;
      await addToCart({ 
        productId: product.id,
        price: productPrice
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  function handleEnquiry(e, product) {
    e.preventDefault();
    const productImageUrl = product.images && product.images.length > 0 ? product.images[0] : '';
    const displayPrice = getDisplayPrice(product);
    const enquiryUrl = `/enquiry?productId=${encodeURIComponent(product.id || '')}&productName=${encodeURIComponent(product.name || 'Product')}&price=${encodeURIComponent(displayPrice)}&quantity=1&image=${encodeURIComponent(productImageUrl)}`;
    router.push(enquiryUrl);
  }

  const [viewMode, setViewMode] = useState('list'); // grid or list
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4 lg:px-8">
      {/* Go Back Button - Top Left Corner */}
      <div className="mb-3 sm:mb-4 lg:mb-5">
        <BackButton fallbackUrl="/" />
      </div>
      {/* ✅ Breadcrumbs */}
        <nav className="text-gray-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-5 lg:mb-6 flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/"
            className="hover:text-[#7C2A47] transition-colors duration-200"
        >
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href={`/category/products`}
            className="hover:text-[#7C2A47] transition-colors duration-200"
        >
          Products
        </Link>
        <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">
          {subCategoryName 
            ? subCategoryName 
            : categoryName === "products" || !categoryName 
              ? "All Products" 
              : categoryName}
        </span>
      </nav>

        <div className="relative flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 items-start overflow-x-hidden">
          {/* Filters Sidebar - Fixed on desktop */}
          <aside className="w-full lg:w-56 xl:w-60 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-20 lg:z-30">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <ProductFilters products={products} onFilterChange={setFilters} />
        </div>
            </div>
          </aside>

          {/* Products List - Scrollable area */}
          <main className="flex-1 min-w-0 w-full overflow-x-hidden">
            {/* Header Section - Aligned above product list */}
            <div className="mb-3 sm:mb-6 bg-white rounded-lg p-3 sm:p-3 lg:p-4 border border-gray-200 shadow-sm overflow-hidden">
              {/* Mobile: Title and View on same row */}
              <div className="flex flex-col sm:flex-row sm:items-center lg:items-start gap-3 sm:gap-4 lg:gap-4">
                {/* Left Side: Title and Product Count */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 lg:gap-6 flex-1 min-w-0">
                  {/* Title Row - Mobile: Title and View together */}
                  <div className="flex items-center justify-between sm:justify-start gap-3 flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                      {subCategoryName 
                        ? subCategoryName 
                        : categoryName === "products" || !categoryName 
                          ? "All Products" 
                          : categoryName}
                    </h1>
                    
                    {/* View Mode Toggle - Next to title on mobile */}
                    <div className="flex items-center gap-1.5 sm:hidden flex-shrink-0">
                      <span className="text-xs text-gray-700 font-semibold whitespace-nowrap">View:</span>
                      <div className="flex items-center gap-0.5 border border-gray-300 rounded-lg p-0.5 bg-white shadow-sm">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-md transition-all ${
                            viewMode === 'grid'
                              ? 'bg-[#7C2A47] text-white shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          aria-label="Grid view"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-md transition-all ${
                            viewMode === 'list'
                              ? 'bg-[#7C2A47] text-white shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          aria-label="List view"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Count */}
                  <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                    {loading ? (
                      "Loading products..."
                    ) : filteredProducts.length > 0 ? (
                      `Showing ${startIndex + 1} - ${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length} products`
                    ) : (
                      "No products found"
                    )}
                  </p>
                </div>

                {/* Right Side: Display Options - Desktop and Tablet */}
                <div className="hidden sm:flex sm:items-center gap-2 lg:gap-3 flex-shrink-0">
                  {/* Items Per Page */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-700 font-semibold whitespace-nowrap">Display:</label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] transition-all cursor-pointer shadow-sm hover:border-gray-400 min-w-[100px]"
                  >
                      <option value={12}>12 per page</option>
                      <option value={24}>24 per page</option>
                      <option value={48}>48 per page</option>
                      <option value={96}>96 per page</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-700 font-semibold whitespace-nowrap">Sort by:</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                      className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] transition-all cursor-pointer shadow-sm hover:border-gray-400 min-w-[110px]"
                    >
                      <option value="default">Best selling</option>
                      <option value="priceLowToHigh">Price: Low to High</option>
                      <option value="priceHighToLow">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>

                  {/* View Mode Toggle - Desktop */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-700 font-semibold whitespace-nowrap">View:</span>
                    <div className="flex items-center gap-0.5 border border-gray-300 rounded-lg p-0.5 bg-white shadow-sm">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all ${
                          viewMode === 'grid'
                            ? 'bg-[#7C2A47] text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        aria-label="Grid view"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all ${
                          viewMode === 'list'
                            ? 'bg-[#7C2A47] text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        aria-label="List view"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile: Display and Sort By Controls - Below title */}
              <div className="mt-3 sm:hidden grid grid-cols-2 gap-2.5">
                {/* Items Per Page */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-700 font-semibold whitespace-nowrap">Display:</label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="px-2.5 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] transition-all cursor-pointer shadow-sm hover:border-gray-400 w-full"
                  >
                    <option value={12}>12 per page</option>
                    <option value={24}>24 per page</option>
                    <option value={48}>48 per page</option>
                    <option value={96}>96 per page</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-700 font-semibold whitespace-nowrap">Sort by:</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="px-2.5 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] transition-all cursor-pointer shadow-sm hover:border-gray-400 w-full"
                  >
                    <option value="default">Best selling</option>
                    <option value="priceLowToHigh">Price: Low to High</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Products Content */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loading />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-10">
              <p>Error loading products: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-[#c31e5a] text-white rounded-lg hover:bg-[#a81a4d] transition-all"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 w-full overflow-x-hidden' : 'space-y-3 sm:space-y-4 lg:space-y-5 w-full overflow-x-hidden'}>
              {paginatedProducts.map((product, index) => {
                const displayPrice = getDisplayPrice(product);
                
                // Extract brand/category
                const brand = product.brand || 
                              (typeof product.category === 'string' ? product.category : 
                               product.category?.englishName || product.category?.name || 
                               product.category?.title || 'PUMPS');
                
                // Calculate rating
                const ratingValue = (() => {
                  const r = product.rating;
                  if (typeof r === 'number') return r;
                  if (Array.isArray(r) && r.length > 0) {
                    const sum = r.reduce((acc, item) => acc + (Number(item?.rating) || 0), 0);
                    return sum / r.length;
                  }
                  return 0;
                })();
                
                const reviewCount = Array.isArray(product.rating) ? product.rating.length : 0;
                
                // Grid View Layout
                if (viewMode === 'grid') {
                return (
                  <Link 
                    href={`/product/${product.id}`}
                    key={index}
                      className="block w-full max-w-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:border-[#7C2A47]/30 transition-all duration-300 group flex-shrink-0"
                    >
                      {/* Product Image */}
                      <div className="relative w-full aspect-[3/2] sm:aspect-[4/3] bg-gray-50 p-2 sm:p-3 md:p-4 flex items-center justify-center border-b border-gray-100">
                        {product.images && product.images.length > 0 && product.images[0] ? (
                          <img
                            src={product.images[0]?.src || product.images[0]}
                            alt={product.name || 'Product image'}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = assets.product_img0 || '/placeholder-image.png';
                            }}
                          />
                        ) : (
                          <img
                            src={assets.product_img0 || '/placeholder-image.png'}
                            alt="Placeholder"
                            className="w-full h-full object-contain opacity-50"
                          />
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-2 sm:p-3 md:p-4 w-full overflow-hidden">
                        {/* Brand */}
                        <div className="text-xs font-bold text-[#7C2A47] uppercase tracking-wider mb-1 truncate">
                          {brand}
                        </div>
                        
                        {/* Product Name */}
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-[#7C2A47] transition-colors leading-snug break-words">
                          {product.name || 'Untitled Product'}
                        </h3>
                        
                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-1.5 sm:mb-2">
                          {displayPrice !== undefined && displayPrice !== null ? (
                            <>
                              <span className="text-base sm:text-lg font-bold text-[#7C2A47]">
                                {currency}{displayPrice.toLocaleString()}
                              </span>
                              {product.mrp && product.mrp > displayPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  {currency}{product.mrp.toLocaleString()}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">Price on enquiry</span>
                          )}
                        </div>
                        
                        {/* Reviews and Stock Status Row */}
                        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-100">
                          {/* Reviews */}
                          <div className="flex items-center gap-1">
                            {ratingValue > 0 ? (
                              <>
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <span 
                                      key={i} 
                                      className={`text-[10px] sm:text-xs ${i < Math.round(ratingValue) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-600">
                                  {reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? 's' : ''}` : 'No reviews'}
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-[10px] sm:text-xs text-gray-300">★</span>
                                  ))}
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-500">No reviews</span>
                              </>
                            )}
                          </div>
                          
                          {/* Stock Status */}
                          <div className="flex items-center gap-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className={`text-xs font-semibold ${product.inStock ? 'text-green-600' : 'text-gray-500'}`}>
                              {product.inStock ? 'In stock' : 'Sold out'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }
                
                // List View Layout
                return (
                  <Link 
                    href={`/product/${product.id}`}
                    key={index}
                    className="block bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {/* Image - Left Side */}
                      <div className="flex-shrink-0 w-full sm:w-32 h-48 sm:h-32 md:h-40">
                        <div className="w-full h-full bg-white border border-gray-100 rounded-lg p-2 flex items-center justify-center">
                          {product.images && product.images.length > 0 && product.images[0] ? (
                            <img
                              src={product.images[0]?.src || product.images[0]}
                              alt={product.name || 'Product image'}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = assets.product_img0 || '/placeholder-image.png';
                              }}
                            />
                          ) : (
                            <img
                              src={assets.product_img0 || '/placeholder-image.png'}
                              alt="Placeholder"
                              className="w-full h-full object-contain opacity-50"
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Content - Right Side */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          {/* Left Column - Main Info */}
                          <div className="flex-1">
                            {/* Brand */}
                            <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                              {brand}
                            </div>
                            
                            {/* Product Name */}
                            <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#7C2A47] transition-colors">
                              {product.name || 'Untitled Product'}
                            </h3>
                            
                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-2">
                              {displayPrice !== undefined && displayPrice !== null ? (
                                <>
                                  <span className="text-lg font-bold text-[#7C2A47]">
                                    {currency}{displayPrice.toLocaleString()}
                                  </span>
                                  {product.mrp && product.mrp > displayPrice && (
                                    <span className="text-sm text-gray-400 line-through">
                                      {currency}{product.mrp.toLocaleString()}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-base text-gray-500">Price on enquiry</span>
                              )}
                            </div>
                            
                            {/* Reviews */}
                            <div className="flex items-center gap-2 mb-2">
                              {ratingValue > 0 ? (
                                <>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <span 
                                        key={i} 
                                        className={`text-sm ${i < Math.round(ratingValue) ? 'text-yellow-400' : 'text-gray-300'}`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                  <span className="text-xs sm:text-sm text-gray-600">
                                    {reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? 's' : ''}` : 'No reviews'}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} className="text-sm text-gray-300">★</span>
                                    ))}
                                  </div>
                                  <span className="text-xs sm:text-sm text-gray-500">No reviews</span>
                                </>
                              )}
                            </div>
                            
                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`inline-block w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-gray-400'}`} />
                              <span className={`text-xs sm:text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-gray-500'}`}>
                                {product.inStock ? 'In stock' : 'Sold out'}
                              </span>
                            </div>
                            
                            {/* Description */}
                            {product.description && product.description.trim() !== '' && (
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
                                {product.description}
                              </p>
                            )}
                          </div>
                          
                          {/* Right Column - Specifications */}
                          {product.specs && product.specs.length > 0 && (
                            <div className="sm:w-80 border-l border-gray-200 pl-4">
                              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Specifications
                              </h4>
                              <div className="space-y-1.5">
                                {product.specs.slice(0, 5).map((spec, idx) => (
                                  <div key={idx} className="flex justify-between text-xs">
                                    <span className="text-gray-600 font-medium">{spec.label || 'N/A'}:</span>
                                    <span className="text-gray-800 text-right ml-2 max-w-[150px] truncate">
                                      {spec.value || 'N/A'}
                                    </span>
                                  </div>
                                ))}
                                {product.specs.length > 5 && (
                                  <div className="text-xs text-[#7C2A47] font-medium pt-1">
                                    +{product.specs.length - 5} more...
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                <div className="text-xs sm:text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-[#7C2A47] text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
            </>
          ) : (
            <p className="text-center text-gray-600 text-sm sm:text-base">
              No products match the filters.
            </p>
          )}
            </main>
        </div>
      </div>

    </div>
  );
}

// Helper component for specs
function Spec({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-1">
      <span className="font-medium text-gray-800 text-xs sm:text-sm">{label}</span>
      <span className="text-gray-600 text-xs sm:text-sm">{value}</span>
    </div>
  );
}
