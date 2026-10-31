// components/ui/Progress.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils/";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // Progress percentage (0–100)
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800",
          className
        )}
        {...props}
      >
        <div
          className="h-full transition-all duration-300 ease-in-out bg-blue-600"
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";
