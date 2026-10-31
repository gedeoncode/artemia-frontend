"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/Dialog";

import { Button } from "@/components/ui/button/Button";

import { Textarea } from "@/components/ui/Textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { ScrollArea } from "@/components/ui/ScrollArea";

import {
  PRODUCT_REJECT_REASONS,
  RejectReason,
  REASON_OPTIONS,
  DEFAULT_REJECTION_MESSAGES,
} from "../../constants";

type RejectProductsDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    code: RejectReason;
    reason: string;
  }) => Promise<void> | void;
  isLoading?: boolean;
  count?: number;
  productNames?: string[]; // For displaying affected products
  maxReasonLength?: number;
  showProductList?: boolean;
};

const DEFAULT_MAX_REASON_LENGTH = 500;

// Helper function to get the rejection message for a given reason
const getDefaultMessageForReason = (code: RejectReason): string => {
  return DEFAULT_REJECTION_MESSAGES[code] || "";
};

export function RejectProductsDialog({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  count = 1,
  maxReasonLength = DEFAULT_MAX_REASON_LENGTH,
}: RejectProductsDialogProps) {
  const [code, setCode] = useState<RejectReason>(
    PRODUCT_REJECT_REASONS.POLICY_VIOLATION,
  );
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track if the user has manually edited the textarea
  const hasManuallyEditedRef = useRef(false);
  // Track the previous reason code to detect changes
  const prevCodeRef = useRef<RejectReason>(
    PRODUCT_REJECT_REASONS.POLICY_VIOLATION,
  );

  const requiresCustomReason = useMemo(
    () => code === PRODUCT_REJECT_REASONS.OTHER,
    [code],
  );

  const isReasonValid = useMemo(() => {
    if (!requiresCustomReason) return true;
    return reason.trim().length > 0 && reason.trim().length <= maxReasonLength;
  }, [requiresCustomReason, reason, maxReasonLength]);

  const reasonCharacterCount = useMemo(() => reason.trim().length, [reason]);

  const isReasonNearLimit = useMemo(
    () => reasonCharacterCount > maxReasonLength * 0.8,
    [reasonCharacterCount, maxReasonLength],
  );

  const resetState = useCallback(() => {
    setCode(PRODUCT_REJECT_REASONS.POLICY_VIOLATION);
    setReason("");
    setError(null);
    setIsSubmitting(false);
    hasManuallyEditedRef.current = false;
    prevCodeRef.current = PRODUCT_REJECT_REASONS.POLICY_VIOLATION;
  }, []);

  // Handle auto-filling when rejection reason changes
  const handleReasonCodeChange = useCallback((newCode: RejectReason) => {
    const previousCode = prevCodeRef.current;

    // Update the code state
    setCode(newCode);
    setError(null);

    // Only auto-fill if:
    // 1. The reason code actually changed
    // 2. The user hasn't manually edited the textarea
    // 3. The new code is not OTHER (OTHER should be empty)
    if (newCode !== previousCode && !hasManuallyEditedRef.current) {
      const defaultMessage = getDefaultMessageForReason(newCode);

      // For OTHER, leave it empty; otherwise use the default message
      if (newCode === PRODUCT_REJECT_REASONS.OTHER) {
        setReason("");
      } else if (defaultMessage) {
        setReason(defaultMessage);
      }
    }

    // Reset manual edit flag when switching between reasons
    // This ensures that if admin switches to another preset reason,
    // they get the new default message
    if (newCode !== previousCode) {
      hasManuallyEditedRef.current = false;
    }

    // Update the previous code ref
    prevCodeRef.current = newCode;
  }, []);

  const handleReasonChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (newValue.length <= maxReasonLength) {
        setReason(newValue);
        if (error) setError(null);
        // Mark that the user has manually edited the textarea
        hasManuallyEditedRef.current = true;
      }
    },
    [maxReasonLength, error],
  );

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!isReasonValid) {
      if (requiresCustomReason && !reason.trim()) {
        setError("Please provide a rejection reason.");
      } else if (reason.trim().length > maxReasonLength) {
        setError(`Reason cannot exceed ${maxReasonLength} characters.`);
      }
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onConfirm({
        code,
        reason: reason.trim(),
      });
      resetState();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reject products. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    code,
    reason,
    onConfirm,
    resetState,
    onClose,
    requiresCustomReason,
    isReasonValid,
    maxReasonLength,
  ]);

  const handleClose = useCallback(() => {
    if (!isSubmitting && !isLoading) {
      resetState();
      onClose();
    }
  }, [resetState, onClose, isSubmitting, isLoading]);

  // Handle escape key and backdrop click
  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  // Reset manual edit flag when dialog is reopened
  useEffect(() => {
    if (open) {
      hasManuallyEditedRef.current = false;
      // Set initial default message for the default reason
      const defaultMessage = getDefaultMessageForReason(
        PRODUCT_REJECT_REASONS.POLICY_VIOLATION,
      );
      if (defaultMessage) {
        setReason(defaultMessage);
      }
    }
  }, [open]);

  const getSelectedReasonLabel = useCallback(() => {
    const selectedOption = REASON_OPTIONS.find((opt) => opt.value === code);
    return selectedOption?.label || "";
  }, [code]);

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Reject {count > 1 ? `Products (${count})` : "Product"}
            {count > 1 && (
              <Badge variant="secondary" className="text-xs">
                Bulk Action
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting{" "}
            {count > 1 ? `these ${count} products` : "this product"}. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-5">
            {/* Rejection Reason Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Rejection Reason <span className="text-destructive">*</span>
              </label>
              <Select
                value={code}
                onValueChange={(value) => {
                  handleReasonCodeChange(value as RejectReason);
                }}
                disabled={isSubmitting || isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select rejection reason" />
                </SelectTrigger>
                <SelectContent>
                  {REASON_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {code !== PRODUCT_REJECT_REASONS.OTHER && (
                <p className="text-xs text-muted-foreground">
                  Selected: {getSelectedReasonLabel()}
                </p>
              )}
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Additional Notes
                {requiresCustomReason && (
                  <span className="text-destructive ml-1">*</span>
                )}
                {!requiresCustomReason && (
                  <span className="text-muted-foreground text-xs font-normal ml-1">
                    (Optional)
                  </span>
                )}
              </label>
              <Textarea
                placeholder={
                  requiresCustomReason
                    ? "Please provide detailed reason for rejection..."
                    : "Add any additional context or notes (optional)..."
                }
                value={reason}
                onChange={handleReasonChange}
                rows={4}
                disabled={isSubmitting || isLoading}
                className="resize-none"
                aria-invalid={!!error && requiresCustomReason}
              />

              {/* Character counter */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  {requiresCustomReason && (
                    <>
                      {reasonCharacterCount} / {maxReasonLength} characters
                      {isReasonNearLimit &&
                        reasonCharacterCount < maxReasonLength && (
                          <span className="text-warning ml-1">
                            (approaching limit)
                          </span>
                        )}
                    </>
                  )}
                  {!requiresCustomReason && reasonCharacterCount > 0 && (
                    <>{reasonCharacterCount} characters entered</>
                  )}
                </span>
                {requiresCustomReason && reasonCharacterCount === 0 && (
                  <span className="text-destructive">Required</span>
                )}
              </div>
            </div>

            {/* Error Alert */}
            {error && <Alert variant="destructive" description={error} />}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleSubmit}
            isPending={isSubmitting || isLoading}
            disabled={
              isSubmitting ||
              isLoading ||
              (requiresCustomReason && !isReasonValid)
            }
            className="min-w-[100px]"
            loadingText="Rejecting..."
          >
            {`Reject ${count > 1 ? `${count}` : ""}`.trim()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
