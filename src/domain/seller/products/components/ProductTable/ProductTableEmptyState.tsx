// @/domain/manage-products/components/ProductTable/ProductTableEmptyState.tsx

"use client";

import { Button } from "@/components/ui";
import { PackageSearch, Plus, RotateCcw } from "lucide-react";

interface ProductTableEmptyStateProps {
  hasFilters?: boolean;
  onAddProduct?: () => void;
  onClearFilters?: () => void;
}

export function ProductTableEmptyState({
  hasFilters = false,
  onAddProduct,
  onClearFilters,
}: ProductTableEmptyStateProps) {
  const isFilteredState = hasFilters;

  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <PackageSearch className="h-8 w-8 text-gray-500" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900">
        {isFilteredState ? "No matching products found" : "No products yet"}
      </h3>

      {/* Description */}
      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        {isFilteredState
          ? "No products match the current filters. Try adjusting your search criteria or clear the filters to see more results."
          : "Your product catalog is empty. Add your first product to start selling and managing inventory."}
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {isFilteredState ? (
          <>
            {onClearFilters && (
              <Button
                variant="outline"
                type="button"
                onClick={onClearFilters}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                Clear Filters
              </Button>
            )}

            {onAddProduct && (
              <Button
                type="button"
                onClick={onAddProduct}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Product
              </Button>
            )}
          </>
        ) : (
          <>
            {onAddProduct && (
              <Button
                type="button"
                onClick={onAddProduct}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Your First Product
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
