"use client";

import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/context/AuthContext";

function UserMenuComponent() {
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const firstName = useMemo(() => {
    if (!user?.name) return "Utilisateur";
    return user.name.split(" ")[0] || "Utilisateur";
  }, [user?.name]);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onLogout = useCallback(async () => {
    try {
      closeMenu();
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    }
  }, [logout, closeMenu]);

  /** Close on outside click */
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeMenu]);

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center space-x-1 text-gray-700 rounded hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Login"
      >
        <FaRegUser className="text-lg" aria-hidden="true" />
        <span className="hidden text-sm font-medium sm:inline">Connexion</span>
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative z-[200] select-none">
      <button
        type="button"
        onClick={toggleMenu}
        className="flex items-center space-x-1 text-gray-700 rounded hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        <FaRegUser className="text-lg" aria-hidden="true" />
        <span className="hidden text-sm font-medium sm:inline">
          {firstName}
        </span>
      </button>

      <div
        className={`absolute right-0 mt-1 w-48 origin-top-right rounded-sm bg-white shadow-xl ring-1 ring-black ring-opacity-5 transition-all duration-150 ease-out ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        role="menu"
        aria-label="User options"
      >
        <div className="py-1">
          <Link
            href="/account"
            onClick={closeMenu}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Mon compte
          </Link>

          <Link
            href="/account/orders"
            onClick={closeMenu}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Mes commandes
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
            role="menuitem"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

export const UserMenu = memo(UserMenuComponent);
