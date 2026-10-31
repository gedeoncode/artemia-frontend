"use client";
import { useMemo, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  BarChart3,
  BadgeCheck,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { NavLink } from "./NavLink";
import { navItems } from "../utils/nav-items";
import { UserRole } from "@/types";
interface SidebarProps {
  role: UserRole;
}

function SidebarContent({ role }: SidebarProps) {
  const [openMobile, setOpenMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Safe localStorage access
  const getInitialCollapsedState = () => {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem("sidebar-collapsed");
      return stored === "true";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    setIsClient(true);
    setCollapsed(getInitialCollapsedState());
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("sidebar-collapsed", String(collapsed));
      } catch (e) {
        console.error("Failed to save sidebar state", e);
      }
    }
  }, [collapsed, isClient]);

  const filteredItems = useMemo(
    () => navItems.filter((item) => item.roles.includes(role)),
    [role],
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpenMobile(!openMobile)}
        className="fixed z-50 p-2 text-white bg-blue-800 rounded-md top-4 left-4 md:hidden"
        aria-label="Toggle sidebar"
      >
        {openMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar - now initialized with correct width immediately */}
      <aside
        className={`fixed inset-y-0 z-40 flex flex-col bg-gradient-to-b from-blue-900 to-blue-800 shadow-xl transform transition-transform duration-300 ease-in-out
          ${openMobile ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:flex
          ${collapsed ? "w-16" : "w-64"}
          ${isClient ? "transition-all duration-300" : ""}`}
      >
        {/* Collapse/Expand Toggle (desktop only) */}
        <div className="items-center justify-end hidden p-2 border-b border-blue-700 md:flex">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-blue-300 transition-colors duration-200 rounded-sm hover:bg-white/20 cursor-w-resize"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Header */}
        {!collapsed && (
          <div className="flex items-center gap-2 p-4 text-xl font-bold border-b border-blue-700">
            <BarChart3 className="w-6 h-6 text-blue-300" />
            <span className="text-white">Admin Panel</span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {filteredItems.map(({ href, label, icon: Icon, exact }) => (
            <NavLink
              key={href}
              href={href}
              icon={<Icon className="w-5 h-5" />}
              exact={exact}
              collapsed={collapsed}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center justify-center p-2 text-sm text-blue-200 rounded-lg bg-blue-800/50">
            <BadgeCheck className="w-4 h-4 mr-2" />
            {!collapsed && (
              <span>{role.charAt(0).toUpperCase() + role.slice(1)} Mode</span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <ErrorBoundary
      fallback={<div className="p-4 text-red-500">Sidebar unavailable</div>}
    >
      <SidebarContent {...props} />
    </ErrorBoundary>
  );
}
