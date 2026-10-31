// domain/admin/products/components/ProductsTable.tsx

"use client";

import { EmptyState } from "@/components/EmptyState";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { Checkbox } from "@/components/ui/Checkbox";

import { Product } from "@/domain/admin/products/types/product.types";

type ProductsTableProps = {
  products: Product[];
  paginatedProducts: Product[];
  isLoading: boolean;
  allSelected: boolean;
  partiallySelected: boolean;

  onToggleSelectPage: () => void;

  renderSkeleton: () => React.ReactNode;

  renderProductRow: (product: Product) => React.ReactNode;
};

export function ProductsTable({
  products,
  paginatedProducts,
  isLoading,
  allSelected,
  partiallySelected,
  onToggleSelectPage,
  renderSkeleton,
  renderProductRow,
}: ProductsTableProps) {
    const hasProducts =
    products.length > 0;

  return (
    <div className="overflow-hidden border rounded-lg">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={allSelected}
                indeterminate={partiallySelected}
                onCheckedChange={onToggleSelectPage}
                disabled={
                  !hasProducts || isLoading
                }
              />
            
            </TableHead>

             <TableHead>
               Product
             </TableHead>

             <TableHead>
               Category
             </TableHead>

             <TableHead>
               Seller
             </TableHead>

             <TableHead className="text-right">
               Pricing
             </TableHead>

             <TableHead>
               Publication
             </TableHead>

             <TableHead>
               Inventory
             </TableHead>

             <TableHead>
               Billing
             </TableHead>

             <TableHead className="text-right">
               Actions
             </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            renderSkeleton()
          ) : !hasProducts ? (
            <TableRow>
              <TableCell colSpan={9} className="h-64">
                <EmptyState
                  title="No products found"
                  description="There are no products in the system yet"
                  icon="package"
                />
              </TableCell>
            </TableRow>
          ) : paginatedProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64">
                <EmptyState
                  title="No products found"
                  description="No products match your search criteria"
                  icon="search"
                />
              </TableCell>
            </TableRow>
          ) : (
            paginatedProducts.map(renderProductRow)
          )}
        </TableBody>
      </Table>
    </div>
  );
}