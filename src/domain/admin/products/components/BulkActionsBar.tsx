// domain/admin/products/components/BulkActionsBar.tsx

"use client";

import { Badge } from "@/components/ui/Badge";

import { Product } from "@/domain/admin/products/types/product.types";

type BulkActionsBarProps = {
  products: Product[];
  count: number;
  isLoading: boolean;
  onClear: () => void;
  onApprove: () => void;
  onReject: (product: Product) => void;
};

export function BulkActionsBar({
  products,
  count,
  onClear,
  onApprove,
  onReject,
}: BulkActionsBarProps) {
  return (
    <div className="flex items-center justify-between p-3 border border-blue-100 rounded-lg bg-blue-50">
      <p className="text-sm font-medium text-blue-800">
        {count} product{count !== 1 ? "s" : ""} selected
      </p>

      <div className="flex gap-2">
        <Badge
          className="cursor-pointer"
          variant="outline"
          size="sm"
          onClick={onClear}
        >
          Clear
        </Badge>

        <Badge
          className="cursor-pointer"
          variant="success"
          size="sm"
          onClick={onApprove}
        >
          Approve Selected
        </Badge>

        <Badge
          className="cursor-pointer"
          variant="danger"
          size="sm"
          onClick={() => onReject(products)}
        >
          Reject Selected
        </Badge>
      </div>
    </div>
  );
}
