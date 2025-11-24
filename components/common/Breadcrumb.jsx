'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter((x) => x);

  // Custom labels for routes
  const routeLabels = {
    'admin': 'Admin',
    'dashboard': 'Dashboard',
    'products': 'Products',
    'categories': 'Categories',
    'category': 'Category',
    'brands': 'Brands',
    'banners': 'Banners',
    'attributes': 'Attributes',
    'attribute': 'Attribute',
    'attribute-value': 'Attribute Value',
    'attribute-values': 'Attribute Values',
    'stores': 'Stores',
    'coupons': 'Coupons',
    'add': 'Add',
    'edit': 'Edit',
  };

  return (
    <nav className="flex bg-gray-50 px-3 py-2 rounded-lg" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {/* Home Icon */}
        <li>
          <Link
            href="/admin"
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
            title="Go to Dashboard"
          >
            <Home className="w-5 h-5" />
          </Link>
        </li>

        {/* Dynamic breadcrumbs */}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = routeLabels[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <li key={to} className="flex items-center">
              {/* Separator */}
              <svg
                className="w-4 h-4 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              
              {/* Breadcrumb Item */}
              {isLast ? (
                <span className="text-sm font-semibold text-blue-600 px-2 py-1 bg-blue-50 rounded">
                  {label}
                </span>
              ) : (
                <Link
                  href={to}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;


