"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { createProductApi } from "../services/client";

import { productKeys } from "@/lib/react-query/product-keys";

import type {
  CreateProductFormSchema,
  CreateProductResponseFormSchema,
} from "@/domain/seller/products/schemas";

import type { Images } from "@/types";
import { BaseError } from "@/errors";

type CreateProductVariables = {
  formData: CreateProductFormSchema;
  images: Images;
};

const mapCreateProductPayload = (
  formData: CreateProductFormSchema,
  images: Images,
) => ({
  ...formData,

  images,

  pricing: {
    ...formData.pricing,

    deal: formData.pricing.deal?.isActive
      ? {
          ...formData.pricing.deal,

          priceMinor:
            formData.pricing.deal.price != null
              ? Math.round(
                  (formData.pricing.deal.price + Number.EPSILON) * 100,
                )
              : undefined,
        }
      : undefined,
  },
});

export const useCreateProduct = (
  options?: Omit<
    UseMutationOptions<
      CreateProductResponseFormSchema,
      BaseError,
      CreateProductVariables
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  const {
    onSuccess,
    onError,
    ...restOptions
  } = options ?? {};

  return useMutation<
    CreateProductResponseFormSchema,
    BaseError,
    CreateProductVariables
  >({
    ...restOptions,

    mutationKey: [...productKeys.all, "create"],

    mutationFn: async ({ formData, images }) => {
      const payload = mapCreateProductPayload(
        formData,
        images,
      );

      return createProductApi(payload);
    },

    onSuccess: async (
      data,
      variables,
      context,
    ) => {
      await queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });

      await onSuccess?.(
        data,
        variables,
        context,
      );
    },

    onError: (
      error,
      variables,
      context,
    ) => {
      console.error(
        "❌ Product creation failed:",
        error,
      );

      onError?.(
        error,
        variables,
        context,
        
      );
    },
  });
};