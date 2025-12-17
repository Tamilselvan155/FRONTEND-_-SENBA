'use client';

import React, { useState, useEffect } from "react";
import { fetchProducts } from "@/lib/actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Send } from "lucide-react";
import ModalPopup from "./PopupModel";
import ProductFilters from "./ProductFilters";
import Loading from "./Loading";
import { assets } from "@/assets/assets";

export default function CategoryProductsFilter({ categoryName, subCategoryName }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Auto-select category from URL query params after products are loaded
  useEffect(() => {
    if (categoryName && categoryName !== "products" && products.length > 0 && filters.selectedCategories.length === 0) {
      // Normalize category name for matching
      const normalizeCategory = (cat) => {
        if (!cat) return '';
        return cat.trim().toLowerCase().replace(/\s+/g, ' ');
      };
      
      const normalizedCategoryName = normalizeCategory(categoryName);
      
      // Find matching category from available categories
      const allCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
      const matchingCategory = allCategories.find(cat => {
        const normalizedCat = normalizeCategory(cat);
        return normalizedCat === normalizedCategoryName ||
               normalizedCat.includes(normalizedCategoryName) ||
               normalizedCategoryName.includes(normalizedCat);
      });
      
      if (matchingCategory) {
        setFilters(prev => ({
          ...prev,
          selectedCategories: [matchingCategory]
        }));
      }
    }
  }, [categoryName, products]);

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
      // Normalize category name for matching
      const normalizeCategory = (cat) => {
        if (!cat) return '';
        return cat.trim().toLowerCase().replace(/\s+/g, ' ');
      };
      
      const normalizedCategoryName = normalizeCategory(categoryName);
      
      // Find matching category from available categories
      const allCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
      const matchingCategory = allCategories.find(cat => {
        const normalizedCat = normalizeCategory(cat);
        return normalizedCat === normalizedCategoryName ||
               normalizedCat.includes(normalizedCategoryName) ||
               normalizedCategoryName.includes(normalizedCat);
      });
      
      if (matchingCategory) {
        setFilters(prev => ({
          ...prev,
          selectedCategories: [matchingCategory]
        }));
      }
    }
  }, [categoryName, products]);

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

    // Helper function to normalize category/subcategory names
    const normalizeCategory = (cat) => {
      if (!cat) return '';
      return cat.trim().toLowerCase().replace(/\s+/g, ' ');
    };

    // Apply subcategory filter first (if subcategory is provided from query params)
    if (subCategoryName) {
      const normalizedSubCategoryName = normalizeCategory(subCategoryName);
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
          return productCat === selectedCatLower || 
                 productCat.includes(selectedCatLower) || 
                 selectedCatLower.includes(productCat);
        })
      );
    } else if (categoryName && categoryName !== "products" && !subCategoryName) {
      // If no categories selected but categoryName provided (and no subcategory), filter by it
      const normalizedCategoryName = normalizeCategory(categoryName);
      
      updatedProducts = updatedProducts.filter((p) => {
        const productCat = normalizeCategory(p.category || '');
        return productCat === normalizedCategoryName ||
               productCat.includes(normalizedCategoryName) ||
               normalizedCategoryName.includes(productCat);
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
  const handleAddToCart = (product) => {
    dispatch(addToCart({ productId: product.id }));
    toast.success(`${product.name} added to cart!`);
  };

  function handleEnquiry(e, product) {
    e.preventDefault();
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  const handleSendWhatsApp = ({ userName, userMobile }) => {
    if (!selectedProduct) return;

    const quantity = 1;
    const productLink = typeof window !== 'undefined' ? window.location.href : '';

    let message = `
Hi, I'm interested in booking an enquiry for the following product:
🛍️ *Product:* ${selectedProduct.name}
💰 *Price:* ${currency}${selectedProduct.price}
📦 *Quantity:* ${quantity}
🖼️ *Product Link:* ${productLink}
`;

    if (userName && userMobile) {
      message += `🙋 *Name:* ${userName}\n📱 *Mobile:* ${userMobile}\n`;
    }

    message += `Please let me know the next steps.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "9345795629";

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    setIsModalOpen(false);
  };

  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [itemsPerPage, setItemsPerPage] = useState(24);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      {/* ✅ Breadcrumbs */}
        <div className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 space-x-1">
        <Link
          href="/"
            className="hover:text-[#7C2A47] transition-colors duration-200"
        >
          Home
        </Link>
        <span>&gt;</span>
        <Link
          href={`/category/products`}
            className="hover:text-[#7C2A47] transition-colors duration-200"
        >
          Products
        </Link>
        <span>&gt;</span>
          <span className="text-gray-900 font-medium">
          {subCategoryName 
            ? subCategoryName 
            : categoryName === "products" || !categoryName 
              ? "All Products" 
              : categoryName}
        </span>
      </div>

        <div className="relative flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
          {/* Filters Sidebar - Fixed on desktop */}
          <aside className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-20">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <ProductFilters products={products} onFilterChange={setFilters} />
        </div>
            </div>
          </aside>

          {/* Products List - Scrollable area */}
          <main className="flex-1 min-w-0">
            {/* Header Section - Aligned above product list */}
            <div className="mb-4 sm:mb-6 bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                {subCategoryName 
                  ? subCategoryName 
                  : categoryName === "products" || !categoryName 
                    ? "All Products" 
                    : categoryName}
              </h1>
              
              {/* Product Count and Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                {/* Product Count */}
                <p className="text-xs sm:text-sm text-gray-600">
                  {loading ? (
                    "Loading products..."
                  ) : filteredProducts.length > 0 ? (
                    `Showing 1 - ${Math.min(itemsPerPage, filteredProducts.length)} of ${filteredProducts.length} products`
                  ) : (
                    "No products found"
                  )}
                </p>

                {/* Display Options */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {/* Items Per Page */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Display:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="px-2 sm:px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] transition-all cursor-pointer"
                    >
                      <option value={12}>12 per page</option>
                      <option value={24}>24 per page</option>
                      <option value={48}>48 per page</option>
                      <option value={96}>96 per page</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                      className="px-2 sm:px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] transition-all cursor-pointer"
                    >
                      <option value="default">Best selling</option>
                      <option value="priceLowToHigh">Price: Low to High</option>
                      <option value="priceHighToLow">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">View:</span>
                    <div className="flex items-center gap-0.5 border border-gray-300 rounded-lg p-0.5 bg-white">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 sm:p-2 rounded transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-[#7C2A47] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label="Grid view"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 sm:p-2 rounded transition-colors ${
                          viewMode === 'list'
                            ? 'bg-[#7C2A47] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label="List view"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
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
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5' : 'space-y-4 sm:space-y-5'}>
              {filteredProducts.slice(0, itemsPerPage).map((product, index) => {
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
                      className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group"
                    >
                      {/* Product Image */}
                      <div className="relative w-full aspect-square bg-white p-3 sm:p-4 flex items-center justify-center">
                        {product.images && product.images.length > 0 && product.images[0] ? (
                          <img
                            src={product.images[0]?.src || product.images[0]}
                            alt={product.name || 'Product image'}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
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
                      <div className="p-3 sm:p-4">
                        {/* Brand */}
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                          {brand}
                        </div>
                        
                        {/* Product Name */}
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-[#7C2A47] transition-colors">
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
                                <span className="text-xs text-gray-400 line-through">
                                  {currency}{product.mrp.toLocaleString()}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Price on enquiry</span>
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
                                    className={`text-xs ${i < Math.round(ratingValue) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">
                                {reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? 's' : ''}` : 'No reviews'}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className="text-xs text-gray-300">★</span>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">No reviews</span>
                            </>
                          )}
                        </div>
                        
                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-gray-500'}`}>
                            {product.inStock ? 'In stock' : 'Sold out'}
                          </span>
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
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#7C2A47] transition-colors">
                              {product.name || 'Untitled Product'}
                            </h3>
                            
                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-2">
                              {displayPrice !== undefined && displayPrice !== null ? (
                                <>
                                  <span className="text-lg sm:text-xl font-bold text-[#7C2A47]">
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
          ) : (
            <p className="text-center text-gray-600 text-sm sm:text-base">
              No products match the filters.
            </p>
          )}
            </main>
        </div>
      </div>

      {/* WhatsApp Modal */}
      {selectedProduct && (
        <ModalPopup
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          items={[
            {
              name: selectedProduct.name,
              price: selectedProduct.price,
              quantity: 1,
            },
          ]}
          totalPrice={selectedProduct.price}
          totalQuantity={1}
          currency={currency}
          onSendWhatsApp={handleSendWhatsApp}
        />
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
