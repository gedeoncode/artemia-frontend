import { cn } from "@/lib/utils/";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

const badgeVariants = {
  // Base variants
  default: "bg-gray-100 text-gray-800",
  primary: "bg-blue-100 text-blue-800",
  secondary: "bg-purple-100 text-purple-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  outline:
    "border border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50",

  // Status variants
  activated: "bg-green-100 text-green-800",
  pending: "border border-gray-300 bg-transparent text-gray-700",
  deleted: "bg-red-100 text-red-800",
  draft: "bg-purple-100 text-purple-800",
  archived: "bg-gray-100 text-gray-600",
  out_of_stock: "bg-red-100 text-red-800",

} as const;

const badgeSizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
} as const;

const badgeRounded = {
  full: "rounded-full",
  lg: "rounded-lg",
  md: "rounded-md",
  sm: "rounded-sm",
  none: "rounded-none",
} as const;

type BadgeVariant = keyof typeof badgeVariants;
type BadgeSize = keyof typeof badgeSizes;
type BadgeRounded = keyof typeof badgeRounded;

interface BadgeProps extends ComponentPropsWithoutRef<"div"> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: BadgeRounded;
}

const Badge = forwardRef<ElementRef<"div">, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      rounded = "full",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium whitespace-nowrap transition-colors",
          badgeVariants[variant],
          badgeSizes[size],
          badgeRounded[rounded],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
export type { BadgeProps, BadgeVariant, BadgeSize, BadgeRounded };
