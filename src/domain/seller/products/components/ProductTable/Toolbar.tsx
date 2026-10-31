interface Props {
  totalProducts: number;
  visibleProducts: number;
  selectedCount: number;
}

export function ProductTableToolbar({
  totalProducts,
  visibleProducts,
  selectedCount,
}: Props) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div>
        <p className="text-sm font-medium">
          Products
        </p>

        <p className="text-xs text-gray-500">
          Showing {visibleProducts} of{" "}
          {totalProducts}
        </p>
      </div>

      {selectedCount > 0 && (
        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {selectedCount} selected
        </div>
      )}
    </div>
  );
}