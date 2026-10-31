"use client";

import { ProductCard } from "@/domain/products/components/productCard";
import { ProductsGridSkeleton } from "@/domain/products/components/ui/ProductSkeleton";
import { CarouselSection } from "@/domain/products/components/productCaroussel";
import { useRelatedProducts } from "../../hooks/";

export function RelatedProducts({
  currentProductId,
}: {
  currentProductId: string;
}) {
  const { products, loading, error } =
    useRelatedProducts(currentProductId);

  if (!loading && products.length === 0) return null;

  return (
    <div className="mt-12">
      {loading ? (
        <ProductsGridSkeleton count={6} />
      ) : error ? (
        <p>Failed to load related products.</p>
      ) : (
        <CarouselSection
          title="Products related to this item"
          items={products}
          renderItem={(item) => (
            <ProductCard key={item._id} product={item} />
          )}
        />
      )}
    </div>
  );
}