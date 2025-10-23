'use client';

import React, { useState, useEffect } from "react";
import { productDummyData } from "@/assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Send } from "lucide-react";
import ModalPopup from "./PopupModel";
import ProductFilters from "./ProductFilters";

export default function CategoryProductsFilter({ categoryName }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Filter products by category (only if categoryName is 'products', otherwise use URL category)
  let products =
    categoryName === "products"
      ? productDummyData
      : productDummyData.filter(
          (product) => product.category.toLowerCase() === categoryName.toLowerCase()
        );

  // Apply filters and sorting
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
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
        p.specs.some(
          (spec) => spec.label === "Pipe size" && filters.selectedPipeSizes.includes(spec.value)
        )
      );
    }

    // Apply speed filter
    if (filters.selectedSpeeds.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.specs.some(
          (spec) => spec.label === "Speed" && filters.selectedSpeeds.includes(spec.value)
        )
      );
    }

    // Apply head range filter
    if (filters.selectedHeadRanges.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.specs.some(
          (spec) => spec.label === "Head range" && filters.selectedHeadRanges.includes(spec.value)
        )
      );
    }

    // Apply flow range filter
    if (filters.selectedFlowRanges.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.specs.some(
          (spec) => spec.label === "Flow range" && filters.selectedFlowRanges.includes(spec.value)
        )
      );
    }

    // Apply HP filter
    if (filters.selectedHPs.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        p.options.some((opt) => filters.selectedHPs.includes(opt))
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
          const avgA = a.rating.reduce((sum, r) => sum + r.rating, 0) / a.rating.length || 0;
          const avgB = b.rating.reduce((sum, r) => sum + r.rating, 0) / b.rating.length || 0;
          return avgB - avgA;
        });
        break;
      default:
        break;
    }

    setFilteredProducts(updatedProducts);
  }, [filters, categoryName]);

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
          {filteredProducts.length > 0 ? (
            <>
              {filteredProducts.map((product, index) => (
                 <div
              key={index}
              className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-10 mt-6 sm:mt-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Image Section */}
                <div className="flex justify-center">
                  <Link href={`/product/${product.id}`} className="w-[300px] h-[400px] sm:w-[330px] sm:h-[440px]">
                  <div className="p-4 rounded-xl w-full sm:w-auto flex justify-center">
                    <img
                      src={product.images?.[0]?.src || product.images?.[0]}
                      alt={product.name}
                      className="mt-4 sm:mt-0 rounded-xl w-full h-full object-contain"
                    />
                  </div>
                  </Link>
                </div>

                {/* Content Section */}
                <div className="md:col-span-2 space-y-4 sm:space-y-5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center md:text-left">
                    <Link href={`/product/${product.id}`} className="w-full h-full">
                    {product.name}
                    </Link>
                  </h1>
                  <p className="text-gray-600 text-center md:text-left">{product.description}</p>

                  {/* Options */}
                  <div>
                    <h2 className="font-semibold text-gray-800 mb-2 text-center md:text-left">
                      Available Options:
                    </h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      {product.options.map((opt, i) => (
                        <button
                          key={i}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-[#c31e5aff] hover:text-white hover:border-[#c31e5aff] transition text-sm sm:text-base"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
                    <h2 className="font-semibold text-gray-800  mb-3 text-center md:text-left">
                      Technical Specifications:
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-700">
                      {product.specs.map((item, i) => (
                        <Spec key={i} label={item.label} value={item.value} />
                      ))}
                    </div>
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
