'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductByIdAsync } from "@/lib/features/product/productSlice"
import { ArrowLeft, Edit, Trash2, ChevronDown } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils/imageUtils"
import ConfirmModal from "@/components/common/ConfirmModal"
import CustomSelect from "@/components/common/CustomSelect"
import { deleteProductAsync, fetchProductsAsync } from "@/lib/features/product/productSlice"
import toast from "react-hot-toast"

export default function ViewProductPage() {
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()
    const { currentProduct, loading } = useSelector((state) => state.product)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedAttributeCombinations, setSelectedAttributeCombinations] = useState({}) // { variantIndex: { attrName: value } }

    useEffect(() => {
        if (params.id) {
            dispatch(fetchProductByIdAsync(params.id))
        }
    }, [dispatch, params.id])

    // Reset selected attribute combinations when product changes
    useEffect(() => {
        if (currentProduct) {
            setSelectedAttributeCombinations({})
        }
    }, [currentProduct])


    const handleEdit = () => {
        router.push(`/admin/products/edit/${params.id}`)
    }

    const handleDelete = () => {
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        try {
            await dispatch(deleteProductAsync(params.id)).unwrap()
            toast.success('Product deleted successfully!')
            dispatch(fetchProductsAsync())
            router.push('/admin/products')
        } catch (err) {
            toast.error(err || 'Failed to delete product')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-gray-600">Loading...</div>
                </div>
            </div>
        )
    }

    if (!currentProduct) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-gray-600 mb-4">Product not found</div>
                    <button
                        onClick={() => router.push('/admin/products')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        )
    }

    let product = currentProduct
    if (currentProduct.data) {
        product = currentProduct.data
    } else if (currentProduct.success && currentProduct.data) {
        product = currentProduct.data
    }

    const productId = product._id || product.id || params.id

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Content */}
            <div className="w-full p-6 space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h2>
                    <div className="flex flex-wrap items-start gap-x-8 gap-y-4 w-full">
                        <div className="flex-1 min-w-[120px]">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Title</label>
                            <p className="text-sm font-medium text-gray-900">{product.title}</p>
                        </div>
                        <div className="flex-1 min-w-[120px]">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</label>
                            <p className="text-sm text-gray-900">
                                {(() => {
                                    let parentCategoryName = '';
                                    
                                    // Check if categoryId has a parent (meaning categoryId is a subcategory)
                                    if (product.categoryId) {
                                        if (product.categoryId.parentId && typeof product.categoryId.parentId === 'object' && product.categoryId.parentId.title) {
                                            // categoryId is a subcategory, so parentId is the parent
                                            parentCategoryName = product.categoryId.parentId.title;
                                        } else if (product.categoryId.isParent || !product.categoryId.parentId) {
                                            // categoryId is a parent category
                                            parentCategoryName = product.categoryId.title || '';
                                        }
                                    }
                                    
                                    // Fallback: check category field
                                    if (!parentCategoryName && product.category?.title) {
                                        parentCategoryName = product.category.title;
                                    }
                                    
                                    return parentCategoryName || product.categoryId?.title || 'N/A';
                                })()}
                            </p>
                        </div>
                        <div className="flex-1 min-w-[120px]">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sub Category</label>
                            <p className="text-sm text-gray-900">
                                {(() => {
                                    let subcategoryName = '';
                                    
                                    // Check if categoryId is a subcategory (has a parent)
                                    if (product.categoryId) {
                                        if (product.categoryId.parentId && typeof product.categoryId.parentId === 'object' && product.categoryId.parentId.title) {
                                            // categoryId is the subcategory
                                            subcategoryName = product.categoryId.title || '';
                                        }
                                    }
                                    
                                    // Check subcategory field
                                    if (!subcategoryName && product.subcategory?.title) {
                                        subcategoryName = product.subcategory.title;
                                    }
                                    
                                    return subcategoryName || 'N/A';
                                })()}
                            </p>
                        </div>
                        <div className="flex-1 min-w-[100px]">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</label>
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                product.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {product.status}
                            </span>
                        </div>
                        <div className="flex-1 min-w-[100px]">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Featured</label>
                            <p className="text-sm text-gray-900">{product.isFeatured ? 'Yes' : 'No'}</p>
                        </div>
                        {!product.hasVariants && (
                            <>
                                <div className="flex-1 min-w-[100px]">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Price</label>
                                    <p className="text-sm font-semibold text-gray-900">₹{product.price || 0}</p>
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Discount</label>
                                    <p className="text-sm text-gray-900">{product.discount || 0}%</p>
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stock</label>
                                    <p className="text-sm text-gray-900">{product.stock || 0}</p>
                                </div>
                                <div className="flex-1 min-w-[120px]">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">SKU</label>
                                    <p className="text-sm font-mono text-gray-900">{product.sku || 'N/A'}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Images */}
                {product.images && product.images.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Product Images</h2>
                        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {product.images.map((image, index) => {
                                const imageUrl = getImageUrl(image)
                                return (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors shadow-sm">
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={`${product.title} - Image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                <span className="text-xs text-gray-400">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Specification Groups */}
                {product.specificationGroups && product.specificationGroups.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {product.specificationGroups.map((group, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300 uppercase tracking-wide">
                                        {group.groupLabel || `Specification Group ${index + 1}`}
                                    </h3>
                                    {group.specifications && typeof group.specifications === 'object' && !Array.isArray(group.specifications) ? (
                                        <div className="space-y-3">
                                            {Object.entries(group.specifications).map(([key, value]) => (
                                                <div key={key} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{key}</div>
                                                    <div className="text-sm text-gray-900">{String(value)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">No specifications available</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Brand Variants */}
                {product.hasVariants && product.brandVariants && product.brandVariants.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">Brand Variants</h2>
                        </div>

                        {/* Display Single Variant Based on Selected Attributes */}
                        {(() => {
                            // Get all unique attribute names from all variants (case-insensitive to avoid duplicates)
                            const attributeNameMap = new Map(); // key: normalized (lowercase), value: original name
                            product.brandVariants.forEach(v => {
                                if (v.attributes && Array.isArray(v.attributes)) {
                                    v.attributes.forEach(attr => {
                                        const name = attr.attributeId?.title || attr.attributeName || '';
                                        if (name && name !== 'N/A') {
                                            const normalizedName = name.trim().toLowerCase();
                                            // Store the first occurrence (or prefer the one with proper casing)
                                            if (!attributeNameMap.has(normalizedName)) {
                                                attributeNameMap.set(normalizedName, name.trim());
                                            }
                                        }
                                    });
                                }
                            });
                            // Sort attributes to put HP first, then KW, then others
                            const attributeNamesArray = Array.from(attributeNameMap.values());
                            const attributeNames = attributeNamesArray.sort((a, b) => {
                                const aNorm = a.trim().toLowerCase();
                                const bNorm = b.trim().toLowerCase();
                                if (aNorm === 'hp') return -1;
                                if (bNorm === 'hp') return 1;
                                if (aNorm === 'kw') return -1;
                                if (bNorm === 'kw') return 1;
                                return a.localeCompare(b);
                            });

                            // Get selected attributes (using a single key for all)
                            const variantKey = 'selected';
                            let selectedAttributes = selectedAttributeCombinations[variantKey] || {};

                            // Initialize with first variant's default values if not set
                            if (product.brandVariants.length > 0 && Object.keys(selectedAttributes).length === 0) {
                                const firstVariant = product.brandVariants[0];
                                if (firstVariant.attributes && Array.isArray(firstVariant.attributes)) {
                                    const initialAttributes = {};
                                    firstVariant.attributes.forEach(attr => {
                                        const attrName = attr.attributeId?.title || attr.attributeName || 'N/A';
                                        if (attrName && attrName !== 'N/A') {
                                            // Find the normalized attribute name from our map
                                            const normalizedName = attrName.trim().toLowerCase();
                                            const mappedAttrName = attributeNameMap.get(normalizedName);
                                            if (mappedAttrName) {
                                                const defaultVal = attr.attributeValueId?.value || attr.attributeValue || '';
                                                if (defaultVal) {
                                                    initialAttributes[mappedAttrName] = defaultVal;
                                                }
                                            }
                                        }
                                    });
                                    if (Object.keys(initialAttributes).length > 0) {
                                        setSelectedAttributeCombinations(prev => ({
                                            ...prev,
                                            [variantKey]: initialAttributes
                                        }));
                                        selectedAttributes = initialAttributes;
                                    }
                                }
                            }

                            // Process specifications helper
                            const processSpecs = (specs) => {
                                if (Array.isArray(specs) && specs.length > 0) {
                                    return specs;
                                } else if (typeof specs === 'object' && !Array.isArray(specs)) {
                                    return [specs];
                                }
                                return [];
                            };

                            // Collect all attribute values from all brand variants for this product
                            const getAllAttributeValues = (attrName) => {
                                const values = new Set();
                                const normalizedAttrName = attrName.trim().toLowerCase();
                                product.brandVariants.forEach(v => {
                                    if (v.attributes && Array.isArray(v.attributes)) {
                                        v.attributes.forEach(attr => {
                                            const name = attr.attributeId?.title || attr.attributeName || '';
                                            const normalizedName = name.trim().toLowerCase();
                                            // Match case-insensitively
                                            if (normalizedName === normalizedAttrName) {
                                                const value = attr.attributeValueId?.value || attr.attributeValue || '';
                                                if (value) {
                                                    values.add(value);
                                                }
                                            }
                                        });
                                    }
                                });
                                return Array.from(values).filter(v => v).sort();
                            };
                            
                            // Convert KW to HP (1 HP = 0.746 KW, so HP = KW / 0.746)
                            const convertKWtoHP = (kwValue) => {
                                const kw = parseFloat(kwValue);
                                if (isNaN(kw)) return null;
                                const hp = kw / 0.746;
                                return Math.round(hp * 10) / 10; // Round to 1 decimal place
                            };

                            // Find closest HP value from available options
                            const findClosestHP = (targetHP, availableHPValues) => {
                                if (!availableHPValues || availableHPValues.length === 0) return null;
                                
                                // Extract numeric values from HP strings (e.g., "0.5", "1", "1.5", "2")
                                const numericValues = availableHPValues.map(val => {
                                    const num = parseFloat(String(val).replace(/[^\d.]/g, ''));
                                    return isNaN(num) ? null : { original: val, numeric: num };
                                }).filter(v => v !== null);

                                if (numericValues.length === 0) return null;

                                // Find the closest match
                                let closest = numericValues[0];
                                let minDiff = Math.abs(closest.numeric - targetHP);

                                numericValues.forEach(item => {
                                    const diff = Math.abs(item.numeric - targetHP);
                                    if (diff < minDiff) {
                                        minDiff = diff;
                                        closest = item;
                                    }
                                });

                                return closest.original;
                            };
                            
                            // Find matching variant based on selected attributes
                            const findMatchingVariant = (selectedAttrs) => {
                                // Check if all attributes are selected
                                const allSelected = attributeNames.length > 0 && 
                                    attributeNames.every(attrName => selectedAttrs[attrName] && selectedAttrs[attrName] !== '');
                                
                                if (!allSelected) {
                                    // If not all selected, return first variant
                                    return product.brandVariants[0] || null;
                                }
                                
                                // Find variant that matches all selected attribute values
                                const matchingVariant = product.brandVariants.find(v => {
                                    if (!v.attributes || !Array.isArray(v.attributes)) return false;
                                    
                                    // Check if all selected attributes match this variant's attributes
                                    const allMatch = attributeNames.every(attrName => {
                                        const selectedValue = selectedAttrs[attrName];
                                        if (!selectedValue) return false;
                                        
                                        const normalizedAttrName = attrName.trim().toLowerCase();
                                        
                                        // Find matching attribute in variant (case-insensitive)
                                        const matchingAttr = v.attributes.find(attr => {
                                            const name = attr.attributeId?.title || attr.attributeName || '';
                                            const normalizedName = name.trim().toLowerCase();
                                            return normalizedName === normalizedAttrName;
                                        });
                                        
                                        if (!matchingAttr) return false;
                                        
                                        // Check if value matches (case-insensitive)
                                        const attrValue = String(matchingAttr.attributeValueId?.value || matchingAttr.attributeValue || '').trim();
                                        const selectedVal = String(selectedValue).trim();
                                        return attrValue.toLowerCase() === selectedVal.toLowerCase();
                                    });
                                    
                                    return allMatch;
                                });
                                
                                // Return matching variant if found, otherwise return first variant
                                return matchingVariant || product.brandVariants[0] || null;
                            };
                            
                            // Get the variant to display based on selected attributes
                            const displayVariant = findMatchingVariant(selectedAttributes);
                            
                            if (!displayVariant) return null;
                            
                            // Process specifications for the display variant
                            const displaySpecs = processSpecs(displayVariant.specifications);
                            
                            // Find Head and Discharge specs from the display variant
                            const headDischargeSpec = displaySpecs.find(spec => {
                                if (typeof spec !== 'object' || Array.isArray(spec)) return false;
                                const headSpec = Object.entries(spec).find(([key]) => key.toLowerCase().includes('head'));
                                const dischargeSpec = Object.entries(spec).find(([key]) => key.toLowerCase().includes('discharge'));
                                return headSpec && dischargeSpec;
                            });

                            let headKey = null;
                            let dischargeKey = null;
                            let headValues = [];
                            let headUnit = '';
                            let dischargeValues = [];
                            let dischargeUnit = '';

                            if (headDischargeSpec) {
                                const spec = headDischargeSpec;
                                const headSpec = Object.entries(spec).find(([key]) => key.toLowerCase().includes('head'));
                                const dischargeSpec = Object.entries(spec).find(([key]) => key.toLowerCase().includes('discharge'));

                                if (headSpec && dischargeSpec) {
                                    headKey = headSpec[0];
                                    dischargeKey = dischargeSpec[0];
                                    const headValue = headSpec[1];
                                    const dischargeValue = dischargeSpec[1];

                                    if (typeof headValue === 'object' && headValue.values && Array.isArray(headValue.values)) {
                                        headValues = headValue.values;
                                        headUnit = headValue.unit || '';
                                    } else {
                                        const str = String(headValue).trim();
                                        const parts = str.split(/\s+/);
                                        headValues = parts.length > 1 ? parts.slice(0, -1) : [str];
                                        headUnit = parts.length > 1 ? parts[parts.length - 1] : '';
                                    }

                                    if (typeof dischargeValue === 'object' && dischargeValue.values && Array.isArray(dischargeValue.values)) {
                                        dischargeValues = dischargeValue.values;
                                        dischargeUnit = dischargeValue.unit || '';
                                    } else {
                                        const str = String(dischargeValue).trim();
                                        const parts = str.split(/\s+/);
                                        dischargeValues = parts.length > 1 ? parts.slice(0, -1) : [str];
                                        dischargeUnit = parts.length > 1 ? parts[parts.length - 1] : '';
                                    }

                                    if (!headUnit || headUnit === '') {
                                        if (headKey.toLowerCase().includes('head')) {
                                            headUnit = 'meters';
                                        }
                                    }
                                    if (!dischargeUnit || dischargeUnit === '') {
                                        if (dischargeKey.toLowerCase().includes('discharge')) {
                                            dischargeUnit = 'LPM';
                                        }
                                    }
                                }
                            }

                            const maxLength = Math.max(headValues.length, dischargeValues.length);

                            return (
                                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                    {/* Variant Header */}
                                    <div className="mb-4 pb-3 border-b border-gray-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-base font-bold text-gray-900">
                                                Product Details
                                        </h3>
                                            <span className="text-base font-semibold text-gray-700">
                                                {displayVariant.brandId?.title || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {displayVariant.price !== undefined && displayVariant.price !== null && (
                                                <div>
                                                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Price</div>
                                                    <div className="text-base font-bold text-gray-900">₹{displayVariant.price.toLocaleString() || 0}</div>
                                                </div>
                                            )}
                                            {displayVariant.discount !== undefined && displayVariant.discount !== null && (
                                                <div>
                                                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Discount</div>
                                                    <div className="text-base font-semibold text-blue-600">{displayVariant.discount || 0}%</div>
                                                </div>
                                            )}
                                            {displayVariant.stock !== undefined && displayVariant.stock !== null && (
                                                <div>
                                                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Stock</div>
                                                    <div className="text-base font-semibold text-gray-900">{displayVariant.stock || 0}</div>
                                                </div>
                                            )}
                                            {displayVariant.sku && (
                                                <div>
                                                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">SKU</div>
                                                    <div className="text-sm font-mono text-gray-900">{displayVariant.sku}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Attributes as Dropdowns */}
                                    {attributeNames.length > 0 && (
                                        <div className="mb-4 pb-4 border-b border-gray-200">
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Attributes</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {attributeNames.map((attrName, attrIndex) => {
                                                    // Get all available values for this attribute from all brand variants
                                                    const allAvailableValues = getAllAttributeValues(attrName);
                                                    
                                                    // Get default value from first variant that has this attribute
                                                    let defaultAttrValue = '';
                                                    const normalizedAttrName = attrName.trim().toLowerCase();
                                                    for (const v of product.brandVariants) {
                                                        if (v.attributes && Array.isArray(v.attributes)) {
                                                            const attr = v.attributes.find(a => {
                                                                const name = a.attributeId?.title || a.attributeName || '';
                                                                const normalizedName = name.trim().toLowerCase();
                                                                return normalizedName === normalizedAttrName;
                                                            });
                                                            if (attr) {
                                                                defaultAttrValue = attr.attributeValueId?.value || attr.attributeValue || '';
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    
                                                    // If no values found from other variants, use the default value
                                                    let finalAvailableValues = allAvailableValues.length > 0 
                                                        ? allAvailableValues 
                                                        : (defaultAttrValue ? [defaultAttrValue] : []);
                                                    
                                                    // Set current value: use selected value, or default value
                                                    const currentValue = selectedAttributes[attrName] !== undefined 
                                                        ? selectedAttributes[attrName] 
                                                        : (defaultAttrValue || (finalAvailableValues.length > 0 ? finalAvailableValues[0] : ''));
                                                    
                                                    // Check if this is KW attribute
                                                    const isKW = normalizedAttrName === 'kw';
                                                    // Check if this is HP attribute
                                                    const isHP = normalizedAttrName === 'hp';
                                                    
                                                    return (
                                                        <div key={attrIndex || `attr-${attrName}-${attrIndex}`}>
                                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                                                {attrName}
                                                            </label>
                                                            {isKW ? (
                                                                // KW field: Read-only text display
                                                                <div className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-gray-50 text-gray-900">
                                                                    {currentValue || 'N/A'}
                                                                </div>
                                                            ) : (
                                                                // Other fields: CustomSelect dropdown
                                                                <CustomSelect
                                                                    name={attrName}
                                                                    value={currentValue || ''}
                                                                    onChange={(e) => {
                                                                        const newValue = e.target.value;
                                                                        setSelectedAttributeCombinations(prev => {
                                                                            const currentVariantAttrs = prev[variantKey] || {};
                                                                            const updated = {
                                                                                ...prev,
                                                                                [variantKey]: {
                                                                                    ...currentVariantAttrs,
                                                                                    [attrName]: newValue
                                                                                }
                                                                            };
                                                                            
                                                                            // If HP is changed, automatically set KW and PIPE SIZE from matching variant
                                                                            if (isHP && newValue) {
                                                                                // Find variant that has this HP value
                                                                                const matchingVariant = product.brandVariants.find(v => {
                                                                                    if (!v.attributes || !Array.isArray(v.attributes)) return false;
                                                                                    const hpAttr = v.attributes.find(attr => {
                                                                                        const name = attr.attributeId?.title || attr.attributeName || '';
                                                                                        const normalizedName = name.trim().toLowerCase();
                                                                                        return normalizedName === 'hp';
                                                                                    });
                                                                                    if (!hpAttr) return false;
                                                                                    const hpValue = String(hpAttr.attributeValueId?.value || hpAttr.attributeValue || '').trim();
                                                                                    return hpValue.toLowerCase() === String(newValue).trim().toLowerCase();
                                                                                });
                                                                                
                                                                                if (matchingVariant && matchingVariant.attributes) {
                                                                                    // Extract KW and PIPE SIZE from the matching variant
                                                                                    matchingVariant.attributes.forEach(attr => {
                                                                                        const name = attr.attributeId?.title || attr.attributeName || '';
                                                                                        const normalizedName = name.trim().toLowerCase();
                                                                                        const value = attr.attributeValueId?.value || attr.attributeValue || '';
                                                                                        
                                                                                        if (normalizedName === 'kw') {
                                                                                            // Find KW attribute name
                                                                                            const kwAttrName = attributeNames.find(attrName => {
                                                                                                const normalized = attrName.trim().toLowerCase();
                                                                                                return normalized === 'kw';
                                                                                            });
                                                                                            if (kwAttrName && value) {
                                                                                                updated[variantKey][kwAttrName] = value;
                                                                                            }
                                                                                        } else if (normalizedName === 'pipe size' || normalizedName === 'pipesize') {
                                                                                            // Find PIPE SIZE attribute name
                                                                                            const pipeSizeAttrName = attributeNames.find(attrName => {
                                                                                                const normalized = attrName.trim().toLowerCase();
                                                                                                return normalized === 'pipe size' || normalized === 'pipesize';
                                                                                            });
                                                                                            if (pipeSizeAttrName && value) {
                                                                                                updated[variantKey][pipeSizeAttrName] = value;
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                }
                                                                            }
                                                                            
                                                                            // Force React to recognize the state change
                                                                            return { ...updated };
                                                                        });
                                                                    }}
                                                                    placeholder={`Select ${attrName}`}
                                                                    options={finalAvailableValues.length > 0 
                                                                        ? finalAvailableValues.map((val) => ({
                                                                            value: val,
                                                                            label: val
                                                                        }))
                                                                        : (defaultAttrValue ? [{ value: defaultAttrValue, label: defaultAttrValue }] : [])
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Specifications Table */}
                                        <div className="mt-4">
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">Specifications</label>
                                        {headKey && dischargeKey && maxLength > 0 ? (
                                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                                        {headKey} & {dischargeKey}
                                                    </h4>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b-2 border-gray-200">
                                                                <th className="text-left py-3 px-4 font-bold text-gray-700 w-16">S.No.</th>
                                                                <th className="text-left py-3 px-4 font-bold text-gray-700">{headKey}</th>
                                                                <th className="text-left py-3 px-4 font-bold text-gray-700">{dischargeKey}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Array.from({ length: maxLength }).map((_, idx) => (
                                                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                                    <td className="py-3 px-4 text-gray-900 font-semibold">{idx + 1}</td>
                                                                    <td className="py-3 px-4 text-gray-900 font-semibold">
                                                                        {headValues[idx] || '-'} {headUnit && <span className="text-gray-500 font-normal ml-1">{headUnit}</span>}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-gray-900 font-semibold">
                                                                        {dischargeValues[idx] || '-'} {dischargeUnit && <span className="text-gray-500 font-normal ml-1">{dischargeUnit}</span>}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                                                <p className="text-sm text-gray-500">No specifications available for the selected attributes.</p>
                                        </div>
                                    )}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Brands (for non-variant products) */}
                {!product.hasVariants && product.brandIds && product.brandIds.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Brands</h2>
                        <div className="flex flex-wrap gap-3">
                            {product.brandIds.map((brand, index) => (
                                <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg border border-blue-200">
                                    {brand.title || brand}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={product ? `Are you sure you want to delete "${product.title}"? This action cannot be undone.` : 'Are you sure you want to delete this product?'}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    )
}

