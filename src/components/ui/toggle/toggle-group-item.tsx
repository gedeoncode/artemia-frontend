// components/ui/toggle-group-item.tsx
"use client";

import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { toggleGroupContext } from "./toggle-group";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-sm text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm hover:bg-muted hover:text-muted-foreground",
        outline:
          "border border-transparent data-[state=on]:border-border data-[state=on]:bg-background data-[state=on]:text-foreground hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-3 min-w-[2.5rem]",
        sm: "h-8 px-2 min-w-[2rem] text-xs",
        lg: "h-10 px-4 min-w-[3rem] text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ToggleGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  value: string;
  asChild?: boolean;
}

export const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(({ className, children, value, variant, size, disabled, ...props }, ref) => {
  const context = React.useContext(toggleGroupContext);
  
  if (!context) {
    throw new Error("ToggleGroupItem must be used within ToggleGroup");
  }

  const { type, value: groupValue, onValueChange, disabled: groupDisabled, variant: groupVariant, size: groupSize } = context;
  
  const isSelected = type === "single"
    ? groupValue === value
    : (groupValue as string[]).includes(value);

  const handleClick = () => {
    if (disabled || groupDisabled) return;
    onValueChange(value);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={isSelected}
      data-state={isSelected ? "on" : "off"}
      data-value={value}
      onClick={handleClick}
      disabled={disabled || groupDisabled}
      className={cn(
        toggleVariants({ 
          variant: variant || groupVariant, 
          size: size || groupSize 
        }),
        isSelected && "cursor-default",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

ToggleGroupItem.displayName = "ToggleGroupItem";