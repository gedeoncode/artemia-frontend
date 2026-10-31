import React, { ReactNode } from "react";
import { FiAlertCircle, FiInfo } from "react-icons/fi";
import clsx from "clsx";

type FeedbackType = "error" | "info";
type FeedbackVariant = "inline" | "card";

interface FormFieldFeedbackProps {
  message?: string;
  type?: FeedbackType;
  variant?: FeedbackVariant;

  /**
   * Optional custom icon override
   * If not provided, defaults to type-based icon
   */
  icon?: ReactNode;

  className?: string;
}

/**
 * FormFieldFeedback
 * Unified form feedback component (info + error) with icon override support.
 */
export function FormFieldFeedback({
  message,
  type = "error",
  variant = "inline",
  icon,
  className,
}: FormFieldFeedbackProps) {
  if (!message) return null;

  const defaultIcons = {
    error: FiAlertCircle,
    info: FiInfo,
  };

  const DefaultIcon = defaultIcons[type];

  const baseStyles = "flex items-start gap-2 text-sm";

  const typeStyles: Record<FeedbackType, Record<FeedbackVariant, string>> = {
    error: {
      inline: "text-red-600",
      card: "text-red-700 border border-red-200 bg-red-50 rounded-lg px-3 py-2",
    },
    info: {
      inline: "text-blue-600",
      card: "text-blue-700 border border-blue-200 bg-blue-50 rounded-lg px-3 py-2",
    },
  };

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
      className={clsx(baseStyles, typeStyles[type][variant], className)}
    >
      {/* Icon */}
      <span className="flex-shrink-0 w-4 h-4 mt-0.5">
        {icon ?? <DefaultIcon className="w-4 h-4" />}
      </span>

      {/* Message */}
      <span className="leading-snug">{message}</span>
    </div>
  );
}