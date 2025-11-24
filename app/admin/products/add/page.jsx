'use client'

import { ChevronDown, Plus, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        isFeatured: true,
        category: '',
        selectedBrands: [],
        hasVariants: false,
        price: '',
        discount: '',
        stock: '',
        sku: '',
        status: 'Active'
    })
    const [specificationGroups, setSpecificationGroups] = useState([])
    const [brandVariants, setBrandVariants] = useState([])

    // Sample categories - replace with actual data from API
    const categories = [
        'Water-Pumps SS monobloc pump',
        'Water-Pumps Petrol engine pump',
        'Water-Pumps Monobloc pump',
        'Other Categories'
    ]

    // Sample brands - replace with actual data from API
    const brands = [
        { id: 1, name: 'SENBA' }
    ]

    // Sample attributes - replace with actual data from API
    const attributes = [
        { id: 1, name: 'HP', values: ['5', '10', '15', '20'] },
        { id: 2, name: 'Capacity', values: ['1000', '2000', '3000'] }
    ]

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        
        // Clear variants if hasVariants is unchecked
        if (name === 'hasVariants' && !checked) {
            setBrandVariants([])
        }
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
                specifications: [
                    { id: Date.now() + 1, featureName: '', featureValue: '' }
                ]
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

    const handleAddSpecification = (groupId) => {
        setSpecificationGroups(prev =>
            prev.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          specifications: [
                              ...group.specifications,
                              { id: Date.now(), featureName: '', featureValue: '' }
                          ]
                      }
                    : group
            )
        )
    }

    const handleRemoveSpecification = (groupId, specId) => {
        setSpecificationGroups(prev =>
            prev.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          specifications: group.specifications.filter(spec => spec.id !== specId)
                      }
                    : group
            )
        )
    }

    const handleUpdateSpecification = (groupId, specId, field, value) => {
        setSpecificationGroups(prev =>
            prev.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          specifications: group.specifications.map(spec =>
                              spec.id === specId ? { ...spec, [field]: value } : spec
                          )
                      }
                    : group
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
                              { id: Date.now(), name: '', value: '' }
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

    const handleUpdateVariantSpec = (variantId, specId, field, value) => {
        setBrandVariants(prev =>
            prev.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          specifications: variant.specifications.map(spec =>
                              spec.id === specId ? { ...spec, [field]: value } : spec
                          )
                      }
                    : variant
            )
        )
    }

    const handleReset = () => {
        setFormData({
            title: '',
            isFeatured: true,
            category: '',
            selectedBrands: [],
            hasVariants: false,
            price: '',
            discount: '',
            stock: '',
            sku: '',
            status: 'Active'
        })
        setSpecificationGroups([])
        setBrandVariants([])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission here
        const submitData = {
            ...formData,
            specificationGroups,
            brandVariants: formData.hasVariants ? brandVariants : []
        }
        console.log('Form submitted:', submitData)
        router.push('/admin/products')
    }

    return (
        <div className="bg-white">
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 w-full">
                {/* Title Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter title"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Is Featured Checkbox */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                        Is Featured
                    </label>
                    {formData.isFeatured && (
                        <span className="text-sm text-gray-500">✔ Yes</span>
                    )}
                </div>

                {/* Category Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="">--Select any category--</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <ChevronDown 
                            size={20} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Select Brands */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Brands
                    </label>
                    <div className="space-y-2">
                        {brands.map((brand) => (
                            <div key={brand.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={`brand-${brand.id}`}
                                    checked={formData.selectedBrands.includes(brand.id)}
                                    onChange={() => handleBrandChange(brand.id)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor={`brand-${brand.id}`} className="text-sm text-gray-700">
                                    {brand.name}
                                </label>
                            </div>
                        ))}
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

                {/* Add Brand Variant Button - Show only when hasVariants is checked */}
                {formData.hasVariants && (
                    <div>
                        <button
                            type="button"
                            onClick={handleAddBrandVariant}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                        >
                            <Plus size={18} />
                            Add Brand Variant
                        </button>
                    </div>
                )}

                {/* Brand Variants Section */}
                {formData.hasVariants && brandVariants.map((variant, index) => (
                    <div key={variant.id} className="bg-gray-50 p-6 rounded-lg space-y-4">
                        {/* Variant Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Brand Variant {index + 1}
                            </h3>
                            <button
                                type="button"
                                onClick={() => handleRemoveBrandVariant(variant.id)}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                                title="Remove variant"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Brand Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand
                            </label>
                            <div className="relative">
                                <select
                                    value={variant.brand}
                                    onChange={(e) => handleUpdateBrandVariant(variant.id, 'brand', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                >
                                    <option value="">Choose Brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown 
                                    size={20} 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                />
                            </div>
                        </div>

                        {/* Attributes Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Attributes
                            </label>
                            <div className="space-y-3">
                                {variant.attributes.map((attr) => (
                                    <div key={attr.id} className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <select
                                                    value={attr.name}
                                                    onChange={(e) => handleUpdateVariantAttribute(variant.id, attr.id, 'name', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                                >
                                                    <option value="">Select Attribute</option>
                                                    {attributes.map((att) => (
                                                        <option key={att.id} value={att.name}>
                                                            {att.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown 
                                                    size={20} 
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="relative">
                                                <select
                                                    value={attr.value}
                                                    onChange={(e) => handleUpdateVariantAttribute(variant.id, attr.id, 'value', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                                    disabled={!attr.name}
                                                >
                                                    <option value="">Select Value</option>
                                                    {attributes
                                                        .find(a => a.name === attr.name)
                                                        ?.values.map((val, idx) => (
                                                            <option key={idx} value={val}>
                                                                {val}
                                                            </option>
                                                        ))}
                                                </select>
                                                <ChevronDown 
                                                    size={20} 
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVariantAttribute(variant.id, attr.id)}
                                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition mb-0.5"
                                            title="Remove attribute"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => handleAddVariantAttribute(variant.id)}
                                className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition text-sm"
                            >
                                <Plus size={16} />
                                Add Attribute
                            </button>
                        </div>

                        {/* Specifications Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specifications
                            </label>
                            <div className="space-y-3">
                                {variant.specifications.map((spec) => (
                                    <div key={spec.id} className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={spec.name}
                                                onChange={(e) => handleUpdateVariantSpec(variant.id, spec.id, 'name', e.target.value)}
                                                placeholder="Spec name"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={spec.value}
                                                onChange={(e) => handleUpdateVariantSpec(variant.id, spec.id, 'value', e.target.value)}
                                                placeholder="Spec value"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVariantSpec(variant.id, spec.id)}
                                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition mb-0.5"
                                            title="Remove specification"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => handleAddVariantSpec(variant.id)}
                                className="mt-3 flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition text-sm"
                            >
                                <Plus size={16} />
                                Add Spec
                            </button>
                        </div>

                        {/* Pricing and Stock Fields for Variant */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    value={variant.price}
                                    onChange={(e) => handleUpdateBrandVariant(variant.id, 'price', e.target.value)}
                                    placeholder="Enter price"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) => handleUpdateBrandVariant(variant.id, 'stock', e.target.value)}
                                    placeholder="Enter stock quantity"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    value={variant.sku}
                                    onChange={(e) => handleUpdateBrandVariant(variant.id, 'sku', e.target.value)}
                                    placeholder="Enter SKU"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Price, Discount, Stock, SKU Fields - Hide when hasVariants is true */}
                {!formData.hasVariants && (
                    <>
                        {/* Price Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Discount Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Stock Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                placeholder="Enter stock quantity"
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* SKU Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SKU
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                placeholder="Enter SKU"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </>
                )}

                {/* Specification Groups */}
                <div className="space-y-4">
                    {specificationGroups.map((group) => (
                        <div key={group.id} className="bg-white p-6">
                            {/* Group Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Group Label
                                    </label>
                                    <input
                                        type="text"
                                        value={group.groupLabel}
                                        onChange={(e) => handleUpdateGroupLabel(group.id, e.target.value)}
                                        placeholder="Enter group label"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSpecificationGroup(group.id)}
                                    className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition text-sm"
                                >
                                    Remove Group
                                </button>
                            </div>

                            {/* Specifications */}
                            <div className="space-y-3">
                                {group.specifications.map((spec) => (
                                    <div key={spec.id} className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Feature name
                                            </label>
                                            <input
                                                type="text"
                                                value={spec.featureName}
                                                onChange={(e) => handleUpdateSpecification(group.id, spec.id, 'featureName', e.target.value)}
                                                placeholder="Enter feature name"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Feature value
                                            </label>
                                            <input
                                                type="text"
                                                value={spec.featureValue}
                                                onChange={(e) => handleUpdateSpecification(group.id, spec.id, 'featureValue', e.target.value)}
                                                placeholder="Enter feature value"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSpecification(group.id, spec.id)}
                                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition mb-0.5"
                                            title="Remove specification"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Specification Button */}
                            <button
                                type="button"
                                onClick={() => handleAddSpecification(group.id)}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition text-sm"
                            >
                                <Plus size={16} />
                                Add Specification
                            </button>
                        </div>
                    ))}

                    {/* Add Specification Group Button */}
                    <button
                        type="button"
                        onClick={handleAddSpecificationGroup}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                    >
                        <Plus size={18} />
                        Add Specification Group
                    </button>
                </div>

                {/* Status Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown 
                            size={20} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

