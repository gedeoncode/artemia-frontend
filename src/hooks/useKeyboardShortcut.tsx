// hooks/useKeyboardShortcuts.ts
import { useEffect, useRef } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description?: string;
  preventDefault?: boolean;
}

export interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  capture?: boolean;
  eventType?: "keydown" | "keyup" | "keypress";
}

export const useKeyboardShortcuts = (
  shortcuts: Record<string, () => void> | KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enabled = true, capture = false, eventType = "keydown" } = options;

  const shortcutsRef = useRef(shortcuts);
  const enabledRef = useRef(enabled);

  // Update refs when dependencies change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
    enabledRef.current = enabled;
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyEvent = (event: KeyboardEvent) => {
      if (!enabledRef.current) return;

      // Ignore if focused on input, textarea, or contenteditable
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      let matched = false;

      if (Array.isArray(shortcutsRef.current)) {
        // Handle KeyboardShortcut array
        for (const shortcut of shortcutsRef.current) {
          if (
            event.key === shortcut.key &&
            !!event.ctrlKey === !!shortcut.ctrlKey &&
            !!event.altKey === !!shortcut.altKey &&
            !!event.shiftKey === !!shortcut.shiftKey &&
            !!event.metaKey === !!shortcut.metaKey
          ) {
            if (shortcut.preventDefault !== false) {
              event.preventDefault();
            }
            shortcut.action();
            matched = true;
            break;
          }
        }
      } else {
        // Handle legacy Record<string, () => void> format
        const key = event.key;
        const combo = [
          event.ctrlKey && "Ctrl",
          event.altKey && "Alt",
          event.shiftKey && "Shift",
          event.metaKey && "Meta",
          key,
        ]
          .filter(Boolean)
          .join("+");

        // Exact match
        if (shortcutsRef.current[combo]) {
          event.preventDefault();
          shortcutsRef.current[combo]();
          matched = true;
        } else {
          // Try without modifier keys for simple keys
          if (
            shortcutsRef.current[key] &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey
          ) {
            event.preventDefault();
            shortcutsRef.current[key]();
            matched = true;
          }
        }
      }

      // Log unmatched shortcuts in development
      if (process.env.NODE_ENV === "development" && !matched && event.ctrlKey) {
        const combo = [
          event.ctrlKey && "Ctrl",
          event.altKey && "Alt",
          event.shiftKey && "Shift",
          event.metaKey && "Meta",
          event.key,
        ]
          .filter(Boolean)
          .join("+");
        console.debug(`Unmatched keyboard shortcut: ${combo}`);
      }
    };

    document.addEventListener(eventType, handleKeyEvent, capture);

    return () => {
      document.removeEventListener(eventType, handleKeyEvent, capture);
    };
  }, [capture, eventType, enabled]);
};

// Helper function to create keyboard shortcut configurations
export const createShortcut = (
  key: string,
  action: () => void,
  options: Omit<KeyboardShortcut, "key" | "action"> = {}
): KeyboardShortcut => ({
  key,
  action,
  ...options,
});

// Common keyboard shortcut configurations
export const CommonShortcuts = {
  // Navigation
  goHome: createShortcut("h", () => (window.location.href = "/"), {
    ctrlKey: true,
    description: "Go to homepage",
  }),
  goBack: createShortcut("ArrowLeft", () => window.history.back(), {
    altKey: true,
    description: "Go back",
  }),
  goForward: createShortcut("ArrowRight", () => window.history.forward(), {
    altKey: true,
    description: "Go forward",
  }),

  // Application
  refresh: createShortcut("r", () => window.location.reload(), {
    ctrlKey: true,
    description: "Refresh page",
  }),
  search: createShortcut(
    "k",
    () => {
      const searchInput = document.querySelector(
        'input[type="search"]'
      ) as HTMLInputElement;
      searchInput?.focus();
    },
    { ctrlKey: true, description: "Focus search" }
  ),

  // Dashboard specific
  toggleSidebar: createShortcut(
    "m",
    () => {
      const event = new CustomEvent("toggle-sidebar");
      document.dispatchEvent(event);
    },
    { ctrlKey: true, description: "Toggle sidebar" }
  ),

  openNotifications: createShortcut(
    "n",
    () => {
      const event = new CustomEvent("open-notifications");
      document.dispatchEvent(event);
    },
    { ctrlKey: true, description: "Open notifications" }
  ),
};

// Hook for single shortcut
export const useKeyboardShortcut = (
  shortcut: KeyboardShortcut,
  options?: UseKeyboardShortcutsOptions
) => {
  useKeyboardShortcuts([shortcut], options);
};
