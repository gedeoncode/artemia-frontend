"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

import { Mail, Building2, FileText } from "lucide-react";

import { Seller } from "../services/types";

import { cn } from "@/lib/utils";

import { TableRow, TableCell } from "@/components/ui/Table";

import { Button } from "@/components/ui/button/Button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { StatusBadge } from "./StatusBadge";
import { VerificationBadges } from "./VerificationBadges";

import { ConfirmDialogState } from "../types/SellerAction.types";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { CONFIRM_DIALOG_CONTENT } from "../constants/actionConfig.constants";
import { SellerActionsDesktop } from "./SellerActionsDesktop";
import { SellerActionsMobile } from "./SellerActionsMobile";

interface SellerRowProps {
  seller: Seller;
  isUpdatingSeller: (sellerId: string) => boolean;
  isBlockingSeller: (sellerId: string) => boolean;

  onViewDocuments: (seller: Seller) => void;

  onApprove: (sellerId: string) => void;
  onReject: (sellerId: string) => void;
  onBlock: (sellerId: string) => void;
  onUnblock: (sellerId: string) => void;

  isHovered: boolean;

  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const SellerRow = ({
  seller,
  isUpdatingSeller,
  isBlockingSeller,
  onViewDocuments,
  onApprove,
  onReject,
  onBlock,
  onUnblock,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: SellerRowProps) => {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    action: null,
    sellerId: "",
  });
  const dialogContent =
    confirmDialog.action && CONFIRM_DIALOG_CONTENT[confirmDialog.action];
  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const isUpdating = isUpdatingSeller(seller._id);
  const isBlocking = isBlockingSeller(seller._id);

  const showConfirmDialog = (
    action: "block" | "unblock" | "reject",
    sellerId: string,
  ) => {
    setConfirmDialog({
      open: true,
      action,
      sellerId,
    });
  };

  const closeDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      sellerId: "",
    });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.action) return;

    switch (confirmDialog.action) {
      case "reject":
        onReject(confirmDialog.sellerId);
        break;

      case "block":
        onBlock(confirmDialog.sellerId);
        break;

      case "unblock":
        onUnblock(confirmDialog.sellerId);
        break;
    }

    closeDialog();
  };

  return (
    <>
      <TableRow
        className={cn(
          "group transition-all duration-200 hover:bg-muted/40",
          isHovered && "bg-muted/30",
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Seller Info */}
        <TableCell className="py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 ring-1 ring-border">
              <AvatarImage
                src={seller?.user?.avatar}
                alt={seller?.user?.name}
              />

              <AvatarFallback className="bg-muted text-xs font-medium">
                {getInitials(seller.user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <Link
                href={`/admin/manage-sellers/${seller._id}`}
                className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                prefetch={false}
              >
                {seller.user.name}
              </Link>

              {seller.businessName && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <Building2 className="h-3 w-3" />
                  <span className="line-clamp-1">{seller.businessName}</span>
                </div>
              )}
            </div>
          </div>
        </TableCell>

        {/* Contact */}
        <TableCell className="py-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />

            <span className="text-muted-foreground truncate max-w-[200px]">
              {seller.user.email}
            </span>
          </div>
        </TableCell>

        {/* Verification */}
        <TableCell className="py-4">
          <VerificationBadges seller={seller} />
        </TableCell>

        {/* Status */}
        <TableCell className="py-4">
          <StatusBadge
            status={seller.verificationStatus}
            isBlocked={seller.isBlocked}
          />
        </TableCell>

        {/* Documents */}
        <TableCell className="py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDocuments(seller)}
                disabled={!seller.documentsUploaded}
                className={cn(
                  "h-8 px-3 text-xs font-medium transition-all",
                  seller.documentsUploaded
                    ? "hover:bg-primary/10 hover:text-primary"
                    : "text-muted-foreground cursor-not-allowed opacity-50",
                )}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />

                {seller.documentsUploaded ? "View Documents" : "No Documents"}
              </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom" className="text-xs">
              <p>
                {seller.documentsUploaded
                  ? "View uploaded documents"
                  : "No documents uploaded"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TableCell>

        {/* Actions */}
        <TableCell className="py-4 text-right">
          <SellerActionsDesktop
            seller={seller}
            isUpdating={isUpdating}
            isBlocking={isBlocking}
            onApprove={onApprove}
            onShowRejectDialog={(sellerId) =>
              showConfirmDialog("reject", sellerId)
            }
            onShowBlockDialog={(sellerId) =>
              showConfirmDialog("block", sellerId)
            }
            onShowUnblockDialog={(sellerId) =>
              showConfirmDialog("unblock", sellerId)
            }
            onViewDocuments={onViewDocuments}
          />

          <SellerActionsMobile
            seller={seller}
            isUpdating={isUpdating}
            isBlocking={isBlocking}
            onApprove={onApprove}
            onShowRejectDialog={(sellerId) =>
              showConfirmDialog("reject", sellerId)
            }
            onShowBlockDialog={(sellerId) =>
              showConfirmDialog("block", sellerId)
            }
            onShowUnblockDialog={(sellerId) =>
              showConfirmDialog("unblock", sellerId)
            }
            onViewDocuments={onViewDocuments}
          />
        </TableCell>
      </TableRow>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.open}
        title={`Confirm ${dialogContent?.title}`}
        message={dialogContent?.description}
        onCancel={closeDialog}
        onConfirm={handleConfirmAction}
        isLoading={isBlocking || isUpdating}
        confirmLabel={`Confirm ${confirmDialog.action}`}
        cancelLabel="Cancel"
        variant={
          confirmDialog.action === "reject" || confirmDialog.action === "block"
            ? "danger"
            : "primary"
        }
        disableConfirm={isBlocking || isUpdating}
        disableCancel={isBlocking || isUpdating}
      />
    </>
  );
};
