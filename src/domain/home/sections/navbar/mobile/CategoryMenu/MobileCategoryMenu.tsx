
  "use client"
  import { memo, useRef, useEffect } from "react";
import { cx } from "@/lib/utils/classNames";

import { useMobileCategoryMenu, MenuHeader, MenuContent } from ".";

import { CategoryNode } from "@/domain/home/services/nodeCategories.services";
import { useFocusTrap } from "@/hooks";
  
  type MobileCategoryMenuProps = {
    rootCategories: CategoryNode[];
    selectedCategoryId?: string | null;
    onCategorySelect?: (category: CategoryNode) => void;
    onOpenChange?: (open: boolean) => void;
    onNavigate?: (payload: {
      type: "forward" | "back" | "close" | "select";
      category?: CategoryNode;
      levelDepth: number;
    }) => void;
    menu: {
      isMobileDrawerOpen: boolean;
      setIsMobileDrawerOpen: (value: boolean) => void;
    };
    labels?: {
      rootTitle?: string;
      close?: string;
      back?: string;
      retry?: string;
      empty?: string;
      error?: string;
    };
  };
  
  const DEFAULT_LABELS = {
    rootTitle: "All Categories",
    close: "Close menu",
    back: "Go back",
    retry: "Retry",
    empty: "No categories available.",
    error: "Could not load categories.",
  };

export const MobileCategoryMenu = memo(function MobileCategoryMenu({
  rootCategories,
  selectedCategoryId,
  onCategorySelect,
  onOpenChange,
  onNavigate,
  menu,
  labels: labelsProp,
}: MobileCategoryMenuProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const { isMobileDrawerOpen, setIsMobileDrawerOpen } = menu;
  const closeButtonRef = useRef(null);

  const {
    current,
    stack,
    isNavigating,
    errorState,
    goBack,
    goForward,
    closeMenu,
    retry,
  } = useMobileCategoryMenu({
    rootCategories,
    selectedCategoryId,
    onCategorySelect,
    onNavigate,
    onOpenChange,
    isOpen: isMobileDrawerOpen,
    setIsOpen: setIsMobileDrawerOpen,
    labels,
  });
const previousActiveRef = useRef<HTMLElement | null>(null);
const drawerRef = useRef<HTMLDivElement>(null);

useFocusTrap(drawerRef, isMobileDrawerOpen);
  // Focus + scroll lock (keep here or move later)
useEffect(() => {
  if (!isMobileDrawerOpen) return;

  previousActiveRef.current = document.activeElement as HTMLElement;
}, [isMobileDrawerOpen]);

useEffect(() => {
  if (!isMobileDrawerOpen) {
    previousActiveRef.current?.focus?.();
  }
}, [isMobileDrawerOpen]);

  return (
<div
  className={cx(
    "fixed inset-0 z-[100] lg:hidden transition-opacity duration-300",
    isMobileDrawerOpen
      ? "opacity-100 pointer-events-auto"
      : "opacity-0 pointer-events-none"
  )}
>
      {/* Backdrop */}
   <button
  className={cx(
    "absolute inset-0 bg-black/70 transition-opacity duration-300",
    isMobileDrawerOpen ? "opacity-100" : "opacity-0"
  )}
  onClick={closeMenu}
/>

      {/* Drawer */}
<aside
  ref={drawerRef}
  role="dialog"
  aria-modal="true"
  aria-labelledby="mobile-menu-title"
  className={cx(
    "absolute inset-y-0 left-0 flex flex-col w-full max-w-sm bg-white",
    "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    isMobileDrawerOpen ? "translate-x-0 scale-100" : "-translate-x-full scale-95"
  )}
>
        <MenuHeader
          title={current.title}
          canGoBack={stack.length > 1}
          onBack={goBack}
          onClose={closeMenu}
          closeRef={closeButtonRef}
          labels={labels}
        />
        <MenuContent
          items={current.items}
          isNavigating={isNavigating}
          errorState={errorState}
          selectedCategoryId={selectedCategoryId}
          onItemClick={goForward}
          onRetry={retry}
          labels={labels}
        />
      </aside>
    </div>
  );
});
  