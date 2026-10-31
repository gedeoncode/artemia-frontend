"use client";

import React from "react";
import { cn } from "@/lib/utils/"; // optional class merge helper

interface SectionHeaderProps {
  /** Title text or custom ReactNode (e.g. with Badge or icon inline) */
  title: string | React.ReactNode;
  /** Optional short description below the title */
  description?: string | React.ReactNode;
  /** Optional icon displayed to the left of the title */
  icon?: React.ReactNode;
  /** Optional action buttons on the right side */
  actions?: React.ReactNode;
  /** Optional class override */
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  icon,
  actions,
  className,
}) => {
  return (
    <header className={cn("pb-6 border-b border-gray-200", className)}>
      <div className="flex items-start justify-between gap-4">
        {/* Title + Description */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            {icon && <span className="text-gray-700">{icon}</span>}

            {/* title can be string or ReactNode */}
            {typeof title === "string" ? (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            ) : (
              title
            )}
          </div>

          {description && typeof description === "string" ?
          
           (
            <p className="max-w-2xl text-xs sm:text-sm text-gray-600">{description}</p>
          ): ( description)}
        </div>

        {/* Optional right-side actions */}
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </header>
  );
};
