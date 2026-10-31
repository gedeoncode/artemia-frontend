// @/domain/manage-products/components/BulkActions.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Trash2,
  Archive,
  RotateCcw,
  CheckSquare,
  Square,
  MinusSquare,
  Plus,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import { BulkAction } from "../types/filter.types";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkAction: (action: BulkAction) => Promise<void>;
  onAddNewProduct: () => void;
  isLoading?: boolean;
  error?: string | null;
  canRestore?: boolean;
  canArchive?: boolean;
}

const BULK_ACTIONS = [
  {
    type: "archived" as BulkAction,
    label: "Archive",
    icon: Archive,
    color: "text-gray-600 hover:text-gray-900",
    bgColor: "hover:bg-gray-50",
    requiresSelection: true,
    condition: (_canRestore?: boolean, canArchive?: boolean) =>
      canArchive !== false,
  },
  {
    type: "delete" as BulkAction,
    label: "Delete",
    icon: Trash2,
    color: "text-red-600 hover:text-red-700",
    bgColor: "hover:bg-red-50",
    requiresSelection: true,
    destructive: true,
  },
  {
    type: "restore" as BulkAction,
    label: "Restore",
    icon: RotateCcw,
    color: "text-green-600 hover:text-green-700",
    bgColor: "hover:bg-green-50",
    requiresSelection: true,
    condition: (canRestore?: boolean) => canRestore === true,
  },
] as const;

export function BulkActions({
  selectedCount,
  totalCount,
  isAllSelected,
  isPartiallySelected,
  onSelectAll,
  onDeselectAll,
  onBulkAction,
  onAddNewProduct,
  isLoading = false,
  error = null,
  canRestore = false,
  canArchive = true,
}: BulkActionsProps) {
  const [showConfirmDialog, setShowConfirmDialog] =
    useState<BulkAction | null>(null);

  const [actionLoading, setActionLoading] =
    useState<BulkAction | null>(null);

  const availableActions = useMemo(() => {
    return BULK_ACTIONS.filter((action) => {
      if (action.requiresSelection && selectedCount === 0) {
        return false;
      }

      if (
        action.condition &&
        !action.condition(canRestore, canArchive)
      ) {
        return false;
      }

      return true;
    });
  }, [selectedCount, canRestore, canArchive]);

  const executeAction = useCallback(
    async (action: BulkAction) => {
      try {
        setActionLoading(action);
        await onBulkAction(action);
      } finally {
        setActionLoading(null);
        setShowConfirmDialog(null);
      }
    },
    [onBulkAction],
  );

  const handleActionClick = useCallback(
    (action: BulkAction) => {
      if (action === "delete") {
        setShowConfirmDialog(action);
        return;
      }

      void executeAction(action);
    },
    [executeAction],
  );

  const handleCloseDialog = useCallback(() => {
    setShowConfirmDialog(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!showConfirmDialog) return;

    void executeAction(showConfirmDialog);
  }, [showConfirmDialog, executeAction]);

  const handleSelectAllClick = useCallback(() => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  }, [isAllSelected, onSelectAll, onDeselectAll]);

  const selectionIcon = useMemo(() => {
    if (isAllSelected) {
      return <CheckSquare className="h-5 w-5" />;
    }

    if (isPartiallySelected) {
      return <MinusSquare className="h-5 w-5" />;
    }

    return <Square className="h-5 w-5" />;
  }, [isAllSelected, isPartiallySelected]);

  const confirmDialog = useMemo(() => {
    if (!showConfirmDialog) return null;

    switch (showConfirmDialog) {
      case "delete":
        return {
          title: "Delete Products",
          message: `Are you sure you want to delete ${selectedCount} product${
            selectedCount !== 1 ? "s" : ""
          }? This action cannot be undone.`,
          confirmText: "Delete",
          variant: "danger" as const,
        };

      case "archived":
        return {
          title: "Archive Products",
          message: `Archive ${selectedCount} product${
            selectedCount !== 1 ? "s" : ""
          }? You can restore them later from the archived section.`,
          confirmText: "Archive",
          variant: "warning" as const,
        };

      default:
        return null;
    }
  }, [showConfirmDialog, selectedCount]);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Selection Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSelectAllClick}
                className="flex items-center gap-2 text-gray-700 transition-colors hover:text-gray-900"
                aria-label={isAllSelected ? "Deselect all" : "Select all"}
              >
                {selectionIcon}

                <span className="text-sm font-medium">
                  {isAllSelected ? "Deselect all" : "Select all"}
                </span>
              </button>

              {selectedCount > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">
                    {selectedCount} selected
                  </span>

                  {selectedCount === totalCount && totalCount > 0 && (
                    <span className="text-xs text-gray-500">
                      (All {totalCount} products)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {availableActions.map((action) => {
                const Icon = action.icon;

                const loadingAction =
                  actionLoading === action.type;

                const disabled =
                  isLoading || loadingAction;

                return (
                  <button
                    key={action.type}
                    onClick={() =>
                      handleActionClick(action.type)
                    }
                    disabled={disabled}
                    aria-label={`${action.label} selected products`}
                    className={`
                      inline-flex items-center gap-2
                      px-3 py-1.5
                      text-sm font-medium
                      rounded-md border
                      transition-all duration-200
                      border-gray-200
                      ${action.color}
                      ${action.bgColor}
                      ${
                        disabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }
                    `}
                  >
                    {loadingAction ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}

                    <span className="hidden sm:inline">
                      {action.label}
                    </span>
                  </button>
                );
              })}

              <div className="mx-1 h-6 w-px bg-gray-200" />

              <button
                onClick={onAddNewProduct}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add product</span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded bg-red-50 p-2 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Selection Status */}
          {selectedCount > 0 && !error && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    Bulk actions available:
                  </span>

                  <span>
                    Update pricing, change status, export selected,
                    and more
                  </span>
                </div>

                <button
                  onClick={onDeselectAll}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={!!showConfirmDialog}
        title={confirmDialog?.title ?? ""}
        message={confirmDialog?.message ?? ""}
        confirmLabel={confirmDialog?.confirmText ?? "Confirm"}
        cancelLabel="Cancel"
        variant={confirmDialog?.variant ?? "warning"}
        isLoading={actionLoading !== null}
        onCancel={handleCloseDialog}
        onConfirm={handleConfirm}
      />
    </>
  );
}