// ========== Search Modal Component ==========
import {useState, useEffect,KeyboardEvent, useRef, useCallback} from "react"
import { cn } from "@/lib/utils/classNames";

/**
 * Scrolls to element by ID
 */
const SCROLL_BEHAVIOR: ScrollBehavior = "smooth";
const SCROLL_BLOCK: ScrollLogicalPosition = "start";

function scrollToElement(id: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: SCROLL_BEHAVIOR, block: SCROLL_BLOCK });
  }
}
interface HeadingItem {
  id: string;
  title: string;
  level: number;
}
interface SearchModalProps {
  onClose: () => void;
  headings: HeadingItem[];
}

export function SearchModal({ onClose, headings }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<HeadingItem[]>(headings);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter headings by query
  useEffect(() => {
    if (!query.trim()) {
      setFiltered(headings);
      setActiveIndex(0);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results = headings.filter((h) =>
      h.title.toLowerCase().includes(normalizedQuery)
    );
    setFiltered(results);
    setActiveIndex(0);
  }, [query, headings]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;

    const activeElement = listRef.current.children[activeIndex] as HTMLElement;
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  // Handle navigation to selected item
  const navigateToItem = useCallback(
    (index: number) => {
      const target = filtered[index];
      if (target) {
        scrollToElement(target.id);
        onClose();
      }
    },
    [filtered, onClose]
  );

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filtered.length > 0) {
            navigateToItem(activeIndex);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [activeIndex, filtered.length, navigateToItem, onClose]
  );

  // Close on overlay click
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Trap focus within modal
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey as any);
    return () => document.removeEventListener("keydown", handleTabKey as any);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-xl p-4 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800"
      >
        <div className="flex items-center justify-between mb-3">
          <h2
            id="search-modal-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            Search Documentation
          </h2>
          <button
            onClick={onClose}
            aria-label="Close search"
            className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type to search headings..."
          className="w-full px-3 py-2 mb-3 text-gray-900 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          aria-label="Search input"
          aria-controls="search-results"
          aria-activedescendant={
            filtered.length > 0 ? `search-result-${activeIndex}` : undefined
          }
        />

        <ul
          ref={listRef}
          id="search-results"
          role="listbox"
          className="overflow-auto text-sm max-h-64"
        >
          {filtered.length === 0 && (
            <li className="p-3 text-center text-gray-500 dark:text-gray-400">
              No results found
            </li>
          )}
          {filtered.map((heading, i) => (
            <li
              key={heading.id}
              id={`search-result-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={cn(
                "cursor-pointer px-3 py-2 rounded-md transition-colors",
                i === activeIndex
                  ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                  : "text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              )}
              style={{
                paddingLeft: `${(heading.level - 1) * 0.75 + 0.75}rem`,
              }}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => navigateToItem(i)}
            >
              {heading.title}
            </li>
          ))}
        </ul>

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          <kbd className="px-2 py-1 mr-1 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600">
            ↑↓
          </kbd>
          to navigate
          <kbd className="px-2 py-1 mx-1 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600">
            Enter
          </kbd>
          to select
          <kbd className="px-2 py-1 mx-1 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600">
            Esc
          </kbd>
          to close
        </div>
      </div>
    </div>
  );
}