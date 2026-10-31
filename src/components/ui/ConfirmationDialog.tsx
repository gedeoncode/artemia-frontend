"use client";

import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiX,
  FiLoader,
} from "react-icons/fi";
import { Button } from "./button/Button";
import { cn } from "@/lib/utils/";

export type DialogVariant =
  | "primary"
  | "danger"
  | "warning"
  | "info"
  | "success";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: DialogVariant;
  isLoading?: boolean;
  disableConfirm?: boolean;
  disableCancel?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  confirmButtonType?: "button" | "submit" | "reset";
  className?: string;
}

const variantConfig = {
  primary: {
    icon: FiAlertCircle,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    buttonColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
  danger: {
    icon: FiAlertTriangle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  warning: {
    icon: FiAlertTriangle,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
  },
  info: {
    icon: FiInfo,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    buttonColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
  success: {
    icon: FiCheckCircle,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    buttonColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
  },
};

const sizeConfig = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "primary",
  isLoading = false,
  disableConfirm = false,
  disableCancel = false,
  size = "md",
  showCloseButton = true,
  confirmButtonType = "button",
  className = "",
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const config = variantConfig[variant];
  const IconComponent = config.icon;
  const sizeClass = sizeConfig[size];

  // ──────────────── Handle Escape Key + Body Scroll ────────────────
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  // ──────────────── Focus management ────────────────
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => confirmButtonRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // ──────────────── Focus trap ────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusableElements =
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
      if (!focusableElements?.length) return;
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          event.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  if (!isOpen) return null;

  // ──────────────── Handlers ────────────────
  const handleConfirm = () => {
    if (!isLoading && !disableConfirm) onConfirm();
  };
  const handleCancel = () => {
    if (!isLoading && !disableCancel) onCancel();
  };

  // ──────────────── Dialog JSX ────────────────
  const dialog = (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity",
        className,
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClick={handleCancel} // backdrop click closes
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking content
        className={`relative w-full ${sizeClass} transform overflow-hidden rounded-xl bg-white shadow-xl transition-all`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${config.borderColor} ${config.bgColor}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
              <h3
                id="dialog-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h3>
            </div>
            {showCloseButton && (
              <button
                onClick={handleCancel}
                disabled={isLoading || disableCancel}
                className="p-1 text-gray-400 transition-colors rounded-full hover:text-gray-600 disabled:opacity-50 hover:bg-gray-100"
                aria-label="Close dialog"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div id="dialog-description" className="text-gray-700">
            {typeof message === "string" ? (
              <p className="whitespace-pre-wrap">{message}</p>
            ) : (
              message
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            {cancelLabel === "" ? (
              ""
            ) : (
              <Button
                variant="outline"
                ref={cancelButtonRef}
                type="button"
                onClick={handleCancel}
                disabled={isLoading || disableCancel}
              >
                {cancelLabel}
              </Button>
            )}

            <Button
              variant={variant}
              ref={confirmButtonRef}
              type={confirmButtonType}
              onClick={handleConfirm}
              disabled={isLoading || disableConfirm}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <FiLoader className="animate-spin" />
                  {confirmLabel ? `${confirmLabel}.... ` : "Publishing..."}
                </span>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render via portal for true isolation
  return ReactDOM.createPortal(dialog, document.body);
};

// Specialized variants
export const DangerDialog = (
  props: Omit<ConfirmationDialogProps, "variant">,
) => <ConfirmationDialog {...props} variant="danger" />;
export const WarningDialog = (
  props: Omit<ConfirmationDialogProps, "variant">,
) => <ConfirmationDialog {...props} variant="warning" />;
export const InfoDialog = (props: Omit<ConfirmationDialogProps, "variant">) => (
  <ConfirmationDialog {...props} variant="info" />
);
export const SuccessDialog = (
  props: Omit<ConfirmationDialogProps, "variant">,
) => <ConfirmationDialog {...props} variant="success" />;

// Hook for managing dialog state
export const useDialog = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
};
