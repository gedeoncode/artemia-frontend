"use client";
import Link from "next/link";

import {
  MoreHorizontal,
  Eye,
  Building2,
  ShieldCheck,
  XCircle,
  Ban,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button/Button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

import { SellerActionsProps } from "../types/SellerAction.types";

export const SellerActionsMobile = ({
  seller,
  onApprove,
  onShowRejectDialog,
  onShowBlockDialog,
  onShowUnblockDialog,
  onViewDocuments,
}: SellerActionsProps) => {
  return (
    <div className="sm:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => onViewDocuments(seller)}>
            <Eye className="h-4 w-4 mr-2" />
            View Documents
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/admin/manage-sellers/${seller._id}`}>
              <Building2 className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {!seller.isBlocked ? (
            <>
              {seller.verificationStatus !== "approved" && (
                <DropdownMenuItem
                  onClick={() => onApprove(seller._id)}
                  className="text-emerald-600"
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Approve Seller
                </DropdownMenuItem>
              )}

              {seller.verificationStatus !== "rejected" && (
                <DropdownMenuItem
                  onClick={() => onShowRejectDialog(seller._id)}
                  className="text-red-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Seller
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => onShowBlockDialog(seller._id)}
                className="text-orange-600"
              >
                <Ban className="h-4 w-4 mr-2" />
                Block Seller
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onClick={() => onShowUnblockDialog(seller._id)}
              className="text-emerald-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Unblock Seller
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
