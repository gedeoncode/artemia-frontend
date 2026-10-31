import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils/";

const checkboxVariants = cva(
  "peer shrink-0 rounded border border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-white hover:border-gray-400 focus:border-primary-500 focus:ring-primary-100 text-primary-600",
        primary:
          "bg-primary-600 border-primary-600 hover:bg-primary-700 hover:border-primary-700 focus:ring-primary-100 text-white",
        destructive:
          "bg-destructive-600 border-destructive-600 hover:bg-destructive-700 hover:border-destructive-700 focus:ring-destructive-100 text-white",
      },
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof checkboxVariants> {
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      variant,
      size,
      indeterminate = false,
      checked,
      onChange,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      onChange?.(e);
    };
    return (
      <input
        type="checkbox"
        className={cn(
          checkboxVariants({ variant, size, className }),
          indeterminate && "bg-gray-100 border-gray-300"
        )}
        ref={ref || internalRef}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
