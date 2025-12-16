// app/category/[name]/page.jsx
'use client';

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import CategoryProducts from "@/components/Categoryproducts";
import CategoryProductsFilter from "@/components/CategoryProductsFilter";

export default function CategoryPage() {
  const { name } = useParams();
  const searchParams = useSearchParams();

  // Decode URL parameter (handles %20 for spaces and other encoded characters)
  const decodedCategoryName = decodeURIComponent(name || "");
  
  // Get category from query params if available
  const categoryFromQuery = searchParams.get('category');
  const subcategoryFromQuery = searchParams.get('subcategory');

  // If category is in query params, always use CategoryProductsFilter
  // Otherwise, use the old behavior for backward compatibility
  if (decodedCategoryName === "products" || categoryFromQuery) {
    return (
      <CategoryProductsFilter 
        categoryName={categoryFromQuery || decodedCategoryName}
        subCategoryName={subcategoryFromQuery}
      />
    );
  }

  // For old category routes, redirect to products page with category filter
  return (
    <CategoryProducts categoryName={decodedCategoryName} />
  );
}
