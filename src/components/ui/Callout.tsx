import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/classNames";
import {
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  StickyNote,
  LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Variants */
/* ------------------------------------------------------------------ */

const calloutVariants = cva(
  "relative w-full text-sm leading-relaxed transition-colors",
  {
    variants: {
      variant: {
        info: "border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-100",
        warning:
          "border-amber-200 bg-amber-50/50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100",
        success:
          "border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100",
        danger:
          "border-red-200 bg-red-50/50 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100",
        neutral:
          "border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100",
      },
      inline: {
        true: "inline-flex items-center rounded-md border px-2.5 py-1 font-medium",
        false: "flex rounded-md border p-4 shadow-sm",
      },
      note: {
        true: "rounded-l-none border-l-4",
        false: "",
      },
    },
    compoundVariants: [
      { variant: "info", note: true, className: "border-l-blue-500" },
      { variant: "warning", note: true, className: "border-l-amber-500" },
      { variant: "success", note: true, className: "border-l-emerald-500" },
      { variant: "danger", note: true, className: "border-l-red-500" },
      { variant: "neutral", note: true, className: "border-l-slate-400" },
    ],
    defaultVariants: {
      variant: "neutral",
      inline: false,
      note: false,
    },
  }
);

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

const variantIcons: Record<
  NonNullable<VariantProps<typeof calloutVariants>["variant"]>,
  LucideIcon
> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  danger: XCircle,
  neutral: StickyNote,
};

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  title?: string;
  icon?: LucideIcon;
  showIcon?: boolean;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export function Callout({
  className,
  variant = "neutral",
  inline = false,
  note = false,
  showIcon = true,
  title,
  icon: CustomIcon,
  children,
  ...props
}: CalloutProps) {
  const Icon = CustomIcon ?? variantIcons[variant ?? "neutral"];

  // Semantic accessibility: use "alert" role for dangerous/urgent items
  const isAlert = variant === "danger" || variant === "warning";

  return (
    <div
      role={isAlert ? "alert" : "note"}
      aria-live={isAlert ? "polite" : "off"}
      className={cn(calloutVariants({ variant, inline, note }), className)}
      {...props}
    >
      <div className={cn("flex w-full gap-3", inline && "items-center")}>
        {showIcon && (
          <Icon
            className={cn(
              "shrink-0",
              inline ? "h-3.5 w-3.5" : "mt-0.5 h-5 w-5",
              // Semantic coloring for the icon
              variant === "info" && "text-blue-600 dark:text-blue-400",
              variant === "warning" && "text-amber-600 dark:text-amber-400",
              variant === "success" && "text-emerald-600 dark:text-emerald-400",
              variant === "danger" && "text-red-600 dark:text-red-400",
              variant === "neutral" && "text-slate-500 dark:text-slate-400"
            )}
            strokeWidth={2.25}
          />
        )}

        <div className={cn("flex-1 space-y-1", inline && "space-y-0")}>
          {title && !inline && (
            <h5 className="font-bold leading-none tracking-tight mb-1.5">
              {title}
            </h5>
          )}
          <div
            className={cn(
              "prose-sm prose-current opacity-90",
              inline && "leading-none font-medium"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
