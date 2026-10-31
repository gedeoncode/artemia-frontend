import React from "react";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { getSellerModeMessage } from "../../../../../utils/sellerModeMessage";

interface ModeSwitchDialogProps {
  isOpen: boolean;
  sellerMode: CommissionModel;
  preferredAllowedMode: CommissionModel | null;
  loading?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

/**
 * Enterprise-grade reusable confirmation dialog
 * for switching incompatible seller commission modes.
 */
export const ModeSwitchDialog: React.FC<ModeSwitchDialogProps> = ({
  isOpen,
  sellerMode,
  preferredAllowedMode,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!preferredAllowedMode) return null;

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      title="Mode de vente incompatible"
      message={getSellerModeMessage({
        sellerMode,
        preferredAllowedMode,
      })}
      confirmLabel={`Changer en ${preferredAllowedMode}`}
      cancelLabel="Annuler"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={loading}
      variant="warning"
    />
  );
};
