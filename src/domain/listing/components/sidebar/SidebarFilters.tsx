"use client";

import { useEffect, useRef } from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import { FilterSection } from "./";
import { PriceInput } from "../ui";
import { useProductFilters } from "../../hooks/useProductFilters";
import { SORT_OPTIONS } from "../../constants";
import { Button } from "@/components/ui";

interface SidebarFiltersProps {
  className?: string;
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (isOpen: boolean) => void;
}

export function SidebarFilters({
  className = "",
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
}: SidebarFiltersProps) {
  const {
    filters,
    priceError,
    activeFilterCount,
    hasActiveFilters,
    handleFilterChange,
    handleSortChange,
    clearAllFilters,
  } = useProductFilters();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const closeMobileFilters = () => {
    setIsMobileFiltersOpen(false);
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileFiltersOpen) {
        closeMobileFilters();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileFiltersOpen]);

  useEffect(() => {
    if (isMobileFiltersOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      const firstFocusableElement = sidebarRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement | null;
      firstFocusableElement?.focus();
    }
  }, [isMobileFiltersOpen]);

  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFiltersOpen]);

  const applyRange = (range: { min: number; max?: number }) => {
    handleFilterChange("minPrice", range.min.toString());
    if (range.max !== undefined) {
      handleFilterChange("maxPrice", range.max.toString());
    }
  };

  const quickRanges = [
    { label: "Moins de 50$", min: 0, max: 50 },
    { label: "50$ - 100$", min: 50, max: 100 },
    { label: "100$ - 200$", min: 100, max: 200 },
    { label: "Plus de 200$", min: 200 },
  ];

  return (
    <>
      {isMobileFiltersOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobileFilters}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[90vw] lg:w-[280px] bg-white 
          p-4 lg:p-3 overflow-y-auto shadow-xl transform transition-all duration-300
          lg:relative lg:w-full lg:p-0 lg:shadow-none lg:translate-x-0 lg:bg-transparent
          ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${className}
        `}
        aria-label="Filtres des produits"
        aria-hidden={!isMobileFiltersOpen}
        aria-modal={isMobileFiltersOpen}
        role="dialog"
      >
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-200 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary-50">
              <Filter className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
              {hasActiveFilters && (
                <p className="text-sm text-gray-500">
                  {activeFilterCount} actif
                </p>
              )}
            </div>
          </div>

          <button
            onClick={closeMobileFilters}
            className="p-1.5 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="items-center justify-between hidden mb-4 lg:flex">
          <h3 className="text-lg font-semibold text-gray-900">
            Filtres
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-sm text-primary-600"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        <div className="space-y-5">
          <FilterSection title="Prix">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-1.5">
                {quickRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => applyRange(range)}
                    className="px-2 py-1.5 text-sm border rounded-md"
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={10}
                  value={filters.minPrice || 0}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="w-full h-1.5"
                />

                <input
                  type="range"
                  min={0}
                  max={500}
                  step={10}
                  value={filters.maxPrice || 500}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="w-full h-1.5"
                />
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>{filters.minPrice || 0}$</span>
                <span>{filters.maxPrice || 500}$</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <PriceInput
                  id="minPrice"
                  label="Min"
                  value={filters.minPrice}
                  onChange={(v) => handleFilterChange("minPrice", v)}
                />
                <PriceInput
                  id="maxPrice"
                  label="Max"
                  value={filters.maxPrice}
                  onChange={(v) => handleFilterChange("maxPrice", v)}
                />
              </div>
            </div>

            {priceError && (
              <div className="mt-2 text-sm text-red-600">
                {priceError}
              </div>
            )}
          </FilterSection>

          <FilterSection title="Tri">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full py-2.5 px-3 text-sm border rounded-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterSection>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm" 
              onClick={clearAllFilters}
              className="hidden w-full text-sm  lg:block"
            >
              Réinitialiser
            </Button>
          )}
        </div>

        <div className="pt-4 mt-6 border-t lg:hidden">
          <button
            onClick={closeMobileFilters}
            className="w-full py-2 text-sm font-medium text-white bg-primary-600 rounded-md"
          >
            Voir ({activeFilterCount})
          </button>
        </div>
      </aside>
    </>
  );
}
