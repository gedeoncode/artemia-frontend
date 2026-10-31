"use client";
import { QuantitySelector } from "./QuantitySelector";
import { ActionButtons } from "./ActionButtons";
import { AdaptedProduct } from "@/domain/product/types/adapted-product.types";

import { useProductActions } from "./useProductActions";

type Props = {
  product: AdaptedProduct;
};

export function ProductActionPanel({
  product,
}: Props) {
  const {
    quantity,
    setQuantity,
    maxQuantity,
    showQuantitySelector,
    resolvedActions,
  } = useProductActions(product);

  return (
    <div className="space-y-4">
      {showQuantitySelector && (
        <QuantitySelector
          quantity={quantity}
          maxQuantity={maxQuantity}
          onChange={setQuantity}
        />
      )}

      <ActionButtons
        actions={resolvedActions}
      />
    </div>
  );
}