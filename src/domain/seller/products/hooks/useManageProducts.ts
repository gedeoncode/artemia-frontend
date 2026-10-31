// hooks/useManageProducts.ts

import { useRouter } from "next/navigation";

import { useProductsQuery } from "./useProductsQuery";

import { useProductSelection } from "./useProductSelection";

import { useProductMutations } from "./useProductMutations";

import { BulkAction, ProductFilterParams } from "../types/filter.types";
import { hasActiveProductFilters } from "../utils/filters";
import { ROUTES } from "../../constants/routes";
import { useCallback } from "react";

interface UseManageProductsProps {
  initialFilterParams: ProductFilterParams;
}
export const useManageProducts = ({
  initialFilterParams,
}: UseManageProductsProps) => {
  const router = useRouter();

  /*
   |--------------------------------------------------------------------------
   | Products Query
   |--------------------------------------------------------------------------
   */

  const {
    products,
    pagination,
    isLoading,
    isFetching,
    error,
    filterParams,
    setFilterParams,
    clearFilters,
  } = useProductsQuery({
    initialFilterParams,
  });

  /*
   |--------------------------------------------------------------------------
   | Product Selection
   |--------------------------------------------------------------------------
   */

  const {
    selectedProductIds,
    setSelectedProductIds,
    toggleProductSelection,
    selectAllProducts,
    clearSelection,
    allSelected,
    partiallySelected,
    canRestore,
    canArchive,
  } = useProductSelection({
    productMeta: products.map((p) => ({
      _id: p._id || "",
      displayStatus: p.publicationStatus,
    })),
  });

  /*
   |--------------------------------------------------------------------------
   | Product Mutations
   |--------------------------------------------------------------------------
   */

  const {
    deleteProduct,
    isDeleting,
    deleteError,

    performBulkAction,
    isBulkLoading,
    bulkError,
  } = useProductMutations();

  /*
   |--------------------------------------------------------------------------
   | Actions
   |--------------------------------------------------------------------------
   */

  const handleDelete = async (productId: string) => {
    await deleteProduct(productId);

    clearSelection();
  };
    const handleAdd = useCallback(() => {
    router.push(ROUTES.PRODUCTS.ADD);
  }, [router]);

  const handleBulkAction = async (action: BulkAction) => {
    if (selectedProductIds.length === 0) return;

    await performBulkAction({
      productIds: selectedProductIds,
      action,
    });

    clearSelection();
  };

  const handleEdit = (productId: string) => {
    router.push(`/seller/dashboard/update-product/${productId}`);
  };

  return {
    /*
     |--------------------------------------------------------------------------
     | Products
     |--------------------------------------------------------------------------
     */

    products,

    pagination,

    isLoading,

    isFetching,

    error,

    /*
     |--------------------------------------------------------------------------
     | Filters
     |--------------------------------------------------------------------------
     */
    filterParams,

    setFilterParams,

    clearFilters,

    /*
     |--------------------------------------------------------------------------
     | Selection
     |--------------------------------------------------------------------------
     */

    selectedProductIds,
    setSelectedProductIds,
    toggleProductSelection,

    selectAllProducts,
    clearSelection,

    isAllSelected: allSelected,

    isPartiallySelected: partiallySelected,
    canRestore,
    canArchive,

    /*
     |--------------------------------------------------------------------------
     | Mutations
     |--------------------------------------------------------------------------
     */

    handleDelete,
    handleAdd,

    isDeleting,

    deleteError,

    handleBulkAction,

    isBulkLoading,

    bulkError,

    /*
     |--------------------------------------------------------------------------
     | Navigation
     |--------------------------------------------------------------------------
     */

    handleEdit,
    hasActiveFilters: hasActiveProductFilters(filterParams),
    hasProductsInCatalog: pagination.total > 0,
  };
};
