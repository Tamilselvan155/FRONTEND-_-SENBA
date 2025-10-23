'use client';
import Title from './Title';
import ProductCard from './ProductCard';
import { useSelector } from 'react-redux';
import React from 'react';
const BestSelling = () => {
  const products = useSelector((state) => state.product.list);
  const categories = [...new Set(products.map((p) => p.category))];

  const groupedProducts = categories.map((category) => ({
    category,
    items: products.filter((p) => p.category === category),
  }));

  return (
    <div className="px-4 sm:px-6 my-20 max-w-7xl mx-auto">
      <h2 className="text-[22px] font-bold text-gray-800 mb-5 sm:text-2xl sm:mb-10">Best Selling Products</h2>

      {groupedProducts.map((group, index) => (
        <div key={index} className="mb-16">
          {/* Category Title */}
          <Title title={group.category} href={`/category/${group.category}`} />

          {/* Responsive Product Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {group.items.map((product, i) => {
              const total = group.items.length;
              const isLastRow = i >= total - (total % 4 || 4); // last row detection

              return (
                <React.Fragment key={i}>
                  <ProductCard product={product} />

                  {/* Desktop line after every 4 items, except the last row */}
                  {(i + 1) % 4 === 0 && !isLastRow && (
                    <div className="hidden lg:block col-span-4">
                      <hr className="border-t border-gray-300 my-8" />
                    </div>
                  )}

                  {/* Tablet line after every 2 items, except the last row */}
                  {(i + 1) % 2 === 0 && i < total - 2 && (
                    <div className="hidden sm:block lg:hidden col-span-2">
                      <hr className="border-t border-gray-300 my-6" />
                    </div>
                  )}

                  {/* Mobile line between single-column rows (optional) */}
                  {(i + 1) % 1 === 0 && i < total - 1 && (
                    <div className="block sm:hidden col-span-1">
                      <hr className="border-t border-gray-300 my-4" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BestSelling;
