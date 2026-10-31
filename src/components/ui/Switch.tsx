"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import clsx from "clsx";

type SwitchVariant = "default" | "primary" | "success" | "danger";
type SwitchSize = "sm" | "md" | "lg";

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  /**
   * Color variant of the switch
   * @default "default"
   */
  variant?: SwitchVariant;
  /**
   * Size of the switch
   * @default "md"
   */
  size?: SwitchSize;
}

const VARIANT_CLASSES: Record<SwitchVariant, string> = {
  default: "bg-input data-[state=checked]:bg-blue-600",
  primary: "bg-gray-200 data-[state=checked]:bg-blue-500",
  success: "bg-gray-200 data-[state=checked]:bg-green-500",
  danger: "bg-gray-200 data-[state=checked]:bg-red-500",
};

const SIZE_CLASSES: Record<
  SwitchSize,
  { root: string; thumb: string; translate: string }
> = {
  sm: {
    root: "h-4 w-8",
    thumb: "h-3 w-3",
    translate:
      "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
  },
  md: {
    root: "h-6 w-11",
    thumb: "h-5 w-5",
    translate:
      "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
  },
  lg: {
    root: "h-8 w-14",
    thumb: "h-7 w-7",
    translate:
      "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0",
  },
};

const SWITCH_BASE =
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const SWITCH_THUMB =
  "pointer-events-none block rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out transform";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, variant = "default", size = "md", ...props }, ref) => {
  return (
    <SwitchPrimitives.Root
      ref={ref}
      className={clsx(
        SWITCH_BASE,
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size].root,
        className
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={clsx(
          SWITCH_THUMB,
          SIZE_CLASSES[size].thumb,
          SIZE_CLASSES[size].translate
        )}
      />
    </SwitchPrimitives.Root>
  );
});

Switch.displayName = "Switch";

export { Switch };
