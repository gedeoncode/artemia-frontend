"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { debounce } from "@/lib/utils/debounce";
import { validatePriceRange } from "../utils/";
import { DEBOUNCE_DELAY } from "../constants";

/** -------------------------
 *  Types
 * -------------------------- */

export interface FilterState {
  sortBy: string;
  minPrice: string;
  maxPrice: string;
}
export interface UseProductFiltersReturn {
  filters: FilterState;
  priceError: string;
  activeFilterCount: number;
  hasActiveFilters: boolean;
  handleFilterChange: (key: keyof FilterState, value: string) => void;
  handleSortChange: (value: string) => void;
  updateURLParams: (updates: Partial<FilterState>) => void;
  clearAllFilters: () => void;
}

/** -----------------------------------------
 * Utility: Build URLSearchParams safely
 * ------------------------------------------ */
function applyQueryUpdates(
  base: URLSearchParams,
  updates: Partial<FilterState>,
) {
  Object.entries(updates).forEach(([key, value]) => {
    if (value == null || value === "") base.delete(key);
    else base.set(key, value);
  });
  
  // Reset pagination anytime filters change
  base.delete("page");
  return base;
}

/** -----------------------------------------
 *  Main Hook (Enterprise Grade)
 * ------------------------------------------ */
export function useProductFilters(): UseProductFiltersReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialRender = useRef(true);
  /** -----------------------------------------
   * Extract initial state from URL params
   * ------------------------------------------ */
  const initialState = useMemo<FilterState>(() => {
    const sp = searchParams;
    return {
      sortBy: sp.get("sortBy") || "",
      minPrice: sp.get("minPrice") || "",
      maxPrice: sp.get("maxPrice") || "",
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterState>(initialState);
  const [priceError, setPriceError] = useState("");

  /** -----------------------------------------
   * Derived filter state
   * ------------------------------------------ */
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((v) => v !== "").length;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  /** -----------------------------------------
   * URL Sync Handler
   * ------------------------------------------ */
  const updateURLParams = useCallback(
    (updates: Partial<FilterState>) => {
      try {
        const params = new URLSearchParams(searchParams.toString());
        applyQueryUpdates(params, updates);
const nextUrl = `${pathname}?${params.toString()}`;
const currentUrl = `${pathname}?${searchParams.toString()}`;

if (nextUrl !== currentUrl) {
  router.push(nextUrl, { scroll: false });
}

      } catch (error) {
        console.error("URL update failed:", error);
      }
    },
    [router, searchParams],
  );

  /** -----------------------------------------
   * Debounced Price Validation & URL Sync
   * ------------------------------------------ */
const debouncedRef = useRef(
  debounce((min: string, max: string) => {
    const { isValid, error } = validatePriceRange(min, max);
    setPriceError(error);

    if (isValid && !initialRender.current) {
      updateURLParams({ minPrice: min, maxPrice: max });
    }

    initialRender.current = false;
  }, DEBOUNCE_DELAY)
);

const validateAndUpdatePrices = debouncedRef.current;

  // Cancel debounce on unmount
  useEffect(() => {
    return () => {
      validateAndUpdatePrices.cancel?.();
    };
  }, [validateAndUpdatePrices]);

  /** -----------------------------------------
   * Watch: minPrice / maxPrice → Validate & Update
   * ------------------------------------------ */
  useEffect(() => {
    validateAndUpdatePrices(filters.minPrice, filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice, validateAndUpdatePrices]);

  /** -----------------------------------------
   * Local Filter Update Handlers
   * ------------------------------------------ */
  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value.trim(), // enforce clean input
      }));
    },
    [],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      handleFilterChange("sortBy", value);
      updateURLParams({ sortBy: value });
    },
    [handleFilterChange, updateURLParams],
  );

  const clearAllFilters = useCallback(() => {
    setFilters({ sortBy: "", minPrice: "", maxPrice: "" });
    setPriceError("");

    router.push(pathname, { scroll: false });
  }, [router]);

  return {
    filters,
    priceError,
    activeFilterCount,
    hasActiveFilters,
    handleFilterChange,
    handleSortChange,
    updateURLParams,
    clearAllFilters,
  };
}
