"use client";

import { useCallback, useState } from "react";

import { Product } from "@/domain/admin/products/types";

type ProductDialogState = {
  product: Product | null;
  selectedIds: string[];
  isOpen: boolean;
};

export function useProductDialog() {
  const [state, setState] =
    useState<ProductDialogState>({
      product: null,
      selectedIds: [],
      isOpen: false,
    });

  const open = useCallback(
    ({
      product = null,
      selectedIds = [],
    }: {
      product?: Product | null;
      selectedIds?: string[];
    }) => {
      setState({
        product,
        selectedIds,
        isOpen: true,
      });
    },
    [],
  );

  const close = useCallback(() => {
    setState({
      product: null,
      selectedIds: [],
      isOpen: false,
    });
  }, []);

  return {
    ...state,

    open,
    close,
  };
}