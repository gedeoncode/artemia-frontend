"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronRight, Search, Moon, Sun, Github, Menu } from "lucide-react";
import { Logo } from "../brand/Logo";
import {cn} from "@/lib/utils/classNames";
import { useTheme } from "next-themes";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface DocsTopbarProps {
  breadcrumbs?: Breadcrumb[];
  onSearchClick?: () => void;
  githubUrl?: string;
}

const throttle = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

export function DocsTopbar({
  breadcrumbs = [],
  onSearchClick,
  githubUrl = "https://github.com",
}: DocsTopbarProps) {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileBreadcrumbs, setShowMobileBreadcrumbs] = useState(false);
  const mobileBreadcrumbsRef = useRef<HTMLDivElement>(null);

  // Prevent flash: only render after theme is mounted
  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  // Scroll handler
  const handleScroll = useCallback(
    throttle(() => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setScrollProgress(scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0);
      setIsScrolled(scrolled > 10);
    }, 16),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleTheme = () => setTheme(currentTheme === "light" ? "dark" : "light");

  const handleSearchClick = () => {
    if (onSearchClick) onSearchClick();
    else {
      const term = prompt("Enter search term:");
      if (term) console.log("Search for:", term);
    }
  };

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        handleSearchClick();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSearchClick]);

  // Close mobile breadcrumbs on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileBreadcrumbsRef.current &&
        !mobileBreadcrumbsRef.current.contains(event.target as Node)
      ) {
        setShowMobileBreadcrumbs(false);
      }
    };

    if (showMobileBreadcrumbs) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileBreadcrumbs]);

  const buttonClass =
    "p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[44px] flex items-center justify-center";

  if (!mounted) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        currentTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900",
        isScrolled && "shadow-md"
      )}
      role="banner"
    >
      {/* Scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-1 transition-all duration-150 ease-out bg-blue-500"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />

      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo + breadcrumbs */}
        <div className="flex items-center flex-1 min-w-0 gap-4">
          <Logo size="sm" withText={false} />

          {/* Desktop breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="items-center hidden min-w-0 gap-2 md:flex">
              <ol className="flex items-center min-w-0 gap-2">
                {breadcrumbs.map((crumb, i) => (
                  <li key={i} className="flex items-center min-w-0 gap-2">
                    {i > 0 && <ChevronRight size={16} className="flex-shrink-0 text-gray-400" aria-hidden />}
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className={cn(
                          "text-sm hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 truncate",
                          i === breadcrumbs.length - 1 && "font-medium"
                        )}
                        aria-current={i === breadcrumbs.length - 1 ? "page" : undefined}
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span
                        className={cn("text-sm truncate", i === breadcrumbs.length - 1 && "font-medium")}
                        aria-current={i === breadcrumbs.length - 1 ? "page" : undefined}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Mobile breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="relative md:hidden" ref={mobileBreadcrumbsRef}>
              <button
                onClick={() => setShowMobileBreadcrumbs(!showMobileBreadcrumbs)}
                className="flex items-center gap-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 min-h-[44px]"
                aria-expanded={showMobileBreadcrumbs}
                aria-label="Show breadcrumb navigation"
              >
                <Menu size={16} />
                <span className="truncate max-w-[120px]">{breadcrumbs[breadcrumbs.length - 1]?.label}</span>
              </button>

              {showMobileBreadcrumbs && (
                <div
                  className={cn(
                    "absolute top-full left-0 mt-2 py-2 rounded-lg shadow-lg min-w-[200px]",
                    currentTheme === "dark" ? "bg-gray-800" : "bg-white"
                  )}
                >
                  {breadcrumbs.map((crumb, i) => (
                    <a
                      key={i}
                      href={crumb.href || "#"}
                      className={cn(
                        "block px-4 py-2 text-sm hover:bg-blue-500 hover:text-white transition-colors",
                        i === breadcrumbs.length - 1 && "font-medium"
                      )}
                      onClick={() => setShowMobileBreadcrumbs(false)}
                    >
                      {crumb.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions: search, theme, GitHub */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSearchClick}
            className={cn(buttonClass, currentTheme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200")}
            aria-label="Search documentation (Ctrl+K)"
            title="Search (Ctrl+K)"
          >
            <Search size={18} />
            <span className="hidden text-sm sm:inline">Search</span>
            <kbd
              className={cn(
                "hidden lg:inline-block px-2 py-0.5 text-xs rounded",
                currentTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
              )}
            >
              ⌘K
            </kbd>
          </button>

          <button
            onClick={toggleTheme}
            className={cn(buttonClass, currentTheme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200")}
            aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${currentTheme === "light" ? "dark" : "light"} mode`}
          >
            {currentTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonClass, currentTheme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200")}
            aria-label="View on GitHub"
            title="View on GitHub"
          >
            <Github size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}
