// app/products/[id]/ProductScreen.tsx
"use client";

import { Suspense, lazy, memo, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

// Components
import { Breadcrumb } from "./ui/Breadcrumb";
import { EmptyState } from "@/components/EmptyProductState";

// Hooks
import { useRecentlyViewedProducts } from "@/hooks/useRecentlyViewedProducts";
import { useProductAnalytics } from "../hooks/useProductAnalytics";
import { useProductMetadata } from "../hooks/useProductMetadata";

// Config
import { NEXT_PUBLIC_SITE_NAME } from "@/config/env";
import { ProductHeroSection } from "./productHeroSection/ProductHeroSection";
import { ProductTabs } from "./productTabs/ProductTabs";
import { BackToTopButton } from "./BackToTopButton";
import { ProductTabsSkeleton } from "./productTabs/ProductTabsSkeleton";
import { AdaptedProduct } from "../types/adapted-product.types";

// Lazy load non-critical sections
const RelatedProducts = lazy(() =>
  import("./relatedProduct/RelatedProduct").then((mod) => ({
    default: mod.RelatedProducts,
  }))
);

const RecentlyViewed = lazy(() =>
  import("./recentlyViewed/RecentlyViewed").then((mod) => ({
    default: mod.RecentlyViewed,
  }))
);

interface ProductScreenProps {
  id: string;
  product: AdaptedProduct;
  priority?: boolean;
  prefetchRelated?: boolean;
  enableAnalytics?: boolean;
  onProductView?: (productId: string) => void;
}

export const ProductScreen = memo(function ProductScreen({
  product,
  id,
  priority = false,
  enableAnalytics = true,
  onProductView,
}: ProductScreenProps) {
  const router = useRouter();
  const { add: addRecentlyViewed, ids: recentlyViewedIds } =
    useRecentlyViewedProducts();
  const { trackProductView, trackProductImpression } = useProductAnalytics({
    enabled: enableAnalytics,
  });
  const { updateMetadata } = useProductMetadata();



  // Track recently viewed
  useEffect(() => {
    if (!id || !product || recentlyViewedIds.includes(id)) return;

    try {
      addRecentlyViewed(id);
    } catch (error) {
      console.error("Failed to add to recently viewed:", error);
    }
  }, [id, addRecentlyViewed, recentlyViewedIds, product]);

  // Analytics tracking
  useEffect(() => {
    if (!id || !product || !enableAnalytics) return;

    const trackView = async () => {
      try {
        await trackProductView({
          productId: id,
          productName: product.name,
          category: product.category,
          price: product.price.currency,
          timestamp: Date.now(),
        });
        onProductView?.(id);
      } catch (error) {
        console.error("Failed to track product view:", error);
      }
    };

    trackView();
    trackProductImpression(id);
  }, [id, product, enableAnalytics, trackProductView, trackProductImpression, onProductView]);

  // Update metadata
  useEffect(() => {
    if (!product) return;

    updateMetadata({
      title: `${product.name} | ${NEXT_PUBLIC_SITE_NAME || "Store"}`,
      description:
        product.description?.slice(0, 160) ||
        `Shop ${product.name} at the best prices`,
      keywords: product.category,
      canonicalUrl: `/product/${id}`,
      imageUrl: product.images?.[0]?.url,
      price: product.price?.current,
    });
  }, [product, id, updateMetadata]);

  // Handle product not found
  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="The product you're looking for may have been removed, is temporarily unavailable, or doesn't exist."
        action={{
          label: "Browse Products",
          onClick: () => router.push("/products"),
        }}
        secondaryAction={{
          label: "Go Home",
          onClick: () => router.push("/"),
        }}
        className="w-full py-20"
      />
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Accessibility: Skip to main content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>

        <main
          id="main-content"
          className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 mx-auto max-w-7xl"
        >
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
            <Breadcrumb product={product} />
          </nav>

          {/* Product Hero Section with Gallery and Sticky Purchase Panel */}
          <article aria-labelledby="product-title">
            <h1 id="product-title" className="sr-only">
              {product.name}
            </h1>

            <ProductHeroSection
              product={product}
              priority={priority}
              onAddToCart={() => {
                if (enableAnalytics) {
                  trackProductView({
                    productId: id,
                    productName: product.name,
                    action: "add_to_cart",
                  });
                }
              }}
            />
          </article>

          {/* Tabbed Content Area */}
          <section aria-label="Product details" className="mt-8 sm:mt-12">
            <Suspense fallback={<ProductTabsSkeleton />}>
              <ProductTabs
                product={product}
              />
            </Suspense>
          </section>

          {/* Related Products */}
          <section
            aria-labelledby="related-products-heading"
            className="mt-12 sm:mt-16"
          >
            <h2 id="related-products-heading" className="sr-only">
              Related Products
            </h2>
            <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 rounded-lg" />}>
              <RelatedProducts currentProductId={id} />
            </Suspense>
          </section>

          {/* Recently Viewed Products */}
          <section
            aria-labelledby="recently-viewed-heading"
            className="mt-12 sm:mt-16"
          >
            <h2 id="recently-viewed-heading" className="sr-only">
              Recently Viewed Products
            </h2>
            <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 rounded-lg" />}>
              <RecentlyViewed currentProductId={id} />
            </Suspense>
          </section>
        </main>

        {/* Back to Top Button */}
        <BackToTopButton />
      </div>
    </>
  );
});