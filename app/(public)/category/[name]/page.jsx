// app/category/[name]/page.jsx
'use client';

import React from "react";
import { useParams } from "next/navigation";
import CategoryProducts from "@/components/Categoryproducts";
import CategoryProductsFilter from "@/components/CategoryProductsFilter";

export default function CategoryPage() {
  const { name } = useParams();

  return (
    <div>
      {/* Pass category name to the reusable component */}
      {name=="products" ? <CategoryProductsFilter categoryName={name.replaceAll("%20","")}/>:<CategoryProducts categoryName={name.replaceAll("%20","")} />}
      
    </div>
  );
}
