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

export default function CategoryProductsFilter({ categoryName }) {
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

        // Filter by category if needed
        const normalizedCategoryName = categoryName?.trim().toLowerCase() || "";
        let filtered = transformedProducts;
        
        if (normalizedCategoryName !== "products") {
          const normalizeCategory = (cat) => {
            if (!cat) return '';
            return cat.trim().toLowerCase().replace(/\s+/g, ' ');
          };

          const categoryMatches = (productCategory, searchCategory) => {
            if (!productCategory || !searchCategory) return false;
            const normalizedProductCat = normalizeCategory(productCategory);
            if (normalizedProductCat === searchCategory) return true;
            const productSingular = normalizedProductCat.replace(/s$/, '');
            const searchSingular = searchCategory.replace(/s$/, '');
            if (productSingular === searchSingular && productSingular.length > 0) return true;
            if (normalizedProductCat.includes(searchCategory) || searchCategory.includes(normalizedProductCat)) {
              return true;
            }
            return false;
          };

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
  }, [categoryName]);

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

    // Apply category filter (OR logic - match ANY selected category)
    if (categoryName === "products" && filters.selectedCategories.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        // Match if product category matches ANY selected category
        filters.selectedCategories.some(selectedCat => {
          const productCat = (p.category || '').toLowerCase().trim();
          const selectedCatLower = selectedCat.toLowerCase().trim();
          return productCat === selectedCatLower || 
                 productCat.includes(selectedCatLower) || 
                 selectedCatLower.includes(productCat);
        })
      );
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

  return (
    <div className="max-w-8xl mx-auto py-4 px-3 sm:px-6">
      {/* ✅ Breadcrumbs */}
      <div className="text-gray-600 text-sm sm:text-base mt-4 mb-4 sm:mb-5 sm:ml-4 space-x-1">
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
        <span className="text-[rgb(55,50,46)] font-medium">
          {categoryName === "products" ? "All Products" : categoryName}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Filters Sidebar */}
        <div className="md:col-span-1">
          <ProductFilters products={products} onFilterChange={setFilters} />
        </div>

        {/* Products List */}
        <div className="md:col-span-3">
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
            <div className="space-y-4">
              {filteredProducts.map((product, index) => {
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
                
                return (
                  <Link 
                    href={`/product/${product.id}`}
                    key={index}
                    className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Image - Left Side */}
                      <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40">
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
                              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                              <span className="text-xs sm:text-sm font-medium text-green-600">
                                In stock
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
