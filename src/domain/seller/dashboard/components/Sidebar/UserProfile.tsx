"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, ChevronDown, Settings, HelpCircle, LogOut, User, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cx } from "@/lib/utils/classNames";

type User = {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  businessName?: string;
  verificationStatus?: "pending" | "approved" | "rejected";
};

type Props = {
  user: User;
  compactMode: boolean;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onLogout?: () => void;
  unreadCount?: number;
};

export const UserProfile = ({ 
  user, 
  compactMode, 
  onSettingsClick,
  onHelpClick,
  onLogout,
  unreadCount = 0 
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const isApproved = user?.verificationStatus === "approved";
  const displayName = user?.businessName || user?.name;
  const userInitial = displayName?.charAt(0).toUpperCase() ?? "S";

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="relative">
      {/* User Profile Card */}
      <div
        className={cx(
          // Base styles
          "relative rounded-xl transition-all duration-200",
          "cursor-pointer select-none",
          // Premium styling
          compactMode ? "p-1" : "p-2",
          // Hover effects
          "hover:bg-gray-50 dark:hover:bg-gray-900/50",
          "active:scale-[0.98]",
          // Focus states
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950",
          // Border (subtle)
          "border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
        )}
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleToggle();
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-3">
          {/* Premium Avatar */}
          <div className="relative flex-shrink-0">
            <div className={cx(
              "relative overflow-hidden rounded-full",
              "bg-gradient-to-br from-blue-600 to-blue-500",
              "shadow-md shadow-blue-500/20",
              compactMode ? "w-9 h-9" : "w-10 h-10"
            )}>
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={displayName || "User avatar"}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-white font-semibold text-base">
                  {userInitial}
                </div>
              )}
            </div>

            {/* Online/Status Indicator */}
            {isApproved && (
              <span className={cx(
                "absolute bottom-0 right-0",
                "bg-green-500 rounded-full",
                "ring-2 ring-white dark:ring-gray-950",
                compactMode ? "w-2.5 h-2.5" : "w-3 h-3"
              )}>
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
              </span>
            )}
          </div>

          {/* User Info - Only when not in compact mode */}
          {!compactMode && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {displayName}
                </p>
                {user.role && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {user.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          )}

          {/* Expand/Collapse Chevron & Notification Bell */}
          <div className="flex items-center gap-1">
            {/* Notification Bell - Shown in both modes */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to notifications
                window.location.href = "/seller/dashboard/notifications";
              }}
              className={cx(
                "relative rounded-lg transition-all duration-200",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                compactMode ? "p-1.5" : "p-1.5"
              )}
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <Bell className={cx(
                "text-gray-600 dark:text-gray-400",
                compactMode ? "w-4 h-4" : "w-4 h-4"
              )} />
              
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                </span>
              )}
            </button>

            {/* Chevron - Only in expanded mode */}
            {!compactMode && (
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Menu - Premium floating panel */}
      <AnimatePresence>
        {isOpen && !compactMode && (
          <>
            {/* Click outside backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={handleClose}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cx(
                "absolute top-full left-0 right-0 mt-2 z-50",
                "bg-white dark:bg-gray-950",
                "rounded-lg shadow-xl",
                "border border-gray-200 dark:border-gray-800",
                "overflow-hidden",
                "backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
              )}
            >
              {/* User Info Header */}
              <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {user.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    onSettingsClick?.();
                    handleClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    onHelpClick?.();
                    handleClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Support</span>
                </button>

                <div className="border-t border-gray-200 dark:border-gray-800 my-1" />

                <button
                  onClick={() => {
                    onLogout?.();
                    handleClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>

              {/* Version Info */}
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Seller Portal v2.4.1
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};