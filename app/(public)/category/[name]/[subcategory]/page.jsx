'use client';

import CategoryProducts from "@/components/Categoryproducts";
import { useParams } from "next/navigation";

export default function SubCategoryPage() {
  const { name, subcategory } = useParams();
  console.log(name,subcategory);
  return <CategoryProducts categoryName={name} subCategoryName={subcategory.replaceAll("%20"," ")} />;
}