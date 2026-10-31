"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/context/AuthContext";


import { getProductActions } from "./utils/getProductActions";
import { createProductActionHandlers } from "./utils/actionHandler";
import { resolveProductActions } from "./utils/resolveProductAction";
import { AdaptedProduct } from "@/domain/product/types/adapted-product.types";


export function useProductActions(product: AdaptedProduct) {
  const router = useRouter();

  const { user } = useAuth();

  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);

  const actions = useMemo(
    () =>
      getProductActions({
        productId: product.id ?? "",
        categoryNature: product.category?.nature,
        isPurchasable: product.availability.isPurchasable,
        stock: product.stock,
      }),
    [product]
  );

  const handlers = useMemo(
    () =>
      createProductActionHandlers({
        router,
        user,
        quantity,
        addItem,
        product,

        contactSeller: () => {
          // existing contactSellerHandler(...)
        },
      }),
    [router, user, quantity, addItem, product]
  );

  const resolvedActions = useMemo(
    () => resolveProductActions(actions, handlers),
    [actions, handlers]
  );

  const maxQuantity = Math.min(product?.stock ?? 0, 10);

  const showQuantitySelector =
    product.availability.isPurchasable && maxQuantity > 1;

  return {
    quantity,

    setQuantity,

    maxQuantity,

    showQuantitySelector,

    resolvedActions,
  };
}