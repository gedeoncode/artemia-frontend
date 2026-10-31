"use client";

import {
  TableCell,
  TableRow,
} from "@/components/ui/Table";

import { Skeleton } from "@/components/ui/Skeleton";

type SellerTableSkeletonProps = {
  rows?: number;
};

export function SellerTableSkeleton({
  rows = 5,
}: SellerTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`seller-skeleton-${index}`}>
          {/* Seller Info */}
          <TableCell className="py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />

              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-[160px]" />

                <Skeleton className="h-3 w-[120px]" />
              </div>
            </div>
          </TableCell>

          {/* Contact */}
          <TableCell className="py-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded" />

              <Skeleton className="h-4 w-[200px]" />
            </div>
          </TableCell>

          {/* Verification */}
          <TableCell className="py-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-[70px] rounded-full" />

              <Skeleton className="h-6 w-[70px] rounded-full" />
            </div>
          </TableCell>

          {/* Status */}
          <TableCell className="py-4">
            <Skeleton className="h-6 w-[100px] rounded-full" />
          </TableCell>

          {/* Documents */}
          <TableCell className="py-4">
            <Skeleton className="h-8 w-[130px] rounded-md" />
          </TableCell>

          {/* Actions */}
          <TableCell className="py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />

              <Skeleton className="h-8 w-8 rounded-md" />

              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}