"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type TocItem = {
  id: string;
  title: string;
  level: number;
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function DocsToc({
  items,
  onNavigate,
  className,
  title = "On this page",
  showProgress = false,
}: {
  items: TocItem[];
  onNavigate?: () => void;
  className?: string;
  title?: string;
  showProgress?: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const tocRef = useRef<HTMLDivElement>(null);

  // Calculate scroll progress
  useEffect(() => {
    if (!showProgress) return;

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min((scrolled / documentHeight) * 100, 100);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, [showProgress]);

  // Smooth scroll with offset for fixed headers
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();

      const element = document.getElementById(id);
      if (!element) return;

      const offset = 100; // Adjust based on your header height
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL without triggering scroll
      window.history.pushState(null, "", `#${id}`);

      onNavigate?.();
    },
    [onNavigate]
  );

  // Set up intersection observer
  useEffect(() => {
    if (!items.length) return;

    observerRef.current?.disconnect();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Filter visible entries
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        const newActiveId = visible[0].target.id;
        setActiveId(newActiveId);

        // Auto-scroll TOC to keep active item visible
        if (tocRef.current) {
          const activeLink = tocRef.current.querySelector(
            `a[href="#${newActiveId}"]`
          );
          if (activeLink) {
            activeLink.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        }
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: "-96px 0px -60% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  // Set initial active state from URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && items.some((item) => item.id === hash)) {
      setActiveId(hash);
    }
  }, [items]);

  if (!items.length) return null;

  return (
    <nav
      ref={tocRef}
      aria-label="Table of contents"
      className={cn("text-sm leading-6", className)}
    >
      {showProgress && (
        <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(scrollProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}

      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <ul className="space-y-1.5">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const indent = Math.max(0, item.level - 2) * 16;

          return (
            <li
              key={item.id}
              className="relative"
              style={{ paddingLeft: `${indent}px` }}
            >
              {/* Active indicator bar with animation */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-1 h-4 w-0.5 rounded-full bg-blue-600 transition-all duration-200",
                  isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                )}
                style={{ left: `${indent}px` }}
              />

              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  "block truncate py-1 pl-3 transition-all duration-200",
                  "hover:text-gray-900 hover:translate-x-1",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded",
                  isActive
                    ? "font-semibold text-gray-900"
                    : "text-gray-600 font-normal"
                )}
                aria-current={isActive ? "location" : undefined}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>

      {/* Back to top button */}
      {scrollProgress > 20 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Scroll to top"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          Back to top
        </button>
      )}
    </nav>
  );
}
