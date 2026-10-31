"use client";

import {
  TableCell,
  TableRow,
} from "@/components/ui/Table";

import { Skeleton } from "@/components/ui/Skeleton";

type CategoryTableSkeletonProps = {
  rows?: number;
};

export function CategoryTableSkeleton({
  rows = 5,
}: CategoryTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-[180px]" />

              <Skeleton className="h-3 w-[120px]" />
            </div>
          </TableCell>

          <TableCell>
            <Skeleton className="h-6 w-[90px] rounded-full" />
          </TableCell>

          <TableCell className="text-center">
            <Skeleton className="h-4 w-[40px] mx-auto" />
          </TableCell>

          <TableCell className="text-center">
            <Skeleton className="h-4 w-[40px] mx-auto" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-6 w-[90px] rounded-full" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-6 w-[80px] rounded-full" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>

          <TableCell>
            <Skeleton className="w-8 h-8 ml-auto rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}