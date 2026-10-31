// components/ui/toggle-group.tsx
"use client";

import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const toggleGroupContext = React.createContext<{
  type: "single" | "multiple";
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  disabled?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
} | null>(null);

const useToggleGroup = () => {
  const context = React.useContext(toggleGroupContext);
  if (!context) {
    throw new Error("ToggleGroupItem must be used within ToggleGroup");
  }
  return context;
};

export interface ToggleGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toggleGroupVariants> {
  type: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const toggleGroupVariants = cva(
  "inline-flex items-center justify-center gap-0.5 rounded-md bg-muted p-1",
  {
    variants: {
      variant: {
        default: "",
        outline: "bg-transparent border border-border",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      className,
      type,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      variant,
      size,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      defaultValue || (type === "single" ? "" : [])
    );

    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = React.useCallback(
      (itemValue: string) => {
        if (disabled) return;

        let newValue: string | string[];
        
        if (type === "single") {
          newValue = currentValue === itemValue ? "" : itemValue;
        } else {
          const currentArray = currentValue as string[];
          if (currentArray.includes(itemValue)) {
            newValue = currentArray.filter((v) => v !== itemValue);
          } else {
            newValue = [...currentArray, itemValue];
          }
        }

        if (value === undefined) {
          setInternalValue(newValue);
        }
        
        onValueChange?.(newValue);
      },
      [type, currentValue, onValueChange, value, disabled]
    );

    return (
      <toggleGroupContext.Provider
        value={{
          type,
          value: currentValue,
          onValueChange: handleValueChange,
          disabled,
          variant,
          size,
        }}
      >
        <div
          ref={ref}
          className={cn(toggleGroupVariants({ variant, size }), className)}
          role="group"
          {...props}
        >
          {children}
        </div>
      </toggleGroupContext.Provider>
    );
  }
);

ToggleGroup.displayName = "ToggleGroup";