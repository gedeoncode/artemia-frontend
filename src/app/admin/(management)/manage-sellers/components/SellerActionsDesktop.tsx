"use client";
import { SellerActionsProps } from "../types/SellerAction.types";

import {ActionButton} from "./ActionButton";

export const SellerActionsDesktop = ({
  seller,
  isUpdating,
  isBlocking,
  onApprove,
  onShowRejectDialog,
  onShowBlockDialog,
  onShowUnblockDialog,
}: SellerActionsProps) => {
  return (
    <div className="hidden sm:flex flex-wrap justify-end gap-1.5">
      {!seller.isBlocked ? (
        <>
          {seller.verificationStatus !== "approved" && (
            <ActionButton
              seller={seller}
              action="approve"
              isUpdating={isUpdating}
              onClick={() => onApprove(seller._id)}
            />
          )}

          {seller.verificationStatus !== "rejected" && (
            <ActionButton
              seller={seller}
              action="reject"
              isUpdating={isUpdating}
              onClick={() => onShowRejectDialog(seller._id)}
            />
          )}

          <ActionButton
            seller={seller}
            action="block"
            isUpdating={isBlocking}
            onClick={() => onShowBlockDialog(seller._id)}
          />
        </>
      ) : (
        <ActionButton
          seller={seller}
          action="unblock"
          isUpdating={isBlocking}
          onClick={() => onShowUnblockDialog(seller._id)}
        />
      )}
    </div>
  );
};
