import React, { useState, useEffect, useCallback } from "react";
import { useCommissionModel } from "../../../../../../../dashboard/hooks/useCommisionMode";
import { CommissionModel } from "@/types/seller";
import { Category } from "@/types";
import { ModeSwitchDialog } from "./ModeSwitchDialog";

interface CategorySpecificFieldsProps {
  category: Category | null;
  isEdit?: boolean;
}

export function CategorySpecificFieldsSection({
  category,
}: CategorySpecificFieldsProps) {
  const [showDialog, setShowDialog] = useState(false);

  const {
    commissionModel: sellerMode,
    updateCommissionModel,
    loading,
  } = useCommissionModel();

  // --- Compute preferred mode for this category ---
  const preferredAllowedMode: CommissionModel | null =
    category?.allowedModes?.[0] ?? null;

  // --- Check compatibility between seller mode and category allowed modes ---
  useEffect(() => {
    if (!category || !sellerMode || !preferredAllowedMode) return;

    const isCompatible = category.allowedModes.includes(sellerMode);
    if (!isCompatible) {
      setShowDialog(true);
    }
  }, [category, sellerMode, preferredAllowedMode]);

  // --- Handle mode switch confirmation ---
  const handleConfirmSwitch = useCallback(async () => {
    if (!preferredAllowedMode) return;
    try {
      await updateCommissionModel(preferredAllowedMode);
      setShowDialog(false);
    } catch (err) {
      console.error("Failed to update commission model:", err);
      // TODO: Add enterprise-level error tracking (e.g. Sentry)
    }
  }, [preferredAllowedMode, updateCommissionModel]);

  // --- Guard clause ---
  if (!category) return null;

  const isAllowed = preferredAllowedMode
    ? category.allowedModes.includes(sellerMode)
    : true;

  // --- Show dialog if incompatible ---
  if (!isAllowed) {
    return (
      <ModeSwitchDialog
        isOpen={showDialog}
        sellerMode={sellerMode}
        preferredAllowedMode={preferredAllowedMode}
        loading={loading}
        onConfirm={handleConfirmSwitch}
        onCancel={() => setShowDialog(false)}
      />
    );
  }
}
