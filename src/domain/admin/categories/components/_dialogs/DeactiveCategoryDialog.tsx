"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/AlertDialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Icons } from "@/components/Icons";

interface DeactivateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  isLoading: {
    checkingProducts: boolean;
    status: boolean;
  };
  hasActiveProducts: boolean;
  onConfirm: () => void;
}

export function DeactivateCategoryDialog({
  open,
  onOpenChange,
  categoryName,
  isLoading,
  hasActiveProducts,
  onConfirm,
}: DeactivateDialogProps) {
  const [confirmText, setConfirmText] = useState("");

  const isMatch =
    confirmText.trim().toLowerCase() === categoryName.trim().toLowerCase();

  useEffect(() => {
    if (!open) {
      setConfirmText("");
    }
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasActiveProducts
              ? "Cannot Deactivate Category"
              : "Confirm Deactivation"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isLoading.checkingProducts ? (
              <div className="flex items-center gap-2">
                <Icons.spinner className="w-4 h-4 animate-spin" />
                Checking for active products...
              </div>
            ) : hasActiveProducts ? (
              <>
                This category contains <strong>active products</strong> and
                cannot be deactivated.
                <br /> Please remove or deactivate those products first.
              </>
            ) : (
              <>
                Are you sure you want to deactivate{" "}
                <strong>{categoryName}</strong>? This will hide it and its
                subcategories from customers.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!hasActiveProducts && !isLoading.checkingProducts && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="confirm-name" className="text-sm font-medium">
              To confirm, type{" "}
              <span className="font-semibold">{categoryName}</span>
            </Label>
            <Input
              id="confirm-name"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isLoading.status}
              placeholder={categoryName}
              autoComplete="off"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading.status}>
            Cancel
          </AlertDialogCancel>

          {!hasActiveProducts && !isLoading.checkingProducts && (
            <AlertDialogAction
              disabled={!isMatch || isLoading.status}
              onClick={() => {
                onOpenChange(false);
                onConfirm();
              }}
              className="flex gap-2 bg-red-500 hover:bg-red-600"
            >
              {isLoading.status && (
                <Icons.spinner className="w-4 h-4 animate-spin" />
              )}
              {isLoading.status ? "Processing..." : "Deactivate"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
