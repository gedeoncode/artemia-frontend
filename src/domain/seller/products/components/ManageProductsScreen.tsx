// @/domain/manage-products/components/ManageProductsScreen.tsx
"use client";

import { useCallback, useTransition } from "react";

import { useManageProducts } from "../hooks/useManageProducts";
import { ProductFilters } from "./ProductFilters";
import { BulkActions } from "./BulkActions";
import { ProductTable } from "./ProductTable/ProductTable";
import { Pagination } from "@/components/Pagination";

import { ProductFilterParams, SortField } from "../types/filter.types";

interface ManageProductsScreenProps {
  initialFilterParams: ProductFilterParams;
}

export function ManageProductsScreen({
  initialFilterParams,
}: ManageProductsScreenProps) {
  const [isPending, startTransition] = useTransition();

  const {
    products,
    isLoading,
    isFetching,
    isDeleting,
    error,
    selectedProductIds,
    filterParams,
    setFilterParams,
    clearFilters,
    handleBulkAction,
    handleDelete,
    handleAdd,
    handleEdit,
    toggleProductSelection,
    selectAllProducts,
    pagination,
    clearSelection,
    isAllSelected,
    isPartiallySelected,
    canRestore,
    canArchive,
    deleteError,
    isBulkLoading,
    bulkError,
    hasProductsInCatalog,
    hasActiveFilters,
  } = useManageProducts({
    initialFilterParams,
  });

  const handleSort = useCallback(
    (field: string) => {
      startTransition(() => {
        setFilterParams((prev) => ({
          ...prev,
          sort: field as SortField,
          order: prev.sort === field && prev.order === "asc" ? "desc" : "asc",
          page: 1,
        }));
      });
    },
    [setFilterParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      startTransition(() => {
        setFilterParams((prev) => ({ ...prev, page }));
      });
    },
    [setFilterParams],
  );

  return (
    <div className="px-4 py-4 space-y-4 sm:px-6 sm:py-6 sm:space-y-6 lg:px-8">
      {/* Header Section */}
      <header className="space-y-1 sm:space-y-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Manage Products
        </h1>
        <p className="text-xs text-gray-600 sm:text-sm">
          View, edit, and manage your product listings efficiently.
        </p>
      </header>

      {/*  Only show when sufficient products exist */}
      <div className="space-y-4">
        {hasProductsInCatalog &&(
          <ProductFilters
            params={filterParams}
            onParamsChange={setFilterParams}
            isLoading={isLoading}
          />
        )}
        {selectedProductIds.length > 0 && (
          <BulkActions
            selectedCount={selectedProductIds.length}
            totalCount={products.length}
            isAllSelected={isAllSelected}
            isPartiallySelected={isPartiallySelected}
            onSelectAll={selectAllProducts}
            onDeselectAll={clearSelection}
            onBulkAction={handleBulkAction}
            onAddNewProduct={handleAdd}
            isLoading={isBulkLoading}
            error={bulkError}
            canRestore={canRestore}
            canArchive={canArchive}
          />
        )}
      </div>

      {/* Product Table Section */}
      <div className="overflow-x-auto">
        <ProductTable
          products={products}
          selectedProductIds={selectedProductIds}
          onSelect={toggleProductSelection}
          onSelectAll={selectAllProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNewProduct={handleAdd}
          onClearFilters={clearFilters}
          onSort={handleSort}
          sortConfig={{
            field: filterParams.sort,
            order: filterParams.order,
          }}
          isDeleting={isDeleting}
          deletingError={deleteError}
          isLoading={isLoading}
          isFetching={isPending || isFetching}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Pagination Section */}
      {hasProductsInCatalog && pagination.pages > 1 && (
        <div className="py-2 sm:py-0">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
