// hooks/mutations/useProductMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productKeys } from "@/lib/react-query/product-keys";

import type {
  Product,
  ProductListResponse,
} from "@/domain/seller/products/types/product.types";
import { BulkActionParams } from "../types/filter.types";
import {
  deleteProductApi,
  performBulkActionApi,
} from "../services/client/product.client.services";

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  /*
   |--------------------------------------------------------------------------
   | Delete Product
   |--------------------------------------------------------------------------
   */

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,

    /*
   |--------------------------------------------------------------------------
   | Optimistic Update
   |--------------------------------------------------------------------------
   */

    onMutate: async (productId: string) => {
      /*
       * Cancel outgoing refetches
       * so they don't overwrite optimistic update
       */

      await queryClient.cancelQueries({
        queryKey: productKeys.lists(),
      });

      /*
       * Snapshot previous cache
       */

      const previousProductsQueries = queryClient.getQueriesData({
        queryKey: productKeys.lists(),
      });

      /*
       * Optimistically remove product
       */

      previousProductsQueries.forEach(([queryKey, data]) => {
        if (!data) return;

        queryClient.setQueryData(queryKey, (oldData: ProductListResponse) => {
          if (!oldData) return oldData;
          console.log("Old data:", oldData);
          return {
            ...oldData,

            products: oldData.products.filter(
              (product: Product) => product._id !== productId,
            ),
          };
        });
      });

      /*
       * Return rollback context
       */

      return {
        previousProductsQueries,
      };
    },

    /*
   |--------------------------------------------------------------------------
   | Rollback on Failure
   |--------------------------------------------------------------------------
   */

    onError: (_error, _productId, context) => {
      context?.previousProductsQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    /*
   |--------------------------------------------------------------------------
   | Refetch Eventually
   |--------------------------------------------------------------------------
   */

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });

  /*
   |--------------------------------------------------------------------------
   | Bulk Actions
   |--------------------------------------------------------------------------
   */
  const bulkActionMutation = useMutation({
    mutationFn: ({ productIds, action }: BulkActionParams) =>
      performBulkActionApi({
        productIds,
        action,
      }),

    onMutate: async ({ productIds, action }: BulkActionParams) => {
      await queryClient.cancelQueries({
        queryKey: productKeys.lists(),
      });

      const previousProductsQueries =
        queryClient.getQueriesData<ProductListResponse>({
          queryKey: productKeys.lists(),
        });

      previousProductsQueries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (oldData: ProductListResponse) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            products: oldData.products.map((product) => {
              if (!productIds.includes(product._id || "")) {
                return product;
              }

              return {
                ...product,

                status: action,
              };
            }),
          };
        });
      });

      return {
        previousProductsQueries,
      };
    },

    onError: (_error, _variables, context) => {
      context?.previousProductsQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
  return {
    /*
     |--------------------------------------------------------------------------
     | Delete
     |--------------------------------------------------------------------------
     */

    deleteProduct: deleteMutation.mutateAsync,

    isDeleting: deleteMutation.isPending,

    deleteError:
      deleteMutation.error instanceof Error
        ? deleteMutation.error.message
        : null,

    /*
     |--------------------------------------------------------------------------
     | Bulk Actions
     |--------------------------------------------------------------------------
     */

    performBulkAction: bulkActionMutation.mutateAsync,

    isBulkLoading: bulkActionMutation.isPending,

    bulkError:
      bulkActionMutation.error instanceof Error
        ? bulkActionMutation.error.message
        : null,
  };
};
