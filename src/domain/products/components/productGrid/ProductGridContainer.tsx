"use client";

import { ProductGrid } from "./ProductGrid";
import { Category } from "@/types/category/category.types";

interface Product {
  _id: string;
  name: string;
  images: string[];
  category?: Category;
  price?: number;
}

interface Container {
  title: string;
  products: Product[];
}

interface Props {
  containers: Container[];
  title?: string;
  description?: string;
}

export function ProductGridContainer({
  containers,
  title,
  description,
}: Props) {
  if (containers.length === 0) {
    return (
      <section className="py-12 text-center">
        <p className="text-gray-500">No products available at this time.</p>
      </section>
    );
  }
  return (
    <section
      className="layout-space layout-container"
      aria-labelledby={title ? "container-section-title" : undefined}
    >
      {(title || description) && (
        <header className="text-center">
          {title && (
            <h2
              id="container-section-title"
              className="text-2xl font-bold text-gray-900 sm:text-3xl"
            >
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-2xl mx-auto mt-2 text-gray-600">
              {description}
            </p>
          )}
        </header>
      )}

      {/* Mobile: stacked enterprise cards */}
      <div className="flex flex-col gap-2 sm:hidden">
        {containers.map((container, i) => (
          <div
            key={`mobile-${i}`}
            className="overflow-hidden border border-white rounded-sm shadow-lg section-white"
          >
            <ProductGrid
              title={container.title}
              products={container.products}
            />
          </div>
        ))}
      </div>

      {/* Desktop Grid */}
      <div className="hidden gap-4 sm:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {containers.map((container, i) => (
          <div
            key={`desktop-${i}`}
            className="overflow-hidden bg-white rounded-sm shadow-xl"
          >
            <ProductGrid
              title={container.title}
              products={container.products}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
