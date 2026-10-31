import { useMemo, useState } from "react";

interface Product {
  _id: string;
  displayStatus: string;
}

interface UseProductSelectionProps {
  productMeta: Product[];
}

export const useProductSelection = ({
  productMeta: products,
}: UseProductSelectionProps) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProductIds(products.map((p) => p._id));
  };

  const clearSelection = () => {
    setSelectedProductIds([]);
  };

  const selectedProducts = useMemo(() => {
    const selectedSet = new Set(selectedProductIds);

    return products.filter((product) =>
      selectedSet.has(product._id)
    );
  }, [products, selectedProductIds]);

  const isSelected = (productId: string) => {
    return selectedProductIds.includes(productId);
  };

  const allSelected = useMemo(() => {
    if (products.length === 0) return false;

    return selectedProductIds.length === products.length;
  }, [selectedProductIds, products]);

  const partiallySelected = useMemo(() => {
    return (
      selectedProductIds.length > 0 &&
      selectedProductIds.length < products.length
    );
  }, [selectedProductIds, products]);

  const canRestore = useMemo(() => {
    return (
      selectedProducts.length > 0 &&
      selectedProducts.every(
        (product) => product.displayStatus === "archived"
      )
    );
  }, [selectedProducts]);

  const canArchive = useMemo(() => {
    return (
      selectedProducts.length > 0 &&
      selectedProducts.every(
        (product) => product.displayStatus !== "archived"
      )
    );
  }, [selectedProducts]);

  return {
    selectedProductIds,
    selectedProducts,

    setSelectedProductIds,
  

    toggleProductSelection,
    selectAllProducts,
    clearSelection,

    isSelected,

    allSelected,
    partiallySelected,

    canRestore,
    canArchive,
  };
};