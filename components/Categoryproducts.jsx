'use client';

import React, { useState, useEffect } from "react";
import { fetchProducts } from "@/lib/actions/productActions";
import { useSelector } from "react-redux";
import { useCart } from "@/lib/hooks/useCart";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowRight, Send } from "lucide-react";
import ProductFilters from "./ProductFilters";
import Loading from "./Loading";
import { assets } from "@/assets/assets";

export default function CategoryProducts({ categoryName, subCategoryName }) {
  const { cartItems, addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [productsWithVariants, setProductsWithVariants] = useState([]); // Store original API data with variants
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
    sortBy: "default",
  });

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Transform API product to match component expectations
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

    // Get category name - handle multiple formats
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

    // Handle price - check if product has variants
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
          // Handle both array and object formats
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
    
    // First, try to extract from brandVariants
    if (apiProduct.brandVariants && Array.isArray(apiProduct.brandVariants)) {
      apiProduct.brandVariants.forEach(variant => {
        if (variant.attributes && Array.isArray(variant.attributes)) {
          variant.attributes.forEach(attr => {
            // Check if this attribute is related to HP/horsepower
            const attrName = attr.attributeName || attr.attributeId?.title || '';
            const attrValue = attr.attributeValue || attr.attributeValueId?.value || '';
            
            // Check if attribute name contains HP
            if (attrName && (attrName.toLowerCase().includes('hp') || attrName.toLowerCase().includes('horsepower'))) {
              // Format as "HP: {value}" if we have a value
              if (attrValue && attrValue.trim() !== '') {
                // If value already contains "HP", use it as is, otherwise format it
                if (attrValue.toLowerCase().includes('hp')) {
                  hpOptions.add(attrValue);
                } else {
                  hpOptions.add(`HP: ${attrValue}`);
                }
              } else if (attrName.toLowerCase() !== 'hp' && attrName.toLowerCase() !== 'horsepower') {
                // Only add the name if it's not just "hp" or "horsepower"
                hpOptions.add(attrName);
              }
            }
            // Also check if the value itself contains HP info
            else if (attrValue && (attrValue.toLowerCase().includes('hp') || attrValue.toLowerCase().includes('horsepower'))) {
              hpOptions.add(attrValue);
            }
            // Check if attributeId title contains HP (when populated)
            else if (attr.attributeId && typeof attr.attributeId === 'object' && attr.attributeId.title) {
              const attrIdTitle = attr.attributeId.title.toLowerCase();
              if (attrIdTitle.includes('hp') || attrIdTitle.includes('horsepower')) {
                const value = attrValue || attr.attributeValueId?.value || '';
                if (value) {
                  hpOptions.add(`HP: ${value}`);
                } else {
                  hpOptions.add(attr.attributeId.title);
                }
              }
            }
            // Also check attributeValueId when populated
            else if (attr.attributeValueId && typeof attr.attributeValueId === 'object') {
              const valueIdValue = attr.attributeValueId.value || '';
              const valueIdTitle = (attr.attributeValueId.title || '').toLowerCase();
              if (valueIdTitle.includes('hp') || valueIdTitle.includes('horsepower') || 
                  (valueIdValue && (valueIdValue.toLowerCase().includes('hp') || valueIdValue.toLowerCase().includes('horsepower')))) {
                if (valueIdValue) {
                  hpOptions.add(`HP: ${valueIdValue}`);
                }
              }
            }
          });
        }
        
        // Also check variant's SKU or other fields that might contain HP info
        if (variant.sku) {
          const skuHpMatch = variant.sku.match(/(\d+\.?\d*)\s*HP/i);
          if (skuHpMatch) {
            hpOptions.add(`HP: ${skuHpMatch[1]}`);
          }
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
              
              // Check Power or HP specifications
              if (label && (label.toLowerCase().includes('power') || label.toLowerCase().includes('hp'))) {
                // Extract HP values from strings like "0.5 HP, 1 HP, 1.5 HP, 2 HP"
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
    
    // Convert Set to sorted array
    if (hpOptions.size > 0) {
      options = Array.from(hpOptions).sort((a, b) => {
        // Sort HP options numerically
        const extractNum = (str) => {
          const match = str.match(/(\d+\.?\d*)/);
          return match ? parseFloat(match[1]) : 0;
        };
        return extractNum(a) - extractNum(b);
      });
    }

    // If no options from variants or specs, check if there's a default options field
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
        
        // Handle API response format
        let productsData = [];
        if (response && response.success && response.data) {
          productsData = response.data;
        } else if (Array.isArray(response)) {
          productsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          productsData = response.data;
        }

        // Transform all products
        const transformedProducts = productsData
          .map(transformProduct)
          .filter(product => product !== null);
        
        // Store original products with variants for price lookup
        setProductsWithVariants(productsData);
        
        // Debug: Log first product's options to help troubleshoot
        if (transformedProducts.length > 0 && process.env.NODE_ENV === 'development') {
          console.log('Sample transformed product options:', transformedProducts[0].options);
          console.log('Sample product hpToPriceMap:', transformedProducts[0].hpToPriceMap);
        }

        // Normalize category names for flexible matching
        const normalizeCategory = (cat) => {
          if (!cat) return '';
          return cat.trim().toLowerCase().replace(/\s+/g, ' ');
        };

        const normalizedCategoryName = normalizeCategory(categoryName);
        const normalizedSubCategoryName = normalizeCategory(subCategoryName);

        // Helper function to check if category matches
        const categoryMatches = (productCategory, searchCategory) => {
          if (!productCategory || !searchCategory) return false;
          const normalizedProductCat = normalizeCategory(productCategory);
          
          if (normalizedProductCat === searchCategory) return true;
          
          // Handle singular/plural variations
          const productSingular = normalizedProductCat.replace(/s$/, '');
          const searchSingular = searchCategory.replace(/s$/, '');
          if (productSingular === searchSingular && productSingular.length > 0) return true;
          
          // Partial match
          if (normalizedProductCat.includes(searchCategory) || searchCategory.includes(normalizedProductCat)) {
            return true;
          }
          
          return false;
        };

        // Filter by category and subcategory
        let filtered = [];
        if (normalizedCategoryName === "products") {
          filtered = transformedProducts;
        } else if (normalizedSubCategoryName) {
          filtered = transformedProducts.filter(
            (product) =>
              product?.subCategory 
              && categoryMatches(product.subCategory, normalizedSubCategoryName)
          );
        } else {
          filtered = transformedProducts.filter(
            (product) => categoryMatches(product.category, normalizedCategoryName)
          );
        }

        setProducts(filtered);
        
        // Initialize selected HP options - select first option for each product
        const initialHpSelections = {};
        filtered.forEach(product => {
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

  // Apply filters and sorting
  const [filteredProducts, setFilteredProducts] = useState([]);

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

    // Apply category filter (only if not filtering by URL category)
    if (categoryName === "products" && filters.selectedCategories.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        filters.selectedCategories.includes(p.category)
      );
    }

    // Apply pipe size filter
    if (filters.selectedPipeSizes.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.specs && p.specs.some(
          (spec) => spec.label === "Pipe size" && filters.selectedPipeSizes.includes(spec.value)
        )
      );
    }

    // Apply speed filter
    if (filters.selectedSpeeds.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.specs && p.specs.some(
          (spec) => spec.label === "Speed" && filters.selectedSpeeds.includes(spec.value)
        )
      );
    }

    // Apply head range filter
    if (filters.selectedHeadRanges.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.specs && p.specs.some(
          (spec) => spec.label === "Head range" && filters.selectedHeadRanges.includes(spec.value)
        )
      );
    }

    // Apply flow range filter
    if (filters.selectedFlowRanges.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.specs && p.specs.some(
          (spec) => spec.label === "Flow range" && filters.selectedFlowRanges.includes(spec.value)
        )
      );
    }

    // Apply HP filter
    if (filters.selectedHPs.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.options && p.options.length > 0 && p.options.some((opt) => filters.selectedHPs.includes(opt))
      );
    }

    // Apply inStock filter
    if (filters.inStockOnly) {
      updatedProducts = updatedProducts.filter((p) => p.inStock);
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

  return (
    <div className="max-w-7xl mx-auto py-4 px-3 sm:px-6">
      {/* ✅ Breadcrumbs */}
      <div className="text-gray-600 text-md sm:text-lg mt-8 mb-5 sm:ml-10 space-x-1">
        <Link
          href="/"
          className="hover:text-black transition-colors duration-200"
        >
          Home
        </Link>
        <span>&gt;</span>
        <Link
          href={`/category/products`}
          className="hover:text-black transition-colors duration-200"
        >
          Products
        </Link>
        <span>&gt;</span>
        {subCategoryName ? (
          <>
            <Link
              href={`/category/${categoryName}`}
              className="hover:text-black transition-colors duration-200"
            >
              {categoryName}
            </Link>
            <span>&gt;</span>
            <span className="text-[rgb(55,50,46)] font-medium">
              {subCategoryName}
            </span>
          </>
        ) : (
          <span className="text-[rgb(55,50,46)] font-medium">
            {categoryName === "products" ? "All Products" : categoryName}
          </span>
        )}
      </div>

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
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-10 mt-6 sm:mt-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Image Section */}
                <div className="flex justify-center">
                  <Link href={`/product/${product.id}`} className="w-[300px] h-[400px] sm:w-[330px] sm:h-[440px] relative">
                    <div className="p-4 rounded-xl w-full h-full flex justify-center items-center bg-gray-50 border border-gray-200">
                      {product.images && product.images.length > 0 && product.images[0] ? (
                        <img
                          src={product.images[0]?.src || product.images[0]}
                          alt={product.name || 'Product image'}
                          className="rounded-xl w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.target.onerror = null;
                            e.target.src = assets.product_img0 || '/placeholder-image.png';
                          }}
                        />
                      ) : (
                        // Show placeholder image when no image is available
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src={assets.product_img0 || '/placeholder-image.png'}
                            alt="Placeholder"
                            className="w-3/4 h-3/4 object-contain opacity-50"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Content Section */}
                <div className="md:col-span-2 space-y-4 sm:space-y-5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center md:text-left">
                    <Link href={`/product/${product.id}`} className="w-full h-full hover:text-[#c31e5a] transition-colors">
                      {product.name || 'Untitled Product'}
                    </Link>
                  </h1>
                  
                  {/* Price Display */}
                  <div className="flex flex-wrap items-center gap-3 text-center md:text-left">
                    {(() => {
                      const displayPrice = getDisplayPrice(product);
                      return displayPrice !== undefined && displayPrice !== null ? (
                        <>
                          <span className="text-2xl sm:text-3xl font-bold text-[#c31e5a]">
                            {currency}{displayPrice.toLocaleString()}
                          </span>
                          {product.mrp && product.mrp > displayPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              {currency}{product.mrp.toLocaleString()}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xl text-gray-500">Price on enquiry</span>
                      );
                    })()}
                  </div>

                  {/* Description */}
                  {product.description && product.description.trim() !== '' ? (
                    <p className="text-gray-600 text-center md:text-left line-clamp-3">
                      {product.description}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic text-center md:text-left">
                      No description available
                    </p>
                  )}

                  {/* Options */}
                  <div>
                    <h2 className="font-semibold text-gray-800 mb-2 text-center md:text-left">
                      Available Options:
                    </h2>
                    {product.options && product.options.length > 0 ? (
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {product.options.map((opt, i) => {
                          const isSelected = selectedHpOptions[product.id] === opt;
                          return (
                            <button
                              key={i}
                              onClick={() => handleHpOptionSelect(product.id, opt)}
                              className={`px-4 py-2 border rounded-lg transition text-sm sm:text-base ${
                                isSelected
                                  ? 'bg-[#c31e5aff] text-white border-[#c31e5aff]'
                                  : 'border-gray-300 hover:bg-[#c31e5aff] hover:text-white hover:border-[#c31e5aff]'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No options available</p>
                    )}
                  </div>

                  {/* Technical Specifications */}
                  <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
                    <h2 className="font-semibold text-gray-800 mb-3 text-center md:text-left">
                      Technical Specifications:
                    </h2>
                    {product.specs && product.specs.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-700">
                        {product.specs.map((item, i) => (
                          <Spec key={i} label={item.label || 'N/A'} value={item.value || 'N/A'} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No specifications available</p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6 justify-between md:justify-start items-center">
                    {/* 🛒 Add to Cart */}
                    <div className="relative group">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3 bg-[#c31e5a] text-white rounded-lg hover:bg-[#a81a4d] transition-all"
                      >
                        <ShoppingCart size={18} />
                        <span className="hidden md:inline">Add to Cart</span>
                      </button>
                      
                    </div>

                    {/* ✉️ Send Enquiry */}
                    <div className="relative group">
                      <button
                        onClick={(e) => handleEnquiry(e, product)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#f48638] text-white rounded-lg hover:bg-[#e47424] transition-all"
                      >
                        <Send size={18} />
                        <span className="md:inline">Send Enquiry</span>
                      </button>
                      
                    </div>

                    {/* 🔍 View Details */}
                    <div className="relative group">
                      <button
                        onClick={() => window.location.href = `/product/${product.id}`}
                        className="flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3 bg-[rgb(55,50,46)] text-white border border-gray-300 rounded-lg hover:bg-[rgb(40,36,33)] transition-all"
                      >
                        <ArrowRight size={18} />
                        <span className="hidden md:inline">View Details</span>
                      </button>
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="text-center text-gray-600 py-10">
          No products found for this {subCategoryName ? "subcategory" : "category"}.
        </div>
      )}

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

