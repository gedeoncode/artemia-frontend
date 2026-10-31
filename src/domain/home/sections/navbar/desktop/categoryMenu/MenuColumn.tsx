"use client";

import Link from "next/link";
import {
  AlertCircle,
  ChevronRight,
  Loader2,
  ArrowRight,
} from "lucide-react";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { type CategoryNode } from "@/domain/home/services/nodeCategories.services";
import { cx } from "@/lib/utils/classNames";

type CategoryMenuColumnProps = {
  items: CategoryNode[];
  level: number;
  activePathIds: string[];
  previewPathIds?: string[]; 
  loadingId: string | null;
  errorId: string | null;
  clearHoverIntent: () => void;
  parentCategory?: CategoryNode | null;
  getCategoryHref: (category: CategoryNode) => string;
  onHover?: (cat: CategoryNode, level: number) => void;
  onFocus: (cat: CategoryNode, level: number) => void;
  onCategoryClick: (cat: CategoryNode, level: number) => void;
};

export const CategoryMenuColumn = memo(function CategoryMenuColumn({
  items,
  level,
  activePathIds,
  previewPathIds,
  loadingId,
  errorId,
  clearHoverIntent,
  parentCategory,
  getCategoryHref,
  onHover,
  onFocus,
  onCategoryClick,
}: CategoryMenuColumnProps) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const isKeyboardNavRef = useRef(false);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // -----------------------------
  // DERIVED STATE
  // -----------------------------
  const activeIndex = useMemo(
    () => items.findIndex(cat => cat._id === activePathIds[level]),
    [items, activePathIds, level]
  );

  const previewIndex = useMemo(
    () => items.findIndex(cat => cat._id === previewPathIds?.[level]),
    [items, previewPathIds, level]
  );

  // -----------------------------
  // FOCUS MANAGEMENT (keyboard only)
  // -----------------------------
  useEffect(() => {
    if (activeIndex >= 0) {
      const id = items[activeIndex]._id;
      itemRefs.current[id]?.focus();
    }
  }, [activeIndex, items]);

  // -----------------------------
  // KEYBOARD NAVIGATION
  // -----------------------------
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      isKeyboardNavRef.current = true;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const next = (index + 1) % items.length;
          itemRefs.current[items[next]._id]?.focus();
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          const prev = (index - 1 + items.length) % items.length;
          itemRefs.current[items[prev]._id]?.focus();
          break;
        }

        case "ArrowRight": {
          const cat = items[index];
          if (cat?.hasChildren) {
            onFocus(cat, level); // commit via keyboard
          }
          break;
        }

        case "Enter":
        case " ": {
          e.preventDefault();
          onCategoryClick(items[index], level);
          break;
        }
      }
    },
    [items, level, onCategoryClick, onFocus]
  );

  // -----------------------------
  // EMPTY STATE
  // -----------------------------
  if (!items.length) {
    return (
      <div className="w-[300px] border-r border-slate-200/70 bg-white p-4">
        <div className="flex flex-col items-center justify-center px-4 py-8 text-center border border-dashed rounded-sm border-slate-200 bg-slate-50">
          <span className="text-sm font-medium text-slate-600">
            No categories
          </span>
          <span className="mt-1 text-xs text-slate-400">
            Nothing available in this section
          </span>
        </div>
      </div>
    );
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="w-[300px] border-r border-slate-200/70 bg-white">
      <ul
        ref={listRef}
        role="menu"
        aria-label={`Category level ${level + 1}`}
        className="max-h-[72vh] overflow-y-auto p-2 space-y-1"
        onMouseLeave={clearHoverIntent}
      >
        {items.map((cat, index) => {
          const isActive = activePathIds[level] === cat._id;
          const isPreview = previewPathIds?.[level] === cat._id;

          const isLoading = loadingId === cat._id;
          const isError = errorId === cat._id;

          return (
            <li key={cat._id} role="none">
              <button
                type="button"
                role="menuitem"
                ref={(el) => {
                  itemRefs.current[cat._id] = el;
                }}
                tabIndex={isActive || activeIndex === -1 ? 0 : -1}
                aria-haspopup={cat.hasChildren || undefined}
                aria-expanded={cat.hasChildren ? isActive : undefined}
                aria-current={isActive ? "true" : undefined}

                // -----------------------------
                // MOUSE (preview only)
                // -----------------------------
                onMouseEnter={() => {
                  if (!isLoading && !isError && !isKeyboardNavRef.current) {
                    onHover?.(cat, level);
                  }
                }}

                onMouseLeave={clearHoverIntent}

                // -----------------------------
                // FOCUS (keyboard commit)
                // -----------------------------
                onFocus={() => {
                  if (isKeyboardNavRef.current) {
                    onFocus(cat, level);
                    isKeyboardNavRef.current = false;
                  }
                }}

                onKeyDown={(e) => handleKeyDown(e, index)}

                onClick={() => onCategoryClick(cat, level)}

                className={cx(
                  "group relative flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-sm transition-all duration-150 outline-none",

                  // Base
                  "text-slate-700",

                  // Hover / focus
                  "hover:bg-slate-50 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/60",

                  // ✅ ACTIVE (committed)
                  isActive &&
                    "bg-slate-100 text-slate-950 shadow-sm ring-1 ring-slate-200",

                  // 👁 PREVIEW (hover intent)
                  isPreview &&
                    !isActive &&
                    "bg-slate-50 text-slate-900",

                  "active:scale-[0.99]"
                )}
              >
                {/* Label */}
                <span className="font-medium truncate">
                  {cat.name}
                </span>

                {/* Right icon */}
                <span className="flex items-center justify-center w-5 h-5 ml-3 shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  ) : isError ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : cat.hasChildren ? (
                    <ChevronRight
                      className={cx(
                        "h-4 w-4 transition-all duration-150",
                        isActive
                          ? "translate-x-0.5 text-slate-700"
                          : "text-slate-300 group-hover:text-slate-500"
                      )}
                    />
                  ) : null}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-slate-900" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Footer CTA */}
      {parentCategory && (
        <div className="p-2 border-t border-slate-200/70 bg-slate-50/50">
          <Link
            href={getCategoryHref(parentCategory)}
            onClick={() => onCategoryClick(parentCategory, level - 1)}
            className="group flex items-center justify-between rounded-sm px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-white hover:shadow-sm hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <span className="truncate">
              View all {parentCategory.name}
            </span>

            <ArrowRight className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-slate-600" />
          </Link>
        </div>
      )}
    </div>
  );
});