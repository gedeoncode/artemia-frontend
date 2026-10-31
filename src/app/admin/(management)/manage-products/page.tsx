"use client";

// Components
import { Pagination } from "@/components/Pagination";
// Services and Types
import { Product } from "@/domain/admin/products/types";

import {
  BulkActionsBar,
  ProductsHeader,
  ProductsTable,
  ProductsTableSkeleton,
  ProductTableRow,
  ProductFilters,
  ViewProductModal,
  RejectProductsDialog,
} from "@/domain/admin/products/components";
import {
  useProductActions,
  useProductDialog,
  useProducts,
  useProductSelection,
} from "@/domain/admin/products/hooks";

export default function AdminProductsPage() {
  const {
    products,
    isLoading,
    error,

    currentPage,
    setCurrentPage,
    totalPages,
    totalProducts,
publicationStatus,
  billingStatus,
inventoryStatus,
setPublicationStatus,
setBillingStatus,
setInventoryStatus,
    sort,
    setSort,
    debouncedSearch,
    refetch,
  } = useProducts();

  const viewDialog = useProductDialog();

  const rejectDialog = useProductDialog();
  const {
    selectedIds,
    toggleSelection,
    selectPage,
    clearSelection,
    allSelected,
    partiallySelected,
  } = useProductSelection({
    productIds: products.map((p) => p._id.toString()),
  });
  const { handleBulkAction, handleSingleAction, toggleProductFlag, isPending } =
    useProductActions({
      onClearSelection: clearSelection,
    });

  // =========================
  // Render helpers
  // =========================
  const renderSkeleton = () => <ProductsTableSkeleton />;

  const renderProductRow = (product: Product) => (
    <ProductTableRow
      key={product._id.toString()}
      product={product}
      selected={selectedIds.includes(product._id.toString())}
      onToggleSelect={toggleSelection}
      onView={(product) => rejectDialog.open({ product })}
      onSingleAction={handleSingleAction}
      onToggleFlag={toggleProductFlag}
      onReject={(product) => rejectDialog.open({ product })}
    />
  );

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <ProductsHeader isLoading={isLoading} onRefresh={refetch} />
      <ProductFilters
        publicationStatus={publicationStatus}
        billingStatus={billingStatus}
        inventoryStatus={inventoryStatus}
        sort={sort}
        debouncedSearch={debouncedSearch}
        onPublicationStatusChange={setPublicationStatus}
        onBillingStatusChange={setBillingStatus}
        onInventoryStatusChange={setInventoryStatus}
        onSortChange={setSort}
      />

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <BulkActionsBar
          count={selectedIds.length}
          isLoading={isLoading || isPending}
          onClear={clearSelection}
          onApprove={() => handleBulkAction("approve", selectedIds)}
          products={products}
          onReject={() =>
            rejectDialog.open({
              selectedIds,
            })
          }
        />
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
          <p className="font-medium text-red-600">{error}</p>
        </div>
      )}

      {/* Products table */}
      <ProductsTable
        products={products}
        paginatedProducts={products}
        isLoading={isLoading || isPending}
        allSelected={allSelected}
        partiallySelected={partiallySelected}
        onToggleSelectPage={selectPage}
        renderSkeleton={renderSkeleton}
        renderProductRow={renderProductRow}
      />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} of {totalProducts} products
        </p>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <RejectProductsDialog
        open={rejectDialog.isOpen}
        onClose={rejectDialog.close}
        isLoading={isLoading || isPending}
        count={selectedIds.length}
        onConfirm={async ({ code, reason }) => {
          const payload = {
            rejectionCode: code,
            rejectionReason: reason,
          };
          console.log("Reject dialog:", rejectDialog.selectedIds);
          // Single reject
          if (rejectDialog.product) {
            await handleSingleAction(
              "reject",
              rejectDialog.product._id.toString(),
              payload,
            );
          }

          // Bulk reject
          else if (rejectDialog.selectedIds.length > 0) {
            await handleBulkAction("reject", rejectDialog.selectedIds, payload);
          }

          rejectDialog.close();
        }}
      />
      {/* Product modal */}
      <ViewProductModal
        open={viewDialog.isOpen}
        onClose={viewDialog.close}
        product={viewDialog.product}
        onStatusChange={refetch}
      />
    </div>
  );
}
