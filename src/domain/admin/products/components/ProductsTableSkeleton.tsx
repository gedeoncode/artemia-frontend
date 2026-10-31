// domain/admin/products/components/ProductsTableSkeleton.tsx

"use client";

import {
  TableCell,
  TableRow,
} from "@/components/ui/Table";

import { Skeleton } from "@/components/ui/Skeleton";

type ProductsTableSkeletonProps = {
  rows?: number;
};

export function ProductsTableSkeleton({
  rows = 5,
}: ProductsTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton className="w-4 h-4 rounded" />
          </TableCell>

          <TableCell>
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-[80px]" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-[60px] ml-auto" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-6 w-[80px] rounded-full" />
          </TableCell>

          <TableCell>
            <Skeleton className="w-8 h-8 ml-auto rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}