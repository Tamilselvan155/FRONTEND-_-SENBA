'use client'

import { ChevronDown, Plus, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import CustomSelect from "@/components/common/CustomSelect"
import { useRouter, useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductByIdAsync, updateProductAsync, clearCurrentProduct, fetchProductsAsync } from "@/lib/features/product/productSlice"
import { fetchCategoriesForDropdownAsync } from "@/lib/features/category/categorySlice"
import { fetchBrandsForDropdownAsync } from "@/lib/features/brand/brandSlice"
import { fetchAttributesAsync } from "@/lib/features/attribute/attributeSlice"
import { fetchAttributeValuesByAttributeAsync } from "@/lib/features/attributeValue/attributeValueSlice"
import toast from "react-hot-toast"
import axiosInstance from "@/lib/api/axios"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils/imageUtils"

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()
    const { currentProduct, loading: productLoading } = useSelector((state) => state.product)
    const { categoriesForDropdown } = useSelector((state) => state.category)
    const { brandsForDropdown } = useSelector((state) => state.brand)
    const { attributes } = useSelector((state) => state.attribute)
    const { attributeValues } = useSelector((state) => state.attributeValue)
    
    const [formData, setFormData] = useState({
        title: '',
        isFeatured: true,
        category: '',
        subcategory: '',
        selectedBrands: [],
        hasVariants: false,
        price: '',
        discount: '',
        stock: '',
        sku: '',
        status: 'active'
    })
    const [specificationGroups, setSpecificationGroups] = useState([])
    const [brandVariants, setBrandVariants] = useState([])
    const [attributeValuesMap, setAttributeValuesMap] = useState({})
    const [loadedAttributeIds, setLoadedAttributeIds] = useState(new Set())
    const [images, setImages] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [existingImages, setExistingImages] = useState([])
    const [uploadingImages, setUploadingImages] = useState(false)
    const formInitializedRef = useRef(false)
    const initializedProductIdRef = useRef(null)

    useEffect(() => {
        if (params.id) {
            // Reset form initialization when product ID changes
            if (initializedProductIdRef.current !== params.id) {
                formInitializedRef.current = false
                initializedProductIdRef.current = null
            }
            dispatch(fetchProductByIdAsync(params.id))
            dispatch(fetchCategoriesForDropdownAsync())
            dispatch(fetchBrandsForDropdownAsync())
            dispatch(fetchAttributesAsync())
        }
    }, [params.id, dispatch])

    // Fetch attribute values when attributes change
    useEffect(() => {
        attributes.forEach(attr => {
            const attrId = attr.id || attr._id;
            if (attrId && !loadedAttributeIds.has(attrId)) {
                dispatch(fetchAttributeValuesByAttributeAsync(attrId))
                setLoadedAttributeIds(prev => new Set([...prev, attrId]))
            }
        })
    }, [attributes, dispatch, loadedAttributeIds])

    // Update attribute values map when attributeValues change
    useEffect(() => {
        const map = { ...attributeValuesMap };
        attributeValues.forEach(av => {
            const attrId = av.attributeId?._id || av.attributeId?.id || av.attributeId;
            if (attrId) {
                if (!map[attrId]) {
                    map[attrId] = [];
                }
                const exists = map[attrId].some(v => (v.id === (av._id || av.id)));
                if (!exists) {
                    map[attrId].push({
                        id: av._id || av.id,
                        value: av.value
                    });
                }
            }
        });
        setAttributeValuesMap(map);
    }, [attributeValues])

    // Populate form when product data is loaded (only once per product)
    useEffect(() => {
        if (currentProduct) {
            let product = currentProduct;
            if (currentProduct.data) {
                product = currentProduct.data;
            } else if (currentProduct.success && currentProduct.data) {
                product = currentProduct.data;
            }

            const productId = product._id || product.id || params.id;
            const currentProductId = String(productId);
            const initializedId = initializedProductIdRef.current ? String(initializedProductIdRef.current) : null;
            
            // Only initialize if this is a different product or form hasn't been initialized
            if (!formInitializedRef.current || initializedId !== currentProductId) {
                // Load attribute values for variant attributes
                if (product.brandVariants && product.brandVariants.length > 0) {
                    product.brandVariants.forEach(variant => {
                        if (variant.attributes) {
                            variant.attributes.forEach(attr => {
                                const attrId = attr.attributeId?._id || attr.attributeId?.id || attr.attributeId;
                                if (attrId && !loadedAttributeIds.has(attrId)) {
                                    dispatch(fetchAttributeValuesByAttributeAsync(attrId))
                                    setLoadedAttributeIds(prev => new Set([...prev, attrId]))
                                }
                            })
                        }
                    })
                }

                // Set initial form data - category/subcategory will be set when categories load
                setFormData({
                    title: product.title || '',
                    isFeatured: product.isFeatured || false,
                    category: product.categoryId?._id || product.categoryId?.id || product.categoryId || '',
                    subcategory: '',
                    selectedBrands: product.brandIds ? product.brandIds.map(b => b._id || b.id || b) : [],
                    hasVariants: product.hasVariants || false,
                    price: product.price?.toString() || '',
                    discount: product.discount?.toString() || '',
                    stock: product.stock?.toString() || '',
                    sku: product.sku || '',
                    status: product.status || 'active'
                })

                // Set existing images
                if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                    setExistingImages(product.images)
                } else {
                    setExistingImages([])
                }

                // Set specification groups - only if not already initialized for this product
                if (!formInitializedRef.current || initializedId !== currentProductId) {
                    if (product.specificationGroups) {
                        setSpecificationGroups(product.specificationGroups.map((group, idx) => {
                            // Convert specifications to textarea content
                            // Specifications can be in object format (new) or array format (old)
                            // Join with '?' separator in "Key : Value" format
                            let content = ''
                            if (group.specifications) {
                                if (typeof group.specifications === 'object' && !Array.isArray(group.specifications)) {
                                    // New format - single object with keys as feature names
                                    content = Object.entries(group.specifications)
                                        .map(([key, value]) => `${key} : ${value}`)
                                        .filter(item => item.trim())
                                        .join(' ? ')
                                } else if (Array.isArray(group.specifications) && group.specifications.length > 0) {
                                    // Old format - array of objects
                                    content = group.specifications.map(spec => {
                                        if (spec.featureName && spec.featureValue) {
                                            // Old format with featureName/featureValue
                                            return `${spec.featureName} : ${spec.featureValue}`
                                        } else {
                                            // Array of objects with dynamic keys
                                            const keys = Object.keys(spec)
                                            if (keys.length > 0) {
                                                const key = keys[0]
                                                const value = spec[key]
                                                return `${key} : ${value}`
                                            }
                                        }
                                        return ''
                                    }).filter(item => item.trim()).join(' ? ')
                                }
                            }
                            
                            return {
                                id: Date.now() + idx,
                                groupLabel: group.groupLabel || '',
                                content: content
                            }
                        }))
                    } else {
                        setSpecificationGroups([])
                    }

                    // Set brand variants
                    if (product.brandVariants && product.brandVariants.length > 0) {
                        setBrandVariants(product.brandVariants.map((variant, idx) => ({
                            id: Date.now() + idx * 1000,
                            brand: variant.brandId?._id || variant.brandId?.id || variant.brandId || '',
                            attributes: variant.attributes ? variant.attributes.map((attr, attrIdx) => ({
                                id: Date.now() + idx * 1000 + attrIdx * 100,
                                name: attr.attributeId?.title || attr.attributeName || '',
                                value: attr.attributeValueId?.value || attr.attributeValue || ''
                            })) : [],
                            specifications: variant.specifications ? (() => {
                                // Convert specifications to textarea content format: "Key : values ? Key2 : values2"
                                if (typeof variant.specifications === 'object' && !Array.isArray(variant.specifications)) {
                                    // Single object format: { Head: { values: [...], unit: '...' }, Discharge: { values: [...], unit: '...' } }
                                    const pairs = Object.entries(variant.specifications).map(([key, value]) => {
                                        if (typeof value === 'object' && value.values && Array.isArray(value.values)) {
                                            // New format: { values: [...], unit: '...' }
                                            return `${key} : ${value.values.join(',')}`;
                                        } else {
                                            // Old string format: "6,12,15,18 meter" - extract values
                                            const str = String(value).trim();
                                            const parts = str.split(/\s+/);
                                            const valuesOnly = parts.length > 1 ? parts.slice(0, -1).join(' ') : str;
                                            return `${key} : ${valuesOnly}`;
                                        }
                                    });
                                    return [{ id: Date.now() + idx * 1000, content: pairs.join(' ? ') }];
                                } else if (Array.isArray(variant.specifications) && variant.specifications.length > 0) {
                                    // Array format - convert each spec object to "Key : values" format
                                    return variant.specifications.map((spec, specIdx) => {
                                        if (typeof spec === 'object') {
                                            if (spec.name && spec.value) {
                                                // Old format: { name: '...', value: '...' } - extract value without unit
                                                const str = String(spec.value).trim();
                                                const parts = str.split(/\s+/);
                                                const valueWithoutUnit = parts.length > 1 ? parts.slice(0, -1).join(' ') : str;
                                                return {
                                                    id: Date.now() + idx * 1000 + specIdx * 10,
                                                    content: `${spec.name} : ${valueWithoutUnit}`
                                                };
                                            } else {
                                                // Object format: { Head: { values: [...], unit: '...' }, Discharge: { values: [...], unit: '...' } }
                                                // or old format: { Head: '6,12,15,18 meter', Discharge: '30,20,14,8 LPM' }
                                                const pairs = Object.entries(spec).map(([key, value]) => {
                                                    if (typeof value === 'object' && value.values && Array.isArray(value.values)) {
                                                        // New format: { values: [...], unit: '...' }
                                                        return `${key} : ${value.values.join(',')}`;
                                                    } else {
                                                        // Old string format - extract values
                                                        const str = String(value).trim();
                                                        const parts = str.split(/\s+/);
                                                        const valuesOnly = parts.length > 1 ? parts.slice(0, -1).join(' ') : str;
                                                        return `${key} : ${valuesOnly}`;
                                                    }
                                                });
                                                return {
                                                    id: Date.now() + idx * 1000 + specIdx * 10,
                                                    content: pairs.join(' ? ')
                                                };
                                            }
                                        }
                                        return { id: Date.now() + idx * 1000 + specIdx * 10, content: '' };
                                    });
                                }
                                return [];
                            })() : [],
                            price: variant.price?.toString() || '',
                            discount: variant.discount?.toString() || '',
                            stock: variant.stock?.toString() || '',
                            sku: variant.sku || ''
                        })))
                    } else {
                        setBrandVariants([])
                    }
                }

                formInitializedRef.current = true
                initializedProductIdRef.current = currentProductId
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProduct, dispatch, params.id])

    // Update category/subcategory when categoriesForDropdown loads
    useEffect(() => {
        if (formInitializedRef.current && formData.category && categoriesForDropdown.length > 0) {
            const currentCategoryId = formData.category;
            const productCategory = categoriesForDropdown.find(cat => 
                (cat._id === currentCategoryId || cat.id === currentCategoryId)
            );
            
            // If the current category is a subcategory, update parent and subcategory fields
            if (productCategory && !productCategory.isParent && productCategory.parentId) {
                const parentId = productCategory.parentId._id || productCategory.parentId.id || productCategory.parentId || '';
                setFormData(prev => ({
                    ...prev,
                    category: parentId,
                    subcategory: currentCategoryId
                }))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriesForDropdown])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }
            // Clear variants if hasVariants is unchecked
            if (name === 'hasVariants' && !checked) {
                setBrandVariants([])
            }
            // Clear subcategory when parent category changes
            if (name === 'category') {
                newData.subcategory = ''
            }
            return newData
        })
    }

    const handleBrandChange = (brandId) => {
        setFormData(prev => ({
            ...prev,
            selectedBrands: prev.selectedBrands.includes(brandId)
                ? prev.selectedBrands.filter(id => id !== brandId)
                : [...prev.selectedBrands, brandId]
        }))
    }

    const handleAddSpecificationGroup = () => {
        setSpecificationGroups(prev => [
            ...prev,
            {
                id: Date.now(),
                groupLabel: '',
                content: ''
            }
        ])
    }

    const handleRemoveSpecificationGroup = (groupId) => {
        setSpecificationGroups(prev => prev.filter(group => group.id !== groupId))
    }

    const handleUpdateGroupLabel = (groupId, value) => {
        setSpecificationGroups(prev =>
            prev.map(group =>
                group.id === groupId ? { ...group, groupLabel: value } : group
            )
        )
    }

    const handleUpdateSpecificationContent = (groupId, value) => {
        setSpecificationGroups(prev =>
            prev.map(group =>
                group.id === groupId ? { ...group, content: value } : group
            )
        )
    }

    // Brand Variant Handlers
    const handleAddBrandVariant = () => {
        setBrandVariants(prev => [
            ...prev,
            {
                id: Date.now(),
                brand: '',
                attributes: [],
                specifications: [],
                price: '',
                discount: '',
                stock: '',
                sku: ''
            }
        ])
    }

    const handleRemoveBrandVariant = (variantId) => {
        setBrandVariants(prev => prev.filter(variant => variant.id !== variantId))
    }

    const handleUpdateBrandVariant = (variantId, field, value) => {
        setBrandVariants(prev =>
            prev.map(variant =>
                variant.id === variantId ? { ...variant, [field]: value } : variant
            )
        )
    }

    const handleAddVariantAttribute = (variantId) => {
        setBrandVariants(prev =>
            prev.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          attributes: [
                              ...variant.attributes,
                              { id: Date.now(), name: '', value: '' }
                          ]
                      }
                    : variant
            )
        )
    }

    const handleRemoveVariantAttribute = (variantId, attrId) => {
        setBrandVariants(prev =>
            prev.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          attributes: variant.attributes.filter(attr => attr.id !== attrId)
                      }
                    : variant
            )
        )
    }

    const handleUpdateVariantAttribute = (variantId, attrId, field, value) => {
        setBrandVariants(prev =>
            prev.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          attributes: variant.attributes.map(attr =>
                              attr.id === attrId ? { ...attr, [field]: value } : attr
                          )
                      }
                    : variant
            )
        )
    }

    const handleAddVariantSpec = (variantId) => {
        setBrandVariants(prev =>
            prev.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          specifications: [
                              ...variant.specifications,
                              { id: Date.now(), content: '' }
                          ]
                      }
                    : variant
            )
        )
    }

    const handleRemoveVariantSpec = (variantId, specId) => {
        setBrandVariants(prev =>
            prev.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          specifications: variant.specifications.filter(spec => spec.id !== specId)
                      }
                    : variant
            )
        )
    }

    const handleUpdateVariantSpecContent = (variantId, specId, content) => {
        setBrandVariants(prev =>
            prev.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          specifications: variant.specifications.map(spec =>
                              spec.id === specId ? { ...spec, content: content } : spec
                          )
                      }
                    : variant
            )
        )
    }

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/')
            const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
            if (!isValidType) {
                toast.error(`${file.name} is not a valid image file`)
                return false
            }
            if (!isValidSize) {
                toast.error(`${file.name} is too large. Maximum size is 5MB`)
                return false
            }
            return true
        })

        if (validFiles.length === 0) return

        // Create previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file))
        setImagePreviews(prev => [...prev, ...newPreviews])
        setImages(prev => [...prev, ...validFiles])
    }

    const removeImage = (index) => {
        // Revoke object URL to free memory
        URL.revokeObjectURL(imagePreviews[index])
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const uploadImages = async () => {
        if (images.length === 0) return []

        setUploadingImages(true)
        try {
            const formData = new FormData()
            images.forEach((file) => {
                formData.append('images', file)
            })

            const response = await axiosInstance.post('/upload/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (response.data.success) {
                // Return full URLs with backend base URL
                const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
                return response.data.urls.map(url => `${baseURL}${url}`)
            }
            return []
        } catch (error) {
            console.error('Error uploading images:', error)
            toast.error(error.response?.data?.error || 'Failed to upload images')
            return []
        } finally {
            setUploadingImages(false)
        }
    }

    // Helper function to process specifications into pairs
    // Pairs specifications by index: 1st value of 1st spec with 1st value of 2nd spec, etc.
    const processSpecificationPairs = (specifications) => {
        if (!specifications || !Array.isArray(specifications) || specifications.length === 0) {
            return specifications || []
        }

        console.log('Processing specifications into pairs (Edit)...')
        console.log('Original specifications:', specifications)

        // Check if specifications are already in "Pair" format - if so, don't transform
        const isAlreadyPaired = specifications.some(spec => {
            const name = (spec.featureName || '').toString().trim()
            return name.toLowerCase().startsWith('pair')
        })

        if (isAlreadyPaired) {
            console.log('Specifications already in Pair format, skipping transformation')
            return specifications
        }

        // Parse all specifications and extract their values
        const parsedSpecs = specifications.map(spec => {
            const name = (spec.featureName || '').toString().trim()
            const value = (spec.featureValue || '').toString().trim()
            
            if (!name || !value) {
                return null
            }

            // Get first letter of feature name
            const firstLetter = name.charAt(0).toUpperCase()
            
            // Parse comma-separated values or use single value
            const values = value.includes(',') 
                ? value.split(',').map(v => v.trim()).filter(v => v)
                : [value]

            return {
                firstLetter,
                values,
                originalName: name
            }
        }).filter(spec => spec !== null && spec.values.length > 0)

        console.log('Parsed specifications:', parsedSpecs)

        if (parsedSpecs.length === 0) {
            return specifications
        }

        // If we have 2 or more specs, pair them by index
        if (parsedSpecs.length >= 2) {
            const firstSpec = parsedSpecs[0]
            const secondSpec = parsedSpecs[1]
            
            // Find the minimum length to pair all available values
            const minLength = Math.min(firstSpec.values.length, secondSpec.values.length)
            const pairs = []

            for (let i = 0; i < minLength; i++) {
                pairs.push({
                    featureName: `Pair ${i + 1}`,
                    featureValue: `${firstSpec.firstLetter}${firstSpec.values[i]} ${secondSpec.firstLetter}${secondSpec.values[i]}`
                })
            }

            // If there are more than 2 specs, handle them sequentially
            if (parsedSpecs.length > 2) {
                // For additional specs, pair them with the next spec
                for (let specIndex = 2; specIndex < parsedSpecs.length; specIndex++) {
                    const currentSpec = parsedSpecs[specIndex]
                    const pairStartIndex = pairs.length
                    
                    for (let i = 0; i < currentSpec.values.length; i++) {
                        pairs.push({
                            featureName: `Pair ${pairStartIndex + i + 1}`,
                            featureValue: `${currentSpec.firstLetter}${currentSpec.values[i]}`
                        })
                    }
                }
            }

            console.log('Generated pairs:', pairs)
            return pairs
        } else {
            // Only one spec - create pairs from its values
            const singleSpec = parsedSpecs[0]
            const pairs = singleSpec.values.map((val, index) => ({
                featureName: `Pair ${index + 1}`,
                featureValue: `${singleSpec.firstLetter}${val}`
            }))

            console.log('Generated pairs (single spec):', pairs)
            return pairs
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log('Form submission started')
            
            // Upload new images first
            let newImageUrls = []
            if (images.length > 0) {
                newImageUrls = await uploadImages()
                if (newImageUrls.length === 0) {
                    // Warn but don't block - allow update to proceed
                    toast.error('Failed to upload new images. Product will be updated without new images.')
                }
            }

            // Combine existing images (that weren't removed) with new images
            const allImageUrls = [...existingImages, ...newImageUrls]
            
            console.log('Images processed:', { existing: existingImages.length, new: newImageUrls.length, total: allImageUrls.length })

            // Map brand variants to backend format
            const mappedBrandVariants = formData.hasVariants ? brandVariants.map(variant => ({
                brandId: variant.brand,
                attributes: variant.attributes
                    .filter(attr => attr.name && attr.value)
                    .map(attr => {
                        // Save text values directly
                        return {
                            attributeName: attr.name,
                            attributeValue: attr.value
                        };
                    }),
                specifications: variant.specifications
                    .map(spec => {
                        // Parse textarea content in format: "Key : values ? Key2 : values2"
                        let specificationsObject = {};
                        if (spec.content && spec.content.trim()) {
                            // Split by '?' to get each key-value pair
                            const pairs = spec.content.split('?').map(p => p.trim()).filter(p => p);
                            
                            pairs.forEach(pair => {
                                // Split by ':' to separate key and values
                                const colonIndex = pair.indexOf(':');
                                if (colonIndex > 0) {
                                    const key = pair.substring(0, colonIndex).trim();
                                    const valuesStr = pair.substring(colonIndex + 1).trim();
                                    
                                    if (key && valuesStr) {
                                        // Parse comma-separated values into array
                                        const valuesArray = valuesStr.split(',').map(v => v.trim()).filter(v => v);
                                        
                                        // Find the corresponding attribute to get the unit
                                        const matchingAttr = variant.attributes.find(attr => 
                                            attr.name && attr.name.toLowerCase() === key.toLowerCase()
                                        );
                                        
                                        // Store as object with values array and unit
                                        specificationsObject[key] = {
                                            values: valuesArray,
                                            unit: matchingAttr?.value || ''
                                        };
                                    }
                                }
                            });
                        }
                        return specificationsObject;
                    })
                    .filter(specObj => Object.keys(specObj).length > 0), // Filter out empty objects
                price: variant.price ? parseFloat(variant.price) : 0,
                discount: variant.discount ? parseFloat(variant.discount) : 0,
                stock: variant.stock ? parseInt(variant.stock) : 0,
                sku: variant.sku || ''
            })) : [];

            // Process specification groups - convert textarea content to specifications format
            // Content is separated by '?' and each item is in "Key : Value" format
            // Store as a single object with keys as feature names and values as feature values
            const processedSpecificationGroups = specificationGroups.map(group => {
                let specifications = {}
                
                if (group.content && group.content.trim()) {
                    // Split by '?' separator
                    const items = group.content.split('?').map(item => item.trim()).filter(item => item)
                    
                    items.forEach((item, index) => {
                        // Try to split by colon ':' for "Key : Value" format
                        const colonIndex = item.indexOf(':')
                        
                        if (colonIndex > 0) {
                            const featureName = item.substring(0, colonIndex).trim()
                            const featureValue = item.substring(colonIndex + 1).trim()
                            // Add to specifications object with feature name as key
                            if (featureName) {
                                specifications[featureName] = featureValue
                            }
                        } else {
                            // If no colon separator, save as-is without "Item" prefix
                            // Use the item content directly as the value
                            const itemContent = item.trim()
                            if (itemContent) {
                                // Save with a simple key based on index, or use the content itself
                                specifications[itemContent] = itemContent
                            }
                        }
                    })
                }
                
                // Fallback: if group has old specifications format (array), convert it to object
                if (group.specifications) {
                    if (Array.isArray(group.specifications) && group.specifications.length > 0) {
                        group.specifications.forEach(spec => {
                            if (spec.featureName && spec.featureValue) {
                                // Old format with featureName/featureValue
                                specifications[spec.featureName] = spec.featureValue
                            } else {
                                // New format (array of objects with dynamic keys)
                                const keys = Object.keys(spec)
                                if (keys.length > 0) {
                                    specifications[keys[0]] = spec[keys[0]]
                                }
                            }
                        })
                    } else if (typeof group.specifications === 'object' && !Array.isArray(group.specifications)) {
                        // Already in object format
                        specifications = group.specifications
                    }
                }
                
                return {
                    groupLabel: group.groupLabel,
                    specifications: specifications
                }
            })

            // Debug: Log the processed specification groups
            console.log('Processed Specification Groups (Edit):', JSON.stringify(processedSpecificationGroups, null, 2))

            // Determine categoryId - use subcategory if provided, otherwise use category
            const finalCategoryId = formData.subcategory || formData.category;
            
            if (!finalCategoryId || finalCategoryId === '') {
                toast.error('Please select a category or subcategory');
                return;
            }

            const submitData = {
                title: formData.title,
                isFeatured: formData.isFeatured,
                category: formData.category && formData.category !== '' ? formData.category : null, // Parent category
                subcategory: formData.subcategory && formData.subcategory !== '' ? formData.subcategory : null, // Subcategory (optional)
                categoryId: finalCategoryId, // Final category ID for backend
                brandIds: formData.selectedBrands,
                hasVariants: formData.hasVariants,
                status: formData.status,
                images: allImageUrls,
                specificationGroups: processedSpecificationGroups,
                brandVariants: mappedBrandVariants,
                ...(formData.hasVariants ? {} : {
                    price: formData.price ? parseFloat(formData.price) : 0,
                    discount: formData.discount ? parseFloat(formData.discount) : 0,
                    stock: formData.stock ? parseInt(formData.stock) : 0,
                    sku: formData.sku || ''
                })
            }

            console.log('Submitting update request with data:', {
                id: params.id,
                hasVariants: formData.hasVariants,
                brandVariantsCount: mappedBrandVariants.length,
                specificationsCount: mappedBrandVariants.reduce((sum, v) => sum + (v.specifications?.length || 0), 0)
            })
            
            await dispatch(updateProductAsync({ id: params.id, data: submitData })).unwrap()
            console.log('Update request completed successfully')
            // Refresh products list before navigating and wait for it to complete
            await dispatch(fetchProductsAsync()).unwrap()
            toast.success('Product updated successfully!')
            // Use replace instead of push to ensure we fully navigate away
            // Clear currentProduct after navigation to prevent form re-population
            router.replace('/admin/products')
            // Clear currentProduct after navigation completes
            setTimeout(() => {
                dispatch(clearCurrentProduct())
            }, 200)
        } catch (err) {
            toast.error(err || 'Failed to update product')
        }
    }

    if (productLoading && !currentProduct) {
        return <div className="p-4 text-center">Loading product data...</div>
    }

    // Only show "Product not found" if we're actually trying to load a product
    // and it's not loading, and we have an ID, and the form hasn't been initialized
    // This prevents showing the error when we're navigating away after update
    if (!productLoading && !currentProduct && params.id && !formInitializedRef.current) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-500">Product not found</p>
                <button
                    onClick={() => router.push('/admin/products')}
                    className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                    Back to Products
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white">
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 w-full">
                {/* Title and Category in same row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Title Field */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter title"
                            required
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Category Field */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <CustomSelect
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required={true}
                            placeholder="--Select any category--"
                            options={[
                                { value: '', label: '--Select any category--' },
                                ...(Array.isArray(categoriesForDropdown) ? categoriesForDropdown
                                    .filter(cat => cat && (cat.isParent === true || cat.isParent === 'true'))
                                    .map((cat) => ({
                                        value: cat._id || cat.id || '',
                                        label: cat.title || cat.name || 'Untitled Category'
                                    })) : [])
                            ]}
                        />
                    </div>
                </div>

                {/* Subcategory Field - Only show if parent category has subcategories */}
                {formData.category && (() => {
                    const selectedParentId = formData.category;
                    const subcategories = Array.isArray(categoriesForDropdown) ? categoriesForDropdown.filter(cat => {
                        if (!cat) return false;
                        if (cat.isParent === true || cat.isParent === 'true') return false;
                        if (!cat.parentId) return false;
                        
                        // Handle different parentId structures (populated object or ID string)
                        const parentId = cat.parentId._id || cat.parentId.id || cat.parentId;
                        return parentId && parentId.toString() === selectedParentId.toString();
                    }) : [];
                    
                    if (subcategories.length > 0) {
                        return (
                            <div className="w-full lg:w-[calc(50%-0.625rem)]">
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                    Subcategory
                                </label>
                                <CustomSelect
                                    name="subcategory"
                                    value={formData.subcategory}
                                    onChange={handleInputChange}
                                    placeholder="--Select subcategory--"
                                    options={[
                                        { value: '', label: '--Select subcategory--' },
                                        ...subcategories.map((cat) => ({
                                            value: cat._id || cat.id || '',
                                            label: cat.title || cat.name || 'Untitled Subcategory'
                                        }))
                                    ]}
                                />
                            </div>
                        );
                    }
                    return null;
                })()}

                {/* Is Featured Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Is Featured
                    </label>
                    {formData.isFeatured && (
                        <span className="text-xs text-gray-500 font-medium">✓</span>
                    )}
                </div>

                {/* Product Images Section */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                        Product Images
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {/* Existing Images */}
                        {existingImages.map((imageUrl, index) => {
                            const fullImageUrl = getImageUrl(imageUrl)
                            return (
                                <div key={`existing-${index}`} className="relative group">
                                    <div className="w-32 h-32 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-100">
                                        {fullImageUrl ? (
                                            <img
                                                src={fullImageUrl}
                                                alt={`Existing ${index + 1}`}
                                                className="object-cover w-full h-full"
                                                style={{ width: '100%', height: '100%' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none'
                                                    e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full text-gray-400">Image not found</div>'
                                                }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-gray-400">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition"
                                        title="Remove image"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )
                        })}
                        
                        {/* Preview new images */}
                        {imagePreviews.map((preview, index) => (
                            <div key={`new-${index}`} className="relative group">
                                <div className="w-32 h-32 rounded-lg border-2 border-blue-300 overflow-hidden bg-gray-100">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="object-cover w-full h-full"
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition"
                                    title="Remove image"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        
                        {/* Add Image Button */}
                        <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition">
                            <div className="text-center">
                                <Plus size={24} className="mx-auto text-gray-400" />
                                <span className="text-xs text-gray-500 mt-2 block">Add Image</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={uploadingImages}
                            />
                        </label>
                    </div>
                    {uploadingImages && (
                        <p className="text-sm text-blue-600 mt-2">Uploading images...</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                        Maximum 10 images, 5MB per image. Supported formats: JPEG, PNG, GIF, WebP
                    </p>
                </div>

                {/* Select Brands */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                        Select Brands
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {brandsForDropdown.map((brand) => {
                            const brandId = brand._id || brand.id;
                            return (
                                <div key={brandId} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`brand-${brandId}`}
                                        checked={formData.selectedBrands.includes(brandId)}
                                        onChange={() => handleBrandChange(brandId)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor={`brand-${brandId}`} className="text-sm text-gray-700 cursor-pointer">
                                        {brand.title}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Product Variants Checkbox */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="hasVariants"
                        id="hasVariants"
                        checked={formData.hasVariants}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="hasVariants" className="text-sm font-medium text-gray-700">
                        This product has variants
                    </label>
                </div>

                {/* Add Brand Variant and Specification Group Buttons - Show in a row */}
                <div className="flex items-center gap-3">
                    {formData.hasVariants && (
                        <button
                            type="button"
                            onClick={handleAddBrandVariant}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                        >
                            <Plus size={14} />
                            Add Brand Variant
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleAddSpecificationGroup}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    >
                        <Plus size={14} />
                        Add Specification Group
                    </button>
                </div>

                {/* Brand Variants and Specification Groups - Side by Side Layout */}
                {(formData.hasVariants && brandVariants.length > 0) || specificationGroups.length > 0 ? (
                    <div className={formData.hasVariants && brandVariants.length > 0 ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}>
                        {/* Brand Variants Section - Left Half */}
                        {formData.hasVariants && brandVariants.length > 0 && (
                            <div className="space-y-4">
                                {brandVariants.map((variant, index) => (
                                    <div key={variant.id} className="bg-gray-50 p-4 rounded-lg space-y-3">
                                        {/* Variant Header */}
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-700">
                                                Brand Variant {index + 1}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveBrandVariant(variant.id)}
                                                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition"
                                                title="Remove variant"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {/* Brand Field */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                                Brand
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={variant.brand}
                                                    onChange={(e) => handleUpdateBrandVariant(variant.id, 'brand', e.target.value)}
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-colors"
                                                >
                                                    <option value="">Choose Brand</option>
                                                    {brandsForDropdown.map((brand) => {
                                                        const brandId = brand._id || brand.id;
                                                        return (
                                                            <option key={brandId} value={brandId}>
                                                                {brand.title}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <ChevronDown 
                                                    size={16} 
                                                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Attributes Section */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                                Attributes
                                            </label>
                                            <div className="space-y-2">
                                                {variant.attributes.map((attr) => (
                                                    <div key={attr.id} className="flex items-end gap-2">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={attr.name || ''}
                                                                onChange={(e) => handleUpdateVariantAttribute(variant.id, attr.id, 'name', e.target.value)}
                                                                placeholder="Select Attribute"
                                                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={attr.value || ''}
                                                                onChange={(e) => handleUpdateVariantAttribute(variant.id, attr.id, 'value', e.target.value)}
                                                                placeholder="Select Value"
                                                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveVariantAttribute(variant.id, attr.id)}
                                                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition"
                                                            title="Remove attribute"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleAddVariantAttribute(variant.id)}
                                                className="mt-2 flex items-center gap-1.5 px-2.5 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition"
                                            >
                                                <Plus size={12} />
                                                Add Attribute
                                            </button>
                                        </div>

                                        {/* Specifications Section */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                                Specifications <span className="text-gray-500 text-xs font-normal normal-case">(Format: Key : values ? Key2 : values2)</span>
                                            </label>
                                            <div className="space-y-2">
                                                {variant.specifications.map((spec) => (
                                                    <div key={spec.id} className="flex items-start gap-2">
                                                        <textarea
                                                            value={spec.content || ''}
                                                            onChange={(e) => handleUpdateVariantSpecContent(variant.id, spec.id, e.target.value)}
                                                            placeholder="Head : 6,12,15,18 ? Discharge : 30,20,14,8"
                                                            rows={3}
                                                            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition-colors"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveVariantSpec(variant.id, spec.id)}
                                                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition mt-0.5"
                                                            title="Remove specification"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleAddVariantSpec(variant.id)}
                                                className="mt-2 flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition"
                                            >
                                                <Plus size={12} />
                                                Add Spec
                                            </button>
                                        </div>

                                        {/* Pricing and Stock Fields for Variant */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                                    Price
                                                </label>
                                                <input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => handleUpdateBrandVariant(variant.id, 'price', e.target.value)}
                                                    placeholder="Enter price"
                                                    step="0.01"
                                                    min="0"
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                                    Discount (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={variant.discount}
                                                    onChange={(e) => handleUpdateBrandVariant(variant.id, 'discount', e.target.value)}
                                                    placeholder="Enter discount"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                                    Stock
                                                </label>
                                                <input
                                                    type="number"
                                                    value={variant.stock}
                                                    onChange={(e) => handleUpdateBrandVariant(variant.id, 'stock', e.target.value)}
                                                    placeholder="Enter stock quantity"
                                                    min="0"
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                                    SKU
                                                </label>
                                                <input
                                                    type="text"
                                                    value={variant.sku}
                                                    onChange={(e) => handleUpdateBrandVariant(variant.id, 'sku', e.target.value)}
                                                    placeholder="Enter SKU"
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Specification Groups Section - Right Half or Full Width with 2 columns */}
                        {specificationGroups.length > 0 && (
                            <div className={formData.hasVariants && brandVariants.length > 0 ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-2 gap-5"}>
                                {specificationGroups.map((group, index) => (
                                    <div key={group.id} className="space-y-3">
                                        {/* Group Header */}
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-700">
                                                Specification Group {index + 1}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSpecificationGroup(group.id)}
                                                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition"
                                                title="Remove Group"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {/* Group Label Field */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                                Group Label
                                            </label>
                                            <input
                                                type="text"
                                                value={group.groupLabel}
                                                onChange={(e) => handleUpdateGroupLabel(group.id, e.target.value)}
                                                placeholder="Enter group label"
                                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>

                                        {/* Specification Content Textarea */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                                Specifications <span className="text-gray-500 text-xs font-normal normal-case">(Separate each item with '?' and use 'Key : Value' format)</span>
                                            </label>
                                            <textarea
                                                value={group.content || ''}
                                                onChange={(e) => handleUpdateSpecificationContent(group.id, e.target.value)}
                                                placeholder="Power : 0.5 HP,1 HP,1.5 HP,2 HP ? Speed : 2780 rpm ? Voltage range: 180v-240v (1ph)—50 HZ"
                                                rows={5}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition-colors"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}

                {/* Price, Discount, Stock, SKU Fields - Hide when hasVariants is true */}
                {!formData.hasVariants && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Price Field */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="Enter price"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Discount Field */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleInputChange}
                                placeholder="Enter discount"
                                step="0.01"
                                min="0"
                                max="100"
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Stock Field */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                placeholder="Enter stock quantity"
                                min="0"
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* SKU Field */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                SKU
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                placeholder="Enter SKU"
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                )}

                {/* Status Field */}
                <div className="w-full md:w-1/3">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required={true}
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' }
                        ]}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/products')}
                        className="px-4 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={productLoading}
                        className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {productLoading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </form>
        </div>
    )
}

