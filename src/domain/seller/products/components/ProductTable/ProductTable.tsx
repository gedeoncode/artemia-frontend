"use client";

import { useCallback, useState, useTransition } from "react";

import { ProductTableHeader } from "./ProductTableHeader";
import { ProductTableToolbar } from "./Toolbar";
import { ProductTableLoadingOverlay } from "./ProductTableLoadingOverlay";
import { ProductTableEmptyState } from "./ProductTableEmptyState";
import { MobileProductCard } from "./MobileProductCard";

import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { ProductTableSkeleton } from "../ui/ProductTableSkeleton";

import type { Product } from "@/domain/seller/products/types/product.types";
import type { SortConfig } from "../../types/filter.types";
import { ProductRow } from "./ProductRow";
import { useComingSoon } from "@/context/ComingSoonProvider";

interface ProductTableProps {
  products: Product[];

  selectedProductIds: string[];

  onSelect: (id: string) => void;

  onSelectAll: (select: boolean) => void;

  isAllSelected: boolean;

  isPartiallySelected: boolean;

  onEdit: (id: string) => Promise<void>;

  onDelete: (id: string) => Promise<boolean>;
  onAddNewProduct: () => void;

  onSort: (field: string) => void;

  sortConfig: SortConfig;

  isDeleting?: boolean;

  deletingError?: Error | null;

  isLoading?: boolean;
  isFetching?: boolean;

  totalProducts?: number;

  hasActiveFilters?: boolean;

  onClearFilters?: () => void;
}

export function ProductTable({
  products,
  selectedProductIds,

  onSelect,
  onSelectAll,

  isAllSelected,
  isPartiallySelected,

  // onEdit,
  onDelete,
  onAddNewProduct,

  onSort,

  sortConfig,

  isDeleting,
  deletingError,

  isLoading,
  isFetching,

  totalProducts = 0,

  hasActiveFilters = false,

  onClearFilters,
}: ProductTableProps) {
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { showComingSoon } = useComingSoon();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [isDeletingProduct, startDeleteTransition] = useTransition();

  const hasProducts = products.length > 0;

  const selectedCount = selectedProductIds.length;

  const handleEditRequest = useCallback(
    (id: string) => {
      showComingSoon("Product Editing");
    },
    [showComingSoon],
  );
  const handleDeleteRequest = useCallback(
    (id: string) => {
      const product = products.find((p) => p._id === id);

      if (!product) return;

      setProductToDelete(product);
      setDialogOpen(true);
    },
    [products],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!productToDelete) return;

    startDeleteTransition(async () => {
      await onDelete(productToDelete._id);

      setDialogOpen(false);
      setProductToDelete(null);
    });
  }, [onDelete, productToDelete]);

  const handleSelectAll = useCallback(() => {
    onSelectAll(!isAllSelected);
  }, [onSelectAll, isAllSelected]);

  const isRefreshing = isFetching || isLoading;

  return (
    <>
      <section
        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
        aria-label="Products inventory table"
      >
        <ProductTableToolbar
          totalProducts={totalProducts}
          visibleProducts={products.length}
          selectedCount={selectedCount}
        />

        <div className="relative">
          {isLoading && <ProductTableLoadingOverlay />}

          {/* MOBILE */}

          <div className="md:hidden divide-y">
            {hasProducts ? (
              products.map((product) => (
                <MobileProductCard
                  key={product._id}
                  product={product}
                  isSelected={selectedProductIds.includes(product._id)}
                  onSelect={onSelect}
                  onEdit={handleEditRequest}
                  onDelete={handleDeleteRequest}
                  isDeleting={isDeletingProduct}
                />
              ))
            ) : (
              <ProductTableEmptyState
                hasFilters={hasActiveFilters}
                onAddProduct={onAddNewProduct}
                onClearFilters={onClearFilters}
              />
            )}
          </div>

          {/* DESKTOP */}

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <ProductTableHeader
                sortConfig={sortConfig}
                onSort={onSort}
                onSelectAll={handleSelectAll}
                isAllSelected={isAllSelected}
                isPartiallySelected={isPartiallySelected}
              />
              <tbody>
                {isRefreshing ? (
                  <tr>
                    <td colSpan={8}>
                      <ProductTableSkeleton showHeader={false} />
                    </td>
                  </tr>
                ) : hasProducts ? (
                  products.map((product) => (
                    <ProductRow
                      key={product._id}
                      product={product}
                      isSelected={selectedProductIds.includes(product._id)}
                      onSelect={onSelect}
                      onEdit={handleEditRequest}
                      onDelete={handleDeleteRequest}
                      isDeleting={isDeletingProduct}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <ProductTableEmptyState
                        hasFilters={hasActiveFilters}
                        onAddProduct={onAddNewProduct}
                        onClearFilters={onClearFilters}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {deletingError && (
          <div className="border-t bg-red-50 p-4">
            <p className="text-sm text-red-700">{deletingError.message}</p>
          </div>
        )}
      </section>

      <ConfirmationDialog
        isOpen={dialogOpen}
        title="Delete Product"
        variant="danger"
        isLoading={isDeletingProduct}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmLabel="Delete Product"
        cancelLabel="Cancel"
        message={
          <div className="space-y-3">
            <p>You are about to permanently delete:</p>

            <div className="rounded-lg border p-3">
              <div className="font-medium">{productToDelete?.name}</div>

              <div className="text-sm text-gray-500">
                SKU:
                {productToDelete?._id}
              </div>
            </div>

            <p className="text-sm text-red-600">
              This action cannot be undone.
            </p>
          </div>
        }
      />
    </>
  );
}
