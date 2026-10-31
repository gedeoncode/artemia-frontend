"use client";

import { useEffect } from "react";
import {
  X,
  LogOut,
  ChevronRight,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";
import { SidebarLink } from "./SidebarLink";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getNavItems } from "./sidebar-nav-items";
import { translate } from "./sidebar-translations";
import { Seller } from "../../types/dashboard.types";
import { cx } from "@/lib";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  navigateTo: (path: string) => void;
  handleLogout: () => void;
  user?: Seller;
  locale?: string;
};

export const MobileSidebar = ({
  isOpen,
  onClose,
  navigateTo,
  handleLogout,
  user,
  locale = "fr",
}: MobileSidebarProps) => {
  const pathname = usePathname();
  const navItems = getNavItems(locale);
  const userName = user?.businessName || user?.email?.split("@")[0] || "Seller";

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleNavClick = (path: string) => {
    navigateTo(path);
    handleClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={handleClose}
          />

          {/* Sidebar Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={
              translate(locale, "sellerSidebar") ||
              "Seller dashboard mobile menu"
            }
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1],
            }}
            className={cx(
              "fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw]",
              "bg-white dark:bg-gray-950",
              "shadow-2xl",
              "flex flex-col",
              "md:hidden",
            )}
          >
            {/* Header Section with Premium Branding */}
            <div className="relative">
              {/* Gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500" />

              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-white font-bold text-base">A</span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {translate(locale, "Artemia") || "Seller Portal"}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Seller Dashboard
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className={cx(
                    "p-2 rounded-lg",
                    "text-gray-500 dark:text-gray-400",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    "transition-all duration-200 active:scale-95",
                  )}
                  aria-label={translate(locale, "closeMenu") || "Close menu"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User Profile Section (if user exists) */}
            {user && (
              <div
                className={cx(
                  "mx-4 mt-4 p-3 rounded-xl",
                  "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
                  "border border-blue-100 dark:border-blue-900/50",
                  "cursor-pointer transition-all duration-200 hover:scale-[1.02]",
                )}
                onClick={() => {
                  navigateTo("/seller/dashboard/profile");
                  handleClose();
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Premium Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <nav
              role="menu"
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
            >
              <div className="p-4 space-y-1">
                {/* Section Label */}
                <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                  Main Menu
                </div>
                {navItems
                  .filter(
                    (item) =>
                      !item.roles ,
                  )
                  .map((item) => (
                    <SidebarLink
                      key={item.path}
                      href={item.coming_soon ? undefined : item.path}
                      icon={item.icon}
                      isPrimary={item.isPrimary}
                      isActive={pathname === item.path}
                      isCollapsed={false}
                      isComingSoon={item.coming_soon}
                      badge={item.badge}
                      onClick={() => {
                        if (!item.coming_soon) {
                          handleNavClick(item.path);
                        }
                      }}
                      className="w-full"
                    >
                      {item.label}
                    </SidebarLink>
                  ))}

                {/* Divider */}
                <div className="my-4 border-t border-gray-200 dark:border-gray-800" />

                {/* Secondary Navigation */}
                <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                  Support & Resources
                </div>

                <SidebarLink
                  icon={<HelpCircle />}
                  onClick={() => {
                    window.open("/help", "_blank");
                    handleClose();
                  }}
                >
                  Help Center
                </SidebarLink>

                <SidebarLink
                  icon={<Settings />}
                  onClick={() => {
                    navigateTo("/seller/dashboard/settings");
                    handleClose();
                  }}
                >
                  Settings
                </SidebarLink>
              </div>
            </nav>

            {/* Footer Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-3">
              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                  handleClose();
                }}
                className={cx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "text-red-600 dark:text-red-400",
                  "hover:bg-red-50 dark:hover:bg-red-950/50",
                  "transition-all duration-200 active:scale-98",
                  "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                )}
              >
                <LogOut className="w-5 h-5" />
                <span className="flex-1 text-left font-medium">
                  {translate(locale, "logout") || "Sign out"}
                </span>
              </button>

              {/* Version Info */}
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-600 px-1">
                <span>v2.4.1</span>
                <span>© {new Date().getFullYear()}</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
