'use client';

import React, { useState, useEffect } from "react";
import { categories } from "@/assets/assets";
import { Filter, X, CheckSquare, Droplet, Gauge, Waves, Cpu, Package } from "lucide-react";

export default function ProductFilters({ products, onFilterChange }) {
  const [selectedPipeSizes, setSelectedPipeSizes] = useState([]);
  const [selectedSpeeds, setSelectedSpeeds] = useState([]);
  const [selectedHeadRanges, setSelectedHeadRanges] = useState([]);
  const [selectedFlowRanges, setSelectedFlowRanges] = useState([]);
  const [selectedHPs, setSelectedHPs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(true);

  // Extract unique options
  const uniquePipeSizes = [...new Set(products.flatMap(p => p.specs.find(s => s.label === "Pipe size")?.value || []))];
  const uniqueSpeeds = [...new Set(products.flatMap(p => p.specs.find(s => s.label === "Speed")?.value || []))];
  const uniqueHeadRanges = [...new Set(products.flatMap(p => p.specs.find(s => s.label === "Head range")?.value || []))];
  const uniqueFlowRanges = [...new Set(products.flatMap(p => p.specs.find(s => s.label === "Flow range")?.value || []))];
  const uniqueHPs = [...new Set(products.flatMap(p => p.options || []))];

  // Active filter count
  const activeFilterCount = [
    selectedCategories.length,
    selectedPipeSizes.length,
    selectedSpeeds.length,
    selectedHeadRanges.length,
    selectedFlowRanges.length,
    selectedHPs.length,
    inStockOnly ? 1 : 0,
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
      sortBy,
    });
  }, [selectedPipeSizes, selectedSpeeds, selectedHeadRanges, selectedFlowRanges, selectedHPs, selectedCategories, inStockOnly, sortBy, onFilterChange]);

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
    setSortBy("default");
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="p-2 bg-[#c31e5aff] text-white hover:bg-[#a81a4d] transition rounded-md"
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Unified Filter Container */}
      <div
        className={`
          ${isFilterOpen ? "block" : "hidden"} 
          md:block fixed md:static inset-y-0 left-0 md:inset-auto bg-white 
          z-50 md:z-10 w-4/5 md:w-[300px] shadow-2xl md:shadow-md 
          transition-transform duration-300 ease-in-out md:translate-x-0 
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"} 
          md:rounded-2xl md:sticky md:top-[80px] overflow-hidden
        `}
      >
        {/* Inner Scrollable Section */}
        <div className="flex flex-col h-full max-h-screen md:max-h-[calc(100vh-80px)]">
          {/* Header + Filters Together */}
          <div className="flex flex-col bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 sm:p-5 sticky top-0 z-20">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-[#c31e5aff]" />
                <h2 className="text-lg font-bold text-[#c31e5aff]">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-[#c31e5aff] rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearAll}
                  className="text-sm font-semibold hover:underline"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition md:hidden"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Filter Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {/* Category */}
            {categories.length > 0 && (
              <div className="border-b border-gray-200 pb-2 mt-4 sm:mt-4">
                <button
                  onClick={() => setCategoryOpen(prev => !prev)}
                  className="flex justify-between items-center w-full font-semibold text-gray-800 text-sm mb-2"
                >
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-[#f48638]" />
                    Category
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
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
                  <div className="space-y-2 text-sm">
                    {categories.map(category => {
                      const count = products.filter(p => p.category === category).length;
                      return (
                        <label key={category} className="flex items-center justify-between hover:bg-blue-50 p-2 rounded-lg cursor-pointer transition">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => toggleSelection(category, setSelectedCategories)}
                              className="h-4 w-4 text-[#f48638] border-gray-300 rounded focus:ring-[#f48638]"
                            />
                            <span className="text-gray-700">{category}</span>
                          </div>
                          <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
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
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-2">
                <CheckSquare size={18} className="text-[#f48638]" />
                Availability
              </h3>
              <label className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded-lg cursor-pointer transition text-sm">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-4 w-4 text-[#f48638] border-gray-300 rounded focus:ring-[#f48638]"
                />
                <span className="text-gray-700">In Stock Only</span>
              </label>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-2">
                <Filter size={18} className="text-[#f48638]" />
                Sort By
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f48638] bg-white text-sm"
              >
                <option value="default">Default</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper reusable filter section
function FilterGroup({ title, icon, options, selected, toggle }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-2">
        {icon}
        {title}
      </h3>
      <div className="space-y-2 text-sm">
        {options.map(opt => (
          <label
            key={opt}
            className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded-lg cursor-pointer transition"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="h-4 w-4 text-[#f48638] border-gray-300 rounded focus:ring-[#f48638]"
            />
            <span className="text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}