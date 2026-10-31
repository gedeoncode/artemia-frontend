"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  HelpCircle,
  Megaphone,
} from "lucide-react";

import { SidebarLink } from "./SidebarLink";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getNavItems } from "./sidebar-nav-items";
import { translate } from "./sidebar-translations";
import { cx } from "@/lib/utils/classNames";
import { Seller } from "../../types/dashboard.types";

type DesktopSidebarProps = {
  navigateTo: (path: string) => void;
  handleLogout: () => void;
  user: Seller;
  locale?: string;
};

// Premium spacing constants
const SIDEBAR_WIDTHS = {
  expanded: "w-72",
  collapsed: "w-[72px]",
};

const TRANSITION_CLASSES = "transition-all duration-200 ease-out";

export const DesktopSidebar = ({
  navigateTo,
  handleLogout,
  user,
  locale = "fr",
}: DesktopSidebarProps) => {
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "sidebar-collapsed",
    false,
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isExpanded = false;
  const currentWidth =
    isCollapsed && !isExpanded
      ? SIDEBAR_WIDTHS.collapsed
      : SIDEBAR_WIDTHS.expanded;
  const showFullContent = !isCollapsed || isExpanded;
  const showCompactContent = showFullContent;

  const navItems = useMemo(() => getNavItems(locale), [locale]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((v) => !v);
  }, [setIsCollapsed]);

  const onLogout = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleLogout();
    },
    [handleLogout],
  );

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <>
      {/* Premium backdrop for hover preview */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-20 bg-black/5 backdrop-blur-[1px] pointer-events-none"
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar"
        role="navigation"
        aria-label={translate(locale, "sellerSidebar")}
        className={cx(
          "hidden md:flex flex-col h-screen sticky top-0 z-30",
          "bg-white dark:bg-gray-950",
          "border-r border-gray-200 dark:border-gray-800",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.02),8px_0_24px_rgba(0,0,0,0.04)]",
          currentWidth,
          TRANSITION_CLASSES,
          // Smooth width transition without layout shift
          "will-change-auto",
          // Ensure proper stacking context
          "isolate",
        )}
      >
        {/* Sidebar inner container with premium spacing */}
        <div
          className={cx(
            "flex flex-col h-full",
            TRANSITION_CLASSES,
            showCompactContent ? "gap-1" : "gap-2",
          )}
        >
          {/* ===== SECTION 1: BRAND / HEADER ===== */}
          <div
            className={cx(
              "border-b border-gray-200 dark:border-gray-800",
              showCompactContent ? "pb-2" : "pb-3",
              showFullContent ? "mx-3" : "mx-2",
              TRANSITION_CLASSES,
            )}
          >
            <div
              className={cx(
                "flex items-center justify-between",
                showFullContent ? "py-2" : "py-3 justify-center",
                TRANSITION_CLASSES,
              )}
            >
              {showFullContent && (
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">S</span>
                  </div>
                  <div className="flex-1">
                    <h1 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                     Artemia
                     {/* this will be changed later to seller store name */}
                    </h1>

                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Seller Dashboard
                    </p>
                  </div>
                </div>
              )}

              {/* Collapse Toggle Button - Premium treatment */}
              <button
                onClick={toggleSidebar}
                className={cx(
                  "rounded-lg transition-all duration-200",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950",
                  showFullContent
                    ? "p-1.5 hover:scale-95"
                    : "p-2 w-full flex justify-center",
                )}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {!isCollapsed || isExpanded ? (
                  <PanelLeftClose className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
          {/* ===== SECTION 3: PRIMARY NAVIGATION ===== */}
          <nav
            className={cx(
              "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700",
              showCompactContent ? "my-1" : "my-2",
            )}
          >
            <div
              className={cx(showFullContent ? "mx-2" : "mx-1", "space-y-0.5")}
            >
              {navItems.map((item, index) => {
            
                const isFirstPrimary = item.isPrimary && index < 3;

                return (
                  <div key={item.path}>
                    {/* Section divider for primary items */}
                    {isFirstPrimary && index === 0 && (
                      <div
                        className={cx(
                          "px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600",
                          !showFullContent && "sr-only",
                        )}
                      >
                        Main
                      </div>
                    )}

                    <SidebarLink
                      href={item.path}
                      icon={item.icon }
                      isActive={pathname === item.path}
                      isCollapsed={isCollapsed}
                      isPrimary={item.isPrimary}
                      badge={item.badge}
                      isComingSoon={item.coming_soon}
                    >
                      {item.label}
                    </SidebarLink>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* ===== SECTION 4: SECONDARY / SYSTEM NAVIGATION ===== */}
          <div
            className={cx(
              "border-t border-gray-200 dark:border-gray-800 pt-2",
              showFullContent ? "mx-3" : "mx-2",
            )}
          >
            <div className={cx("space-y-0.5", TRANSITION_CLASSES)}>
              {/* Help & Support */}
              {showFullContent && (
                <div className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                  Support
                </div>
              )}

              <button
                onClick={() => window.open("/help", "_blank")}
                className={cx(
                  "w-full flex items-center gap-3 rounded-lg text-sm text-gray-600 dark:text-gray-400",
                  "hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-200",
                  "transition-all duration-150",
                  showFullContent ? "px-3 py-2" : "px-2 py-2 justify-center",
                )}
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                {showFullContent && (
                  <span className="flex-1 text-left">Help & Resources</span>
                )}
                {showFullContent && (
                  <ChevronRight className="w-3 h-3 opacity-40" />
                )}
              </button>

              {/* Announcements */}
              <button
                onClick={() => navigateTo("/announcements")}
                className={cx(
                  "w-full flex items-center gap-3 rounded-lg text-sm text-gray-600 dark:text-gray-400",
                  "hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-200",
                  "transition-all duration-150",
                  showFullContent ? "px-3 py-2" : "px-2 py-2 justify-center",
                )}
              >
                <Megaphone className="w-4 h-4 shrink-0" />
                {showFullContent && (
                  <span className="flex-1 text-left">Announcements</span>
                )}
              </button>
            </div>
          </div>

          {/* ===== SECTION 5: UTILITIES / PREFERENCES ===== */}
          <div
            className={cx(
              "border-t border-gray-200 dark:border-gray-800",
              showFullContent ? "mx-3 pt-2" : "mx-2 pt-2",
            )}
          >
            <div className="space-y-0.5">
              {/* Settings */}
              <button
                onClick={() => navigateTo("/settings")}
                className={cx(
                  "w-full flex items-center gap-3 rounded-lg text-sm text-gray-600 dark:text-gray-400",
                  "hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-200",
                  "transition-all duration-150",
                  showFullContent ? "px-3 py-2" : "px-2 py-2 justify-center",
                )}
              >
                <Settings className="w-4 h-4 shrink-0" />
                {showFullContent && (
                  <span className="flex-1 text-left">Settings</span>
                )}
              </button>
            </div>
          </div>

          {/* ===== SECTION 6: FOOTER / ACCOUNT ACTIONS ===== */}
          <div
            className={cx(
              "border-t border-gray-200 dark:border-gray-800",
              showFullContent ? "mx-3 pt-2 pb-3" : "mx-2 pt-2 pb-3",
            )}
          >
            <button
              onClick={onLogout}
              className={cx(
                "w-full flex items-center gap-3 rounded-lg text-sm transition-all duration-150",
                "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50",
                showFullContent ? "px-3 py-2" : "px-2 py-2 justify-center",
              )}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {showFullContent && (
                <span className="flex-1 text-left">Sign out</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
