// domain/admin/products/components/ProductsHeader.tsx

"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button/Button";

type ProductsHeaderProps = {
  isLoading: boolean;
  onRefresh: () => void;
};

export function ProductsHeader({ isLoading, onRefresh }: ProductsHeaderProps) {
  return (
    <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>

        <p className="text-sm text-gray-500">
          Manage and review all marketplace products
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
    </div>
  );
}
