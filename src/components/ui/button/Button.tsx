import React from "react";
import { cn } from "@/lib";
import { Loader } from "lucide-react";
import { ButtonProps } from "./types";
import { sizeClasses, variantClasses } from "./constants";

// Helper to get size-specific spinner
const getLoaderSize = (size: ButtonProps["size"] = "md") => {
  switch (size) {
    case "sm":
      return "size-3";
    case "lg":
      return "size-5";
    default:
      return "size-4";
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isPending = false,
  loadingIcon,
  loadingText,
  leftIcon,
  rightIcon,
  iconOnly = false,
  children,
  className,
  disabled,
  "aria-label": ariaLabel,
  ...props
}) => {
  const isDisabled = disabled || isPending;

  // icon-only buttons require aria-label
  if (iconOnly && !ariaLabel && process.env.NODE_ENV === "development") {
    console.warn(
      "Button with iconOnly prop requires aria-label for accessibility",
    );
  }

  // Base classes with modern styling
  const baseClasses = cn(
    // Layout
    "inline-flex items-center justify-center",
    "rounded-md",

    // Typography
    "font-medium",

    // Transitions & interactions
    "transition-all duration-200",
    "focus-visible:outline-none",
    "active:scale-[0.98]",

    // Disabled state
    "disabled:pointer-events-none",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "disabled:shadow-none",
    "disabled:transform-none",

    // Text handling
    "whitespace-nowrap",

    // Width handling
    "w-auto",
  );

  // Special handling for link variant
  const isLink = variant === "link";

  // Icon-only specific classes
  const iconOnlyClasses =
    iconOnly && !isLink
      ? cn(
          // Make button square by overriding horizontal padding
          "px-0",
          size === "sm" && "w-8",
          size === "md" && "w-10",
          size === "lg" && "w-11",
        )
      : "";

  return (
    <button
      disabled={isDisabled}
      aria-label={iconOnly ? ariaLabel : undefined}
      className={cn(
        baseClasses,
        !isLink && sizeClasses[size],
        !isLink && variantClasses[variant],
        isLink && variantClasses.link,
        iconOnlyClasses,
        className,
      )}
      {...props}
    >
      {isPending ? (
        // Loading state - preserves width by keeping content invisible
        <span className="relative">
          {/* Hidden content to maintain width */}
          <span className="invisible flex items-center justify-center gap-2">
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {!iconOnly && children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </span>

          {/* Loading indicator overlay */}
          <span className="absolute inset-0 flex items-center justify-center">
            {loadingIcon ?? (
              <Loader
                className={cn("animate-spin", getLoaderSize(size))}
                aria-hidden="true"
              />
            )}
            {loadingText && !iconOnly && (
              <span className="ml-2">{loadingText}</span>
            )}
          </span>
        </span>
      ) : (
        // Normal state
        <>
          {leftIcon && !iconOnly && (
            <span className="flex-shrink-0">{leftIcon}</span>
          )}

          {!iconOnly && children && (
            <span
              className={cn(
                "truncate",
                // Allow wrapping on small screens if needed, but prefer truncation
                "max-w-full",
              )}
            >
              {children}
            </span>
          )}

          {rightIcon && !iconOnly && (
            <span className="flex-shrink-0">{rightIcon}</span>
          )}

          {/* icon-only mode - render children as the icon */}
          {iconOnly && children && (
            <span className="flex-shrink-0">{children}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
