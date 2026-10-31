"use client";

import { useState, useEffect,  useCallback } from "react";
import { usePathname } from "next/navigation";
import { DocsToc } from "@/components/docs/DocsToc";
import { generatedHeadings } from "@/lib/docs/generated-headings";
import { DocsTopbar } from "@/components/docs/DocsTopbar";
import { cn } from "@/lib/utils/classNames";
import { SearchModal } from "../_components/SearchModal";

// ========== Constants ==========
const SEARCH_SHORTCUT_KEY = "k";


// ========== Types ==========
interface DocsDynamicLayoutProps {
  children: React.ReactNode;
}

interface Breadcrumb {
  label: string;
  href: string;
}

// ========== Helper Functions ==========
/**
 * Capitalizes each word in a string
 */
function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Converts a URL segment to a readable label
 */
function segmentToLabel(segment: string): string {
  return capitalizeWords(segment.replace(/-/g, " "));
}

/**
 * Generates breadcrumbs from pathname
 */
function generateBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname
    .replace(/^\/docs\/?/, "")
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Documentation", href: "/docs" }];
  }

  return [
    { label: "Documentation", href: "/docs" },
    ...segments.map((segment, i) => ({
      label: segmentToLabel(segment),
      href: "/docs/" + segments.slice(0, i + 1).join("/"),
    })),
  ];
}





// ========== Main Layout Component ==========
export default function DocsDynamicLayout({
  children,
}: DocsDynamicLayoutProps) {
  const pathname = usePathname() || "/docs";
  const route = pathname.replace(/^\/docs/, "") || "/";

  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs(pathname);

  // Get TOC headings for current route
  const headings = generatedHeadings[route] ?? [];

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut ⌘K / Ctrl+K to open search
  useEffect(() => {
    const handleShortcut = (e: globalThis.KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === SEARCH_SHORTCUT_KEY
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  const handleSearchClick = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Topbar */}
      <DocsTopbar
        breadcrumbs={breadcrumbs}
        showScrollProgress
        onSearchClick={handleSearchClick}
      />

      {/* Search modal */}
      {isSearchOpen && (
        <SearchModal onClose={handleSearchClose} headings={headings} />
      )}

      {/* Main container */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 flex-1 w-full py-10">
        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
          {/* Desktop TOC */}
          {headings.length > 0 && (
            <aside
              aria-label="Table of contents"
              className="sticky self-start hidden top-20 lg:block border-r pr-6 max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              <DocsToc items={headings} />
            </aside>
          )}

          {/* Main content */}
          <main
            id="content"
            className={cn(
              "pb-28 min-w-0",
              "prose prose-neutral dark:prose-invert",
              "max-w-none",
              "prose-headings:scroll-mt-24",
              "prose-h1:text-4xl prose-h1:font-extrabold prose-h1:mt-0 prose-h1:mb-8 sm:prose-h1:text-5xl",
              "prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 sm:prose-h2:text-3xl",
              "prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 sm:prose-h3:text-2xl",
              "prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300",
              "prose-pre:rounded-lg prose-pre:border prose-pre:bg-gray-50 dark:prose-pre:bg-gray-900",
              "prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5",
              "prose-code:text-sm prose-code:font-mono",
              "prose-code:before:content-none prose-code:after:content-none",
              "prose-a:text-blue-600 dark:prose-a:text-blue-400",
              "prose-a:no-underline hover:prose-a:underline",
              "prose-img:rounded-lg prose-img:border"
            )}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Mobile TOC - Bottom Sheet */}
      {headings.length > 0 && (
        <div className="fixed z-40 lg:hidden bottom-4 right-4">
          <button
            onClick={handleSearchClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Open table of contents"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Contents
          </button>
        </div>
      )}
    </div>
  );
}
