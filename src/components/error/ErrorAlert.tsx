"use client";

import { AlertCircle } from "lucide-react";

export interface ErrorAlertProps {
  /** Title of the error block */
  title?: string;
  /** Main error message */
  message: string ;
  details?: React.ReactNode;
}

export function ErrorAlert({ title = "Unable to proceed", message, details }: ErrorAlertProps) {
  return (
    <div
      className="p-4 mb-8 border border-red-200 rounded-lg bg-red-50"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-red-800">
          <p className="font-medium">{title}</p>
          <p>{message}</p>
          {details && <div className="mt-2 text-xs text-red-700">{details}</div>}
        </div>
      </div>
    </div>
  );
}
