"use client";

import { Product } from "@/types/product/product.types";
import { ProductGridCard } from "./ProductGridCard";

interface ProductGridSectionProps {
  title: string;
  products: Product[];
  maxMobileItems?: number;
  maxDesktopItems?: number;
}

export function ProductGrid({
  title,
  products = [],
  maxMobileItems = 6,
  maxDesktopItems = 4,
}: ProductGridSectionProps) {
  const hasProducts = products.length > 0;

  if (!hasProducts) {
    return (
      <section
        aria-label={`${title} empty product list`}
        className="flex flex-col h-full p-4 border rounded-sm border-white-100 section-white"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center justify-center flex-1 text-slate-500">
          No products available
        </div>
      </section>
    );
  }

  return (
    <section
      className="flex flex-col h-full p-2 lg:p-4"
      aria-label={`${title} product list`}
    >
      <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>

      {/* Mobile Grid */}
      <ul className="grid grid-cols-2 gap-2 sm:hidden">
        {products.slice(0, maxMobileItems).map((product) => (
          <ProductGridCard
            key={product._id}
            product={product}
            variant="mobile"
          />
        ))}
      </ul>

      {/* Desktop Grid */}
      <ul className="hidden grid-cols-2 gap-2 sm:grid">
        {products.slice(0, maxDesktopItems).map((product) => (
          <ProductGridCard
            key={product._id}
            product={product}
            variant="desktop"
          />
        ))}
      </ul>
    </section>
  );
}
