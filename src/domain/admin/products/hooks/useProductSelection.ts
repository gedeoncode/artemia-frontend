// domain/admin/products/hooks/useProductSelection.ts

"use client";

import { useCallback, useMemo, useState } from "react";

type UseProductSelectionProps = {
  productIds: string[];
};

export function useProductSelection({
  productIds,
}: UseProductSelectionProps) {
  const [selectedIds, setSelectedIds] = useState<
    string[]
  >([]);

  const toggleSelection = useCallback(
    (productId: string) => {
      setSelectedIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      );
    },
    [],
  );

  const selectPage = useCallback(() => {
    setSelectedIds((prev) =>
      productIds.every((id) =>
        prev.includes(id),
      )
        ? prev.filter(
            (id) => !productIds.includes(id),
          )
        : [...new Set([...prev, ...productIds])],
    );
  }, [productIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const allSelected = useMemo(() => {
    return (
      productIds.length > 0 &&
      productIds.every((id) =>
        selectedIds.includes(id),
      )
    );
  }, [productIds, selectedIds]);

  const partiallySelected = useMemo(() => {
    return (
      productIds.some((id) =>
        selectedIds.includes(id),
      ) && !allSelected
    );
  }, [productIds, selectedIds, allSelected]);

  return {
    selectedIds,

    toggleSelection,
    selectPage,
    clearSelection,

    allSelected,
    partiallySelected,
  };
}