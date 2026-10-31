"use client";

import { memo, ReactNode, useCallback } from "react";
import Link from "next/link";
import clsx from "clsx";

import { useComingSoon } from "@/context/ComingSoonProvider";

type SidebarLinkProps = {
  href?: string;
  icon: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  isCollapsed?: boolean;
  isPrimary?: boolean;
  isActive?: boolean;
  badge?: number;
  isComingSoon?: boolean;
  className?: string;
};

export const SidebarLink = memo(function SidebarLink({
  href,
  icon,
  children,
  onClick,
  isCollapsed = false,
  isPrimary = false,
  isActive = false,
  badge,
  isComingSoon = false,
  className,
}: SidebarLinkProps) {
  const { showComingSoon } = useComingSoon();

  const handleClick = useCallback(() => {
    if (isComingSoon) {
      showComingSoon(
        typeof children === "string" ? children : "Feature",
      );
      return;
    }

    onClick?.();
  }, [isComingSoon, showComingSoon, children, onClick]);

  const isButton = !href || href === "#" || isComingSoon;

  const classes = clsx(
    "group relative flex items-center gap-3 rounded-xl",
    "px-3 py-2.5",
    "text-sm font-medium",
    "transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-blue-500",
    isCollapsed && "justify-center px-0",

    isComingSoon && [
      "text-gray-500 dark:text-gray-400",
      "hover:bg-amber-50 dark:hover:bg-amber-950/20",
      "hover:text-amber-700 dark:hover:text-amber-400",
    ],

    !isComingSoon &&
      (isActive
        ? [
            "bg-blue-50 dark:bg-blue-950/40",
            "text-blue-700 dark:text-blue-400",
          ]
        : [
            "text-gray-600 dark:text-gray-400",
            "hover:bg-gray-100 dark:hover:bg-gray-900",
            "hover:text-gray-900 dark:hover:text-gray-200",
          ]),

    isPrimary &&
      !isActive &&
      !isComingSoon &&
      "border border-blue-100 dark:border-blue-900/40",

    className,
  );

  const content = (
    <>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {icon}
      </span>

      {!isCollapsed && (
        <span className="flex-1 truncate">{children}</span>
      )}

      {isComingSoon && !isCollapsed && (
        <span
          className="
            ml-auto
            rounded-full
            bg-amber-100
            px-2
            py-0.5
            text-[10px]
            font-medium
            uppercase
            tracking-wide
            text-amber-700
            dark:bg-amber-950/40
            dark:text-amber-400
          "
        >
          Soon
        </span>
      )}

      {!isComingSoon &&
        badge !== undefined &&
        badge > 0 && (
          <span
            className={clsx(
              "inline-flex min-w-5 items-center justify-center rounded-full",
              "px-1.5 py-0.5 text-xs font-medium",
              isActive
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
              isCollapsed && "h-2 w-2 min-w-0 p-0"
            )}
          >
            {!isCollapsed && (badge > 99 ? "99+" : badge)}
          </span>
        )}

      {isComingSoon && isCollapsed && (
        <span
          className="
            absolute
            right-2
            top-2
            h-2
            w-2
            rounded-full
            bg-amber-500
          "
        />
      )}
    </>
  );

  if (isButton) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={classes}
        aria-current={isActive ? "page" : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={classes}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </Link>
  );
});