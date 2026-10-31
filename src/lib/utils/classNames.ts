import clsx from "clsx";

// Utility to combine class names
export const cx = (...classes: any[]) => clsx(classes);

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
