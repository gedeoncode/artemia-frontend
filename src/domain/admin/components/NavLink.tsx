

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import clsx from "clsx";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  exact?: boolean;
  collapsed?: boolean;
}

export function NavLink({ href, children, icon, exact = false, collapsed = true }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname?.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "group flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-blue-700 text-white"
          : "text-blue-200 hover:bg-blue-700 hover:text-white"
      )}
    >
      <span
        className={clsx(
          "text-blue-300 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3",
          collapsed ? "mx-auto" : "mr-3"
        )}
      >
        {icon}
      </span>
      {!collapsed && <span>{children}</span>}
    </Link>
  );
}
