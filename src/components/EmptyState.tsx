import React from "react"
import { LucideIcon } from "lucide-react";
import { Package,PackageX, Search } from "lucide-react";

import { cx } from "@/lib/utils/classNames";
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "package" | "search" | string | LucideIcon;
  className?: string;
  action?: string | React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon = "package",
  className,
  action
}: EmptyStateProps) {
  let IconComponent: LucideIcon;

  if (typeof icon === "string") {
    switch (icon) {
      case "package":
        IconComponent = Package;
        break;
      case "empty":
        IconComponent = PackageX;
        break;
      case "search":
        IconComponent = Search;
        break;
      default:
        IconComponent = Package;
    }
  } else {
    IconComponent = icon;
  }

  return (
    <div
      className={cx(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
        <IconComponent className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="mb-1 text-lg font-medium text-gray-900">{title}</h3>
      <p className="max-w-md text-sm text-gray-500">{description}</p>
      {action && action}
    </div>
  );
}
