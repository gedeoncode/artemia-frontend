"use client";

// import { ProductsGridSkeleton } from "@/domain/products/components/ui/ProductSkeleton";

import { ProductCard } from "@/domain/products/components/productCard/ProductCard";
import { useRecentlyViewedSection } from "../../hooks";
import { ErrorsAlert } from "@/components/error/ErrorsAlert";
import { CarouselSection } from "@/domain/products/components/productCaroussel";

export function RecentlyViewed({
  currentProductId,
}: {
  currentProductId: string;
}) {
  const { products, loading, error, refetch } =
    useRecentlyViewedSection(currentProductId);

  if (!loading && products.length === 0) return null;

  if (error) return <ErrorsAlert error={error} onRetry={refetch} />
  

  return (
    <CarouselSection
      title="Products you have recently viewed"
      items={products}
      renderItem={(product) => (
        <ProductCard key={product.id || product._id} product={product} />
      )}
    />
  );
}