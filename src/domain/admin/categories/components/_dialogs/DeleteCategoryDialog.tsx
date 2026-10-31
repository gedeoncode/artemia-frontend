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

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  description?: string;
  dangerText?: string;
  confirmText?: string;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  itemName,
  isDeleting,
  onConfirm,
  description,
  dangerText = "Delete",
  confirmText: confirmTextProp = `Type "${itemName}" to confirm`,
}: DeleteConfirmationDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmText("");
      setIsFocused(false);
    }
  }, [open]);

  const isMatch =
    confirmText.trim().toLowerCase() === itemName.trim().toLowerCase();

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && isDeleting) return;
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md p-6 border border-gray-100 shadow-xl rounded-xl ">
        <div className="space-y-6">
          <AlertDialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-50">
                <Icons.warning className="w-5 h-5 text-red-500 " />
              </div>
              <AlertDialogTitle className="text-lg font-semibold">
                Delete {itemName}?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm text-gray-800 pl-11 ">
              {description || (
                <>
                  This will permanently delete{" "}
                  <span className="font-medium text-gray-900 ">
                    {itemName}
                  </span>{" "}
                  and all related content. This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 pl-11">
            <Label
              htmlFor="confirm-name"
              className="text-sm text-gray-700 "
            >
              {confirmTextProp}
            </Label>
            <Input
              id="confirm-name"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isDeleting}
              placeholder={isFocused ? "" : itemName}
              aria-label="Type to confirm deletion"
              autoComplete="off"
              className={`transition-all ${isMatch ? "border-green-500 focus:ring-green-400/30" : "focus:ring-red-400/30"}`}
            />
          </div>

          <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <AlertDialogCancel
              disabled={isDeleting}
              className="w-full mt-0 text-blue-600 bg-transparent border border-blue-500 hover:bg-blue-50"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={!isMatch || isDeleting}
              className="w-full text-white transition-colors shadow-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              <div className="flex items-center gap-2">
                {isDeleting ? (
                  <Icons.spinner className="w-4 h-4 animate-spin" />
                ) : (
                  <Icons.delete className="w-4 h-4" />
                )}
                <span>{isDeleting ? "Deleting..." : dangerText}</span>
              </div>
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
