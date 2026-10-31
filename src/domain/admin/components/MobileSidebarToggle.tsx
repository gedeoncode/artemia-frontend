"use client";
import { ArrowPathIcon, Bars3Icon, CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon, CogIcon, ShoppingBagIcon, UsersIcon } from "lucide-react";
import { useState, useEffect } from "react";

export function MobileSidebarToggle() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle body overflow when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  // Close sidebar when clicking on a nav item
  const handleNavigation = () => {
    setIsOpen(false);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const toggleButton = document.getElementById("mobile-sidebar-toggle");
      
      if (
        isOpen &&
        sidebar &&
        toggleButton &&
        !sidebar.contains(event.target as Node) &&
        !toggleButton.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        id="mobile-sidebar-toggle"
        type="button"
        className="fixed z-50 p-2 ml-2 text-gray-700 rounded-lg md:hidden top-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" aria-hidden="true" />
      )}

      {/* Mobile sidebar */}
      <aside
        id="mobile-sidebar"
        className={`fixed inset-y-0 z-40 w-64 transition-transform duration-300 ease-in-out bg-gradient-to-b from-blue-900 to-blue-800 shadow-xl md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 text-xl font-bold border-b border-blue-700">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="w-6 h-6 text-blue-300" />
            <span className="text-white">Admin Panel</span>
          </div>
          <button
            type="button"
            className="p-1 text-blue-300 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1" onClick={handleNavigation}>
          <NavLink
            href="/admin"
            icon={<ChartBarIcon className="w-5 h-5 text-blue-300" />}
            exact
          >
            Dashboard
          </NavLink>
          <NavLink
            href="/admin/sellers"
            icon={<UsersIcon className="w-5 h-5 text-blue-300" />}
          >
            Sellers
          </NavLink>
          <NavLink 
            href="/admin/users" 
            icon={<UsersIcon className="w-5 h-5 text-blue-300" />}
          >
            Users
          </NavLink>
          <NavLink
            href="/admin/products"
            icon={<ShoppingBagIcon className="w-5 h-5 text-blue-300" />}
          >
            Products
          </NavLink>
          <NavLink
            href="/admin/orders"
            icon={<ArrowPathIcon className="w-5 h-5 text-blue-300" />}
          >
            Orders
          </NavLink>
          <NavLink
            href="/admin/settings"
            icon={<CogIcon className="w-5 h-5 text-blue-300" />}
          >
            Settings
          </NavLink>
        </nav>
        
        {/* Mobile sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <div className="flex items-center justify-center p-2 text-sm text-blue-200 rounded-lg bg-blue-800/50">
            <CheckBadgeIcon className="w-4 h-4 mr-2" />
            <span>Admin Mode</span>
          </div>
        </div>
      </aside>
    </>
  );
}

// Reusable NavLink component for mobile sidebar
function NavLink({
  href,
  icon,
  children,

}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  exact?: boolean;
}) {
  return (
    <a
      href={href}
      className="flex items-center p-2 text-base font-medium text-blue-200 rounded-lg hover:bg-blue-700 group"
    >
      <span className="flex-shrink-0 w-6 h-6">{icon}</span>
      <span className="ml-3">{children}</span>
    </a>
  );
}