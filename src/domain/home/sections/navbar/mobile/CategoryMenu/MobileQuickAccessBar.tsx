"use client";

import Link from "next/link";
import { cx } from "@/lib/utils/classNames";

export type QuickAccessItem =
  | {
      type: "category";
      label: string;
      href: string;
    }
  | {
      type: "action";
      label: string;
      href: string;
      icon?: React.ReactNode;
    };

type MobileQuickAccessBarProps = {
  items: QuickAccessItem[];
  className?: string;
};

export function MobileQuickAccessBar({
  items,
  className,
}: MobileQuickAccessBarProps) {
  return (
    <div className={cx("px-0 lg:hidden", className)}>
      <div
        className={cx(
          "flex gap-2 pt-2 pb-1 overflow-x-auto",
          "scrollbar-hidden snap-x snap-mandatory"
        )}
      >
        {items.map((item) => {
          const isAction = item.type === "action";

          return (
            <Link
              key={`${item.type}-${item.href}-${item.label}`}
              href={item.href}
              className={cx(
                "snap-start shrink-0",
                "flex items-center gap-2 px-3 py-2 rounded-full",
                "text-sm font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                "active:scale-[0.97]",
                isAction
                  ? [
                      "bg-button text-white",
                      "hover:opacity-90",
                      "focus:ring-button/40",
                      "shadow-sm",
                    ]
                  : [
                      "bg-slate-100 text-slate-800",
                      "hover:bg-slate-200",
                      "focus:ring-slate-300",
                    ]
              )}
            >
              {"icon" in item && item.icon && (
                <span className="flex items-center text-xs opacity-90">
                  {item.icon}
                </span>
              )}

              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}