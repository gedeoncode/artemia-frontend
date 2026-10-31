"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaStore } from "react-icons/fa";

import { type CategoryNode } from "@/domain/home/services/nodeCategories.services";

import {
  UserMenu,
  Topbar,
  MobileCategoryMenu,
  DeskSearchBar,
  MobileQuickAccessBar,
  MobileSearchBar,
  buildMobileQuickAccessItems,
} from ".";

import { useCategoryMenu } from "./hooks";
import { cx } from "@/lib/utils/classNames";
import { DeskCategoryWrapper } from "./desktop";
import { CartLink } from "./CartItem";
import { ROUTES } from "@/constants/routes";

type NavbarProps = {
  rootCategories: CategoryNode[];
};

export function Navbar({ rootCategories }: NavbarProps) {
  const menu = useCategoryMenu();
  const [searchFocused, setSearchFocused] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(false);
  const quickAccessItems = buildMobileQuickAccessItems(rootCategories).map(
    (item) =>
      item.type === "action"
        ? { ...item, icon: <FaStore className="text-xs" /> }
        : item,
  );
  const shouldShowSearchOverlay =
    searchFocused && !menu.isMobileDrawerOpen && !menu.isOpen;
  useEffect(() => {
    if (shouldShowSearchOverlay) {
      setOverlayMounted(true);
    } else {
      const timeout = setTimeout(() => {
        setOverlayMounted(false);
      }, 200); // match animation duration

      return () => clearTimeout(timeout);
    }
  }, [shouldShowSearchOverlay]);

  return (
    <>
      <nav className="relative z-50">
        <Topbar />

        {/* Main Navbar */}
        <div className="border-b border-gray-100 navbar-main-bg">
          <div className="py-2 layout-container lg:py-0">
            <div className="flex items-center justify-between h-15">
              {/* Left */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  className="inline-flex items-center justify-center mt-2 text-gray-700 transition rounded-md hover:bg-gray-100 hover:text-gray-900 lg:hidden"
                  onClick={menu.toggleMobileDrawer}
                  aria-label="Toggle menu"
                  aria-expanded={menu.isMobileDrawerOpen}
                >
                  <FaBars className="text-xl" />
                </button>

                <Link href="/" className="flex items-center h-full">
                  <div className="relative flex-shrink-0 h-14 w-14 sm:h-16 sm:w-16">
                    <Image
                      src="/logo-artemia.png"
                      fill
                      alt="Artemia Logo"
                      className="object-contain"
                      priority
                    />
                  </div>
                  <h1 className="hidden -mb-2 -ml-1 text-xl font-bold leading-none gradient-text sm:inline lg:text-2xl">
                    artemia
                  </h1>
                </Link>
              </div>

              {/* Desktop Search */}
              <div className="flex-1 hidden max-w-xl mx-6 md:block">
                <DeskSearchBar onFocusChange={setSearchFocused} />
              </div>

              {/* Right */}
              <div className="flex items-center gap-3 sm:gap-4">
                <UserMenu />
                <CartLink />
                <Link
                  href={ROUTES.AUTH.REGISTER.EMAIL}
                  className={cx(
                    "hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors lg:inline-flex",
                    "bg-button hover:opacity-90",
                  )}
                >
                  <FaStore className="text-sm" />
                  <span>Vendre</span>
                </Link>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="">
              <MobileSearchBar onFocusChange={setSearchFocused} />
              {!searchFocused && (
                <MobileQuickAccessBar items={quickAccessItems} />
              )}
            </div>
          </div>
        </div>

        {/* Desktop Category Row */}
        {/* <DeskCategoryWrapper
          rootCategories={rootCategories}
          menu={menu}
          searchFocused={searchFocused}
        />

        {/* Mobile Drawer */}
        {menu.isMobile && (
          <MobileCategoryMenu rootCategories={rootCategories} menu={menu} />
        )}
      </nav> 

      {/* Search Overlay */}
      {overlayMounted && (
        <div
          className={cx(
            "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-all duration-200 ease-out",
            shouldShowSearchOverlay
              ? "opacity-100"
              : "opacity-0 backdrop-blur-0",
          )}
          onClick={() => setSearchFocused(false)}
        />
      )}
    </>
  );
}
