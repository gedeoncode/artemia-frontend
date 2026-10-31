"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";
import Link from "next/link"
import { type CategoryNode } from "@/domain/home/services/nodeCategories.services";
import { cx } from "@/lib/utils/classNames";

import {
  CategoryMenuColumn,
  CategoryMenuRail,
  getCategoryUrl,
  type CategoryMenuConfig,
  type CategoryMenuController,
} from ".";

import { useDeskCategoryMenu } from "../../hooks/useDeskCategoryMenu";


type CategoryMenuProps = {
  rootCategories: CategoryNode[];
  menu: CategoryMenuController;
  config?: CategoryMenuConfig;
};

export const CategoryMenu = memo(function CategoryMenu({
  rootCategories,
  menu,
  config,
}: CategoryMenuProps) {
  const { isOpen, openDesktopMenu, closeDesktopMenu, menuRef } = menu;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [keyboardMode, setKeyboardMode] = useState(false);

const getCategoryHref = useMemo(
  () => config?.getCategoryHref ?? getCategoryUrl,
  [config]
);

const getFeaturedLinks = useMemo(
  () => config?.getFeaturedLinks ?? (() => []),
  [config]
);

const quickCategories = useMemo(
  () => config?.quickCategories ?? rootCategories.slice(0, 5),
  [config, rootCategories]
);

const mega = useDeskCategoryMenu({
  rootCategories,
  config,
});

     const { restorePersistedPath, resetState, } = mega;
  // Restore persisted path
  useEffect(() => {
    if (isOpen) {
      void restorePersistedPath();
    }
  }, [isOpen, restorePersistedPath]);

  useEffect(() => {
  if (!isOpen) {
    resetState();
  }
}, [isOpen, resetState]);

  // Close on outside click 
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        closeDesktopMenu();
        resetState();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeDesktopMenu, resetState]);
  
  useEffect(() => {
  function handleMouseMove() {
    setKeyboardMode(false);
  }

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);
const getParentCategoryForColumn = useCallback(
  (level: number) => {
    if (level === 0) return null;

    const parentId = mega.activePathIds[level - 1];
    if (!parentId) return null;

    const parentColumn = mega.columns[level - 1];
    return parentColumn.find(c => c._id === parentId) ?? null;
  },
  [mega.columns, mega.activePathIds]
);

  const handleClose = useCallback(() => {
    resetState();
    closeDesktopMenu();
  }, [closeDesktopMenu, resetState]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      setKeyboardMode(true);

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          handleClose();
          break;

        case "ArrowDown":
          e.preventDefault();
          break;

        case "Tab":
          if (!containerRef.current?.contains(e.target as Node)) {
            handleClose();
          }
          break;
      }
    },
    [handleClose]
  );

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof menuRef === "function") menuRef(node);
        else if (menuRef) (menuRef as any).current = node;
      }}
      className="relative"
      onKeyDown={handleKeyDown}
    >
        {/* Quick categories */}

<div className="flex flex-wrap items-center gap-2"
onClick={(e) => {
  if ((e.target as HTMLElement).tagName !== "A" && isOpen) {
    handleClose();
  }
}}>
  {quickCategories.map((cat) => (
    <Link
      key={cat._id}
      href={getCategoryHref(cat)}
      className="text-sm text-slate-700 hover:text-slate-900 link-hover hover:bg-slate-200"
    >
      {cat.name}
    </Link>
  ))}

  {/* More pill (replaces button) */}
<button
  type="button"
  aria-haspopup="menu"
  aria-expanded={isOpen}
  className={cx(
    "inline-flex items-center gap-1.5 link-hover text-sm font-medium",
    "transition-colors ease-in-out",
    "text-slate-800 hover:bg-slate-200",
    "focus:outline-none focus:ring-2 focus:ring-slate-300",
    isOpen && "bg-slate-200 shadow-sm"
  )}
  onClick={() => {
    if (isOpen) handleClose();
    else openDesktopMenu();
  }}
>
  <LayoutGrid className="w-4 h-4" />
  <span>More</span>
  <ChevronDown
    className={cx(
      "h-4 w-4 transition-transform duration-200 ease-in-out",
      isOpen && "rotate-180"
    )}
  />
</button>
</div>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Category navigation"
          className={cx(
            "absolute left-0 top-full z-10 mt-3 overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl",
            "min-w-[920px]"
          )}
        >
          <div className="flex">
            {/* Columns */}
            <div className="flex" role="menubar">
              {mega.columns.map((items, level) => (
                <CategoryMenuColumn
                  key={`column-${level}`}
                  items={items}
                  level={level}
                  activePathIds={mega.activePathIds}
                  loadingId={mega.loadingId}
                  errorId={mega.errorId}
                  clearHoverIntent= {mega.clearHoverIntent}
                  parentCategory={getParentCategoryForColumn(level)}
                  getCategoryHref={getCategoryHref}
                  onHover={keyboardMode ? undefined : mega.handleHover}
                onFocus={(cat, level) => mega.handleCategoryClick(cat, level)}
                  onCategoryClick={mega.handleCategoryClick}
                />
              ))}
            </div>

            {/* Context Rail */}
            <CategoryMenuRail
              activeLeaf={mega.activeLeaf}
              getCategoryHref={getCategoryHref}
              featuredLinks={getFeaturedLinks(mega.activeLeaf)}
              onCategoryClick={mega.handleCategoryClick}
              activeLevel={Math.max(mega.activePathIds.length - 1, 0)}
            />
          </div>
        </div>
      )}
    </div>
  );
});