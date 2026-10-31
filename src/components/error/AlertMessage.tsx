"use client";

import React from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";
import clsx from "clsx";

type AlertVariant = "error" | "warning" | "success" | "info";

interface AlertMessageProps {
  message?: string | React.ReactNode;
  variant?: AlertVariant;
  className?: string;
  id?: string
}


const variantStyles: Record<AlertVariant, string> = {
  error: "text-red-600 border-red-200 bg-red-50",
  warning: "text-yellow-700 border-yellow-200 bg-yellow-50",
  success: "text-green-700 border-green-200 bg-green-50",
  info: "text-blue-700 border-blue-200 bg-blue-50",
};

const variantIcons: Record<AlertVariant, React.ElementType> = {
  error: FiAlertCircle,
  warning: FiAlertTriangle,
  success: FiCheckCircle,
  info: FiInfo,
  
};

export function AlertMessage ({
  message,
  variant = "info",
  className,
  id
}: AlertMessageProps) {
  if (!message) return null;

  const Icon = variantIcons[variant];

  return (
    <div
    id={id}
      className={clsx(
        "flex items-center gap-2 px-3 py-2 text-sm border rounded-lg",
        variantStyles[variant],
        className
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      <Icon className="flex-shrink-0 w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};

