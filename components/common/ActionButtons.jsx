'use client'

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';



const ActionButtons = ({ moduleType, onAdd }) => {
  const router = useRouter();
  const pathname = usePathname();

  const getModuleName = (type) => {
    const names = {
      'products': 'Product',
      'categories': 'Category',
      'brands': 'Brand',
      'banners': 'Banner',
      'attributes': 'Attribute',
      'attribute-values': 'Attribute Value',
      'stores': 'Store',
      'coupons': 'Coupon',
    };
    return names[type] || 'Item';
  };

  const moduleName = getModuleName(moduleType);

  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    } else {
      // Default: navigate to add page
      const addRoutes = {
        'products': '/admin/products/add',
        'categories': '/admin/category/add',
        'brands': '/admin/brands/add',
        'banners': '/admin/banners/add',
        'attributes': '/admin/attribute/add',
        'attribute-values': '/admin/attribute-value/add',
      };
      const route = addRoutes[moduleType] || `/admin/${moduleType}/add`;
      router.push(route);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Add Button */}
      <button
        onClick={handleAdd}
        className="flex items-center text-sm space-x-2 px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition-colors duration-200 shadow-sm hover:shadow-md font-medium cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Add</span>
      </button>
    </div>
  );
};

export default ActionButtons;


