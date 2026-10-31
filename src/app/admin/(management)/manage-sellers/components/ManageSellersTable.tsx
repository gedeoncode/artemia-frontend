"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/Table";

import { EmptyState } from "@/components/EmptyState";

import { Seller } from "../services/types";

import { SellerRow } from "./SellerRow";

interface ManageSellersTableProps {
  sellers: Seller[];
  isUpdatingSeller: (
    sellerId: string
  ) => boolean;
  isBlockingSeller: (
    sellerId: string
  ) => boolean;
  onViewDocuments: (
    seller: Seller
  ) => void;
  onApprove: (
    sellerId: string
  ) => void;
  onReject: (
    sellerId: string
  ) => void;
  onBlock: (
    sellerId: string
  ) => void;
  onUnblock: (
    sellerId: string
  ) => void;
  onRefresh?: () => void;
  isFetching?: boolean;
  renderSkeleton: () => React.ReactNode;
}

const emptyStateDescription =
  "No sellers match your current search or filter criteria. Try adjusting your filters.";

export default function ManageSellersTable({
  sellers,
  isUpdatingSeller,
  isBlockingSeller,
  onViewDocuments,
  onApprove,
  onReject,
  onBlock,
  onUnblock,
  isFetching = false,
  renderSkeleton,
}: ManageSellersTableProps) {
  const hasSellers =
    sellers.length > 0;

  return (
    <div className="overflow-hidden border rounded-lg">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[320px]">
              Seller
            </TableHead>

            <TableHead>
              Contact
            </TableHead>

            <TableHead>
              Verification
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead>
              Documents
            </TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isFetching ? (
            renderSkeleton()
          ) : !hasSellers ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-64"
              >
                <EmptyState
                  title="No sellers found"
                  description={
                    emptyStateDescription
                  }
                  icon="building2"
                />
              </TableCell>
            </TableRow>
          ) : (
            sellers.map((seller) => (
              <SellerRow
                key={seller}
                seller={seller}
                isUpdatingSeller={
                  isUpdatingSeller
                }
                isBlockingSeller={
                  isBlockingSeller
                }
                onViewDocuments={
                  onViewDocuments
                }
                onApprove={onApprove}
                onReject={onReject}
                onBlock={onBlock}
                onUnblock={onUnblock}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}