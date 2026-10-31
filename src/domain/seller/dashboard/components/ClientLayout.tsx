"use client";

import { useState, useCallback } from "react";
import { Menu, Bell } from "lucide-react";
import { DesktopSidebar, MobileSidebar } from "./Sidebar";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useNavigation } from "../hooks/";
// import { NotificationIcon } from "./components/NotificationsSection/NotificationIcon";
import { cn } from "@/lib";
import { SessionUser } from "@/domain/auth/types";

type Props = {
  seller?: SessionUser | null;
  unreadCount: number;
  children: React.ReactNode;
};

export default function ClientDashboardLayout({
  seller,
  unreadCount,
  children,
}: Props) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { navigateTo, handleLogout } = useNavigation({
    sidebarClose: () => setMobileSidebarOpen(false),
    postLogoutRedirect: "/auth/login",
  });

  const requestLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  const cancelLogout = () => setShowLogoutConfirm(false);

  const closeSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Mobile sidebar backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden",
          "transition-opacity duration-300 ease-out",
          mobileSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        role="button"
        aria-label="Close sidebar"
        tabIndex={mobileSidebarOpen ? 0 : -1}
        onClick={closeSidebar}
        onKeyDown={(e) => e.key === "Enter" && closeSidebar()}
      />

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 md:hidden",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <MobileSidebar
          isOpen={mobileSidebarOpen}
          onClose={closeSidebar}
          navigateTo={navigateTo}
          handleLogout={requestLogout}
          user={seller}
        />
      </div>

      {/* Desktop Sidebar */}
      <DesktopSidebar
        navigateTo={navigateTo}
        handleLogout={requestLogout}
        user={seller}
      />

      {/* Main Content Area */}
      <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header
          className={cn(
            "sticky top-0 z-10 md:hidden",
            "border-b border-gray-200 dark:border-gray-800",
            "bg-white/95 dark:bg-gray-950/95",
            "backdrop-blur-xl supports-[backdrop-filter]:bg-white/80",
            "dark:supports-[backdrop-filter]:bg-gray-950/80",
            "transition-colors duration-200",
          )}
        >
          <div className="flex items-center justify-between px-4 py-3">
            {/* Menu Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={cn(
                "rounded-xl p-2",
                "text-gray-600 dark:text-gray-400",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "active:scale-95",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "dark:focus:ring-offset-gray-950",
              )}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Mobile Brand */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-sm">
                <span className="text-xs font-semibold text-white">S</span>
              </div>

              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Seller Portal
              </span>
            </div>

            {/* Notifications */}
            <div className="flex items-center gap-1">
              <button
                aria-label={`Notifications (${unreadCount} unread)`}
                onClick={() =>
                  navigateTo("/seller/dashboard/notifications")
                }
                className={cn(
                  "relative rounded-xl p-2",
                  "text-gray-600 dark:text-gray-400",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "dark:focus:ring-offset-gray-950",
                )}
              >
                <Bell className="h-5 w-5" />

                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">
          <article className="relative">{children}</article>
        </div>
      </main>

      {/* Logout Confirmation */}
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        title="Sign out"
        message="Are you sure you want to sign out? You'll need to sign in again to access your dashboard."
        confirmLabel="Sign out"
        cancelLabel="Cancel"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        variant="danger"
      />
    </div>
  );
}