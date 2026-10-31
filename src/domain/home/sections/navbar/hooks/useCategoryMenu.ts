"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useBreakpoints } from "@/hooks";

export function useCategoryMenu() {
  const { isSm, isMd, isLg } = useBreakpoints();
  const isMobile = isSm || isMd || isLg;
  /* ------------------------------------------------------------------------ */
  /* CORE STATE                                                                */
  /* ------------------------------------------------------------------------ */

  const [isOpen, setIsOpen] = useState(false); // desktop
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------------ */
  /* ACTIONS                                                                   */
  /* ------------------------------------------------------------------------ */

  const openDesktopMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDesktopMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen((prev) => !prev);
  }, []);

  const closeMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, []);

  const openMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen(true);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* OUTSIDE CLICK (DESKTOP ONLY)                                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (isMobile || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        closeDesktopMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen, closeDesktopMenu]);

  /* ------------------------------------------------------------------------ */
  /* BODY SCROLL LOCK (MOBILE)                                                 */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!isMobile) return;

    document.body.style.overflow = isMobileDrawerOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isMobileDrawerOpen]);

  /* ------------------------------------------------------------------------ */
  /* RESPONSIVE RESET                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    setIsOpen(false);
    setIsMobileDrawerOpen(false);
  }, [isMobile]);

  /* ------------------------------------------------------------------------ */
  /* RETURN                                                                    */
  /* ------------------------------------------------------------------------ */

  return {
    isMobile,

    // desktop
    isOpen,
    setIsOpen,
    openDesktopMenu,
    closeDesktopMenu,

    // mobile
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    openMobileDrawer,
    closeMobileDrawer,
    toggleMobileDrawer,

    // refs
    menuRef,
  };
}