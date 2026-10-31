// types/SellerAction.types.ts
import { Seller } from "../services/types";

export type SellerAction =
  | "approve"
  | "reject"
  | "block"
  | "unblock";

export type ConfirmDialogState = {
  open: boolean;
  action: Exclude<SellerAction, "approve"> | null;
  sellerId: string;
};

// types.ts


export interface SellerActionsProps {
  seller: Seller;

  isUpdating: boolean;
  isBlocking: boolean;

  onApprove: (sellerId: string) => void;

  onShowRejectDialog: (sellerId: string) => void;
  onShowBlockDialog: (sellerId: string) => void;
  onShowUnblockDialog: (sellerId: string) => void;

  onViewDocuments: (seller: Seller) => void;
}