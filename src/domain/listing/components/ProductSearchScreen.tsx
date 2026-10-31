"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import { PRODUCTS_COUNT } from "@/constants/counts";
import { SidebarFilters } from "./sidebar";
import { ResultsHeader } from "./ui/";
import { fetchListingProductsClient } from "../services";
import { SearchParams, SearchListingProductResponse } from "../types";
import { ProductsGridSkeleton, ProductList } from "@/domain";

const LIMIT = 12;
type Props = {
  searchParams: SearchParams; 
  initialData: SearchListingProductResponse;
};

export function ProductSearchScreen({ searchParams, initialData }: Props) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Data
  const [products, setProducts] = useState(initialData.data);
  const [total, setTotal] = useState(initialData.meta.total);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(Number(searchParams.page) || 1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const canLoadMore = products.length < total;

  const firstLoad = useRef(true);

  /**
   * Refetch on search/filter changes
   */
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    const reload = async () => {
      setIsLoading(true);

      const { data, meta } = await fetchListingProductsClient({
        ...searchParams,
        page: "1",
        limit: String(LIMIT),
      });

      setProducts(data);
      setTotal(meta.total);
      setPage(1);
      setIsLoading(false);
    };

    reload();
  }, [
    searchParams.category,
    searchParams.sortBy,
    searchParams.minPrice,
    searchParams.maxPrice,
  ]);

  /**
   * Infinite scroll loader
   */
  const loadMore = useCallback(async () => {
    if (isFetchingMore || !canLoadMore) return;

    const nextPage = page + 1;
    setIsFetchingMore(true);

    const { data } = await fetchListingProductsClient({
      ...searchParams,
      page: String(nextPage),
      limit: String(LIMIT),
    });

    setProducts((prev) => [...prev, ...data]);
    setPage(nextPage);
    setIsFetchingMore(false);
  }, [page, searchParams, isFetchingMore, canLoadMore]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="pb-16 ">
      {/* Header */}
     <ResultsHeader
  page={page}
  limit={LIMIT}
  total={total}
  query={searchParams.query || searchParams.category}
  onOpenFilters={() => setIsMobileFiltersOpen(true)}
/>
<div className="layout-container">
      <div className="grid grid-cols-1 gap-0 md:grid-cols-[280px_1fr]">
        <aside className="sticky top-0 hidden h-fit md:block">
          <SidebarFilters
            isMobileFiltersOpen={isMobileFiltersOpen}
            setIsMobileFiltersOpen={setIsMobileFiltersOpen}
          />
        </aside>

        <section className="relative">
          {isLoading ? <ProductsGridSkeleton count={PRODUCTS_COUNT}/>
          :<ProductList products={products} />}

          {canLoadMore && (
            <div
              ref={sentinelRef}
            >
              {isFetchingMore && (
                 <ProductsGridSkeleton count={PRODUCTS_COUNT}/>
              )}
            </div>
          )}
        </section>
      </div>

      {isMobileFiltersOpen && (
        <SidebarFilters
          isMobileFiltersOpen={isMobileFiltersOpen}
          setIsMobileFiltersOpen={setIsMobileFiltersOpen}
        />
      )}
    </div>
    </div>
  );
}
