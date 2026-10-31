"use client";

import { Info } from "lucide-react";
import { ReactNode } from "react";

export interface InfoNoteProps {
  /** Title of the note */
  title?: string;
  /** Main note message — can now be text or JSX */
  message: ReactNode;
  /** Whether to use blue (default) or neutral styles */
  variant?: "info" | "neutral";
}

export function InfoNote({ title, message, variant = "info" }: InfoNoteProps) {
  const styles =
    variant === "info"
      ? {
          container: "text-blue-800",
          icon: "text-blue-600",
        }
      : {
          container: "text-gray-700",
          icon: "text-gray-500",
        };

  return (
    <div
      className={`mb-2 ${styles.container}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start">
        <Info className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${styles.icon}`} />
        <div className="text-sm">
          {title && <p className="font-medium">{title}</p>}
          {message && <div className="space-y-1">{message}</div>}
        </div>
      </div>
    </div>
  );
}
