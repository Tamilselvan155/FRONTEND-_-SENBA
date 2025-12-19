'use client';

import React, { useState, useEffect } from "react";
import { Filter, X, CheckSquare, Droplet, Gauge, Waves, Cpu, Package, ChevronDown } from "lucide-react";

export default function ProductFilters({ products, onFilterChange }) {
  const [selectedPipeSizes, setSelectedPipeSizes] = useState([]);
  const [selectedSpeeds, setSelectedSpeeds] = useState([]);
  const [selectedHeadRanges, setSelectedHeadRanges] = useState([]);
  const [selectedFlowRanges, setSelectedFlowRanges] = useState([]);
  const [selectedHPs, setSelectedHPs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(true);

  // Extract unique categories from products
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();

  // Extract unique options (with null checks)
  const uniquePipeSizes = [...new Set(products.flatMap(p => 
    (p.specs && Array.isArray(p.specs)) 
      ? p.specs.filter(s => s && s.label === "Pipe size").map(s => s.value).filter(Boolean)
      : []
  ))];
  const uniqueSpeeds = [...new Set(products.flatMap(p => 
    (p.specs && Array.isArray(p.specs)) 
      ? p.specs.filter(s => s && s.label === "Speed").map(s => s.value).filter(Boolean)
      : []
  ))];
  const uniqueHeadRanges = [...new Set(products.flatMap(p => 
    (p.specs && Array.isArray(p.specs)) 
      ? p.specs.filter(s => s && s.label === "Head range").map(s => s.value).filter(Boolean)
      : []
  ))];
  const uniqueFlowRanges = [...new Set(products.flatMap(p => 
    (p.specs && Array.isArray(p.specs)) 
      ? p.specs.filter(s => s && s.label === "Flow range").map(s => s.value).filter(Boolean)
      : []
  ))];
  const uniqueHPs = [...new Set(products.flatMap(p => (p.options && Array.isArray(p.options)) ? p.options : []))];

  // Active filter count
  const activeFilterCount = [
    selectedCategories.length,
    selectedPipeSizes.length,
    selectedSpeeds.length,
    selectedHeadRanges.length,
    selectedFlowRanges.length,
    selectedHPs.length,
    inStockOnly ? 1 : 0,
    outOfStockOnly ? 1 : 0,
    sortBy !== "default" ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  // Trigger parent filter update
  useEffect(() => {
    onFilterChange({
      selectedPipeSizes,
      selectedSpeeds,
      selectedHeadRanges,
      selectedFlowRanges,
      selectedHPs,
      selectedCategories,
      inStockOnly,
      outOfStockOnly,
      sortBy,
    });
  }, [selectedPipeSizes, selectedSpeeds, selectedHeadRanges, selectedFlowRanges, selectedHPs, selectedCategories, inStockOnly, outOfStockOnly, sortBy, onFilterChange]);

  // Prevent scroll behind overlay (mobile)
  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isFilterOpen]);

  // Handlers
  const toggleSelection = (value, setter) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const clearAll = () => {
    setSelectedPipeSizes([]);
    setSelectedSpeeds([]);
    setSelectedHeadRanges([]);
    setSelectedFlowRanges([]);
    setSelectedHPs([]);
    setSelectedCategories([]);
    setInStockOnly(false);
    setOutOfStockOnly(false);
    setSortBy("default");
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-3 sm:mb-4 w-full">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7C2A47] text-white hover:bg-[#6a243d] transition-all duration-200 rounded-lg shadow-sm font-medium text-sm w-full"
        >
          <Filter size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-white/20 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isFilterOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsFilterOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Unified Filter Container */}
      <div
        className={`
          ${isFilterOpen ? "block" : "hidden"} 
          lg:block fixed lg:static inset-y-0 left-0 lg:inset-auto
          z-50 lg:z-10 w-72 sm:w-80 lg:w-full max-w-sm lg:max-w-full
          bg-white lg:bg-transparent shadow-2xl lg:shadow-none 
          transition-transform duration-300 ease-in-out lg:translate-x-0 
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"} 
          h-full lg:h-auto overflow-y-auto lg:overflow-visible
        `}
      >
        {/* Inner Section - Scrollable on mobile */}
        <div className="flex flex-col h-full">
          {/* Header + Filters Together */}
          <div className="flex flex-col bg-white border-b border-gray-200 p-3 sm:p-4 lg:p-5 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Filter size={16} className="text-[#7C2A47] sm:w-[18px] sm:h-[18px]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 text-xs font-semibold text-white bg-[#7C2A47] rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs sm:text-sm font-medium text-[#7C2A47] hover:text-[#6a243d] transition-colors duration-200"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 md:hidden"
                  aria-label="Close filters"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Content - Scrollable on mobile */}
          <div className="px-3 sm:px-4 lg:px-5 pb-4 sm:pb-5 lg:pb-6 space-y-3 sm:space-y-4 lg:space-y-5 flex-1 overflow-y-auto">
            {/* Category */}
            {categories.length > 0 && (
              <div className="border-b border-gray-200 pb-4 pt-2">
                <button
                  onClick={() => setCategoryOpen(prev => !prev)}
                  className="flex justify-between items-center w-full font-semibold text-gray-900 text-sm mb-3 py-1 hover:text-[#7C2A47] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-[#7C2A47]" />
                    <span>Category</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      categoryOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {categoryOpen && (
                  <div className="space-y-1.5 text-sm">
                    {categories.map(category => {
                      const count = products.filter(p => p.category === category).length;
                      return (
                        <label key={category} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md cursor-pointer transition-colors duration-150">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => toggleSelection(category, setSelectedCategories)}
                              className="h-4 w-4 text-[#7C2A47] border-gray-300 rounded focus:ring-2 focus:ring-[#7C2A47] focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-gray-700 truncate">{category}</span>
                          </div>
                          <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Pipe Size */}
            {uniquePipeSizes.length > 0 && (
              <FilterGroup
                title="Pipe Size"
                icon={<Droplet size={18} className="text-[#f48638]" />}
                options={uniquePipeSizes}
                selected={selectedPipeSizes}
                toggle={(v) => toggleSelection(v, setSelectedPipeSizes)}
              />
            )}

            {/* Speed */}
            {uniqueSpeeds.length > 0 && (
              <FilterGroup
                title="Speed"
                icon={<Gauge size={18} className="text-[#f48638]" />}
                options={uniqueSpeeds}
                selected={selectedSpeeds}
                toggle={(v) => toggleSelection(v, setSelectedSpeeds)}
              />
            )}

            {/* Head Range */}
            {uniqueHeadRanges.length > 0 && (
              <FilterGroup
                title="Head Range"
                icon={<Waves size={18} className="text-[#f48638]" />}
                options={uniqueHeadRanges}
                selected={selectedHeadRanges}
                toggle={(v) => toggleSelection(v, setSelectedHeadRanges)}
              />
            )}

            {/* Flow Range */}
            {uniqueFlowRanges.length > 0 && (
              <FilterGroup
                title="Flow Range"
                icon={<Waves size={18} className="text-[#f48638]" />}
                options={uniqueFlowRanges}
                selected={selectedFlowRanges}
                toggle={(v) => toggleSelection(v, setSelectedFlowRanges)}
              />
            )}

            {/* HP Options */}
            {uniqueHPs.length > 0 && (
              <FilterGroup
                title="HP Options"
                icon={<Cpu size={18} className="text-[#f48638]" />}
                options={uniqueHPs}
                selected={selectedHPs}
                toggle={(v) => toggleSelection(v, setSelectedHPs)}
              />
            )}

            {/* Availability */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 text-sm mb-3">
                <CheckSquare size={18} className="text-[#7C2A47]" />
                <span>Availability</span>
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 hover:bg-gray-50 p-2 rounded-md cursor-pointer transition-colors duration-150 text-sm">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      if (e.target.checked) setOutOfStockOnly(false);
                    }}
                    className="h-4 w-4 text-[#7C2A47] border-gray-300 rounded focus:ring-2 focus:ring-[#7C2A47] focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-gray-700">In stock</span>
                </label>
                <label className="flex items-center gap-2.5 hover:bg-gray-50 p-2 rounded-md cursor-pointer transition-colors duration-150 text-sm">
                  <input
                    type="checkbox"
                    checked={outOfStockOnly}
                    onChange={(e) => {
                      setOutOfStockOnly(e.target.checked);
                      if (e.target.checked) setInStockOnly(false);
                    }}
                    className="h-4 w-4 text-[#7C2A47] border-gray-300 rounded focus:ring-2 focus:ring-[#7C2A47] focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-gray-700">Out of stock</span>
                </label>
              </div>
            </div>

            {/* Sort By */}
            <div className="pb-2">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 text-sm mb-3">
                <Filter size={18} className="text-[#7C2A47]" />
                <span>Sort By</span>
              </h3>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2A47] focus:border-[#7C2A47] bg-white text-sm text-gray-700 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-400"
                >
                  <option value="default">Best selling</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper reusable filter section
function FilterGroup({ title, icon, options, selected, toggle }) {
  const [isOpen, setIsOpen] = React.useState(true);
  
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex justify-between items-center w-full font-semibold text-gray-900 text-sm mb-3 py-1 hover:text-[#7C2A47] transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="space-y-1.5 text-sm">
          {options.map(opt => (
            <label
              key={opt}
              className="flex items-center gap-2.5 hover:bg-gray-50 p-2 rounded-md cursor-pointer transition-colors duration-150"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="h-4 w-4 text-[#7C2A47] border-gray-300 rounded focus:ring-2 focus:ring-[#7C2A47] focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}