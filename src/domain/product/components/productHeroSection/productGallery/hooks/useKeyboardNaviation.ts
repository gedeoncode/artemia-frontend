// hooks/useKeyboardNavigation.ts

'use client';

import { useEffect, useCallback, useRef } from 'react';

interface KeyboardNavigationConfig {
  enabled: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  onZoomToggle?: () => void;
  onEscape?: () => void;
  onFullscreen?: () => void;
  onSelect?: (index: number) => void;
  totalImages: number;
  currentIndex: number;
  isZoomed?: boolean;
  isFullscreen?: boolean;
  shortcuts?: Record<string, () => void>;
}

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardNavigation({
  enabled,
  onNext,
  onPrev,
  onZoomToggle,
  onEscape,
  onFullscreen,
  onSelect,
  totalImages,
  currentIndex,
  isZoomed = false,
  isFullscreen = false,
  shortcuts = {},
}: KeyboardNavigationConfig) {
  const shortcutRegistry = useRef<Map<string, KeyboardShortcut>>(new Map());

  // Build default shortcuts
  const getDefaultShortcuts = useCallback((): KeyboardShortcut[] => {
    const defaults: KeyboardShortcut[] = [
      {
        key: 'ArrowRight',
        description: 'Next image',
        action: () => {
          if (onNext && !isZoomed) {
            onNext();
          }
        },
      },
      {
        key: 'ArrowLeft',
        description: 'Previous image',
        action: () => {
          if (onPrev && !isZoomed) {
            onPrev();
          }
        },
      },
      {
        key: 'z',
        ctrlKey: true,
        metaKey: true,
        description: 'Toggle zoom',
        action: () => {
          if (onZoomToggle) {
            onZoomToggle();
          }
        },
      },
      {
        key: 'Escape',
        description: 'Close zoom / Exit fullscreen',
        action: () => {
          if (onEscape) {
            onEscape();
          }
        },
      },
      {
        key: 'f',
        description: 'Toggle fullscreen',
        action: () => {
          if (onFullscreen) {
            onFullscreen();
          }
        },
      },
      // Number shortcuts for quick navigation
      ...Array.from({ length: Math.min(9, totalImages) }, (_, i) => ({
        key: `${i + 1}`,
        description: `Go to image ${i + 1}`,
        action: () => {
          if (onSelect && !isZoomed) {
            onSelect(i);
          }
        },
      })),
    ];

    return defaults;
  }, [onNext, onPrev, onZoomToggle, onEscape, onFullscreen, onSelect, totalImages, isZoomed]);

  // Register shortcuts
  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    const id = `${shortcut.key}-${shortcut.ctrlKey || false}-${shortcut.metaKey || false}-${shortcut.shiftKey || false}-${shortcut.altKey || false}`;
    shortcutRegistry.current.set(id, shortcut);
  }, []);

  // Unregister shortcut
  const unregisterShortcut = useCallback((key: string) => {
    shortcutRegistry.current.delete(key);
  }, []);

  // Register custom shortcuts
  useEffect(() => {
    if (!enabled) return;

    // Register default shortcuts
    const defaults = getDefaultShortcuts();
    defaults.forEach(shortcut => registerShortcut(shortcut));

    // Register custom shortcuts
    Object.entries(shortcuts).forEach(([key, action]) => {
      registerShortcut({
        key,
        description: `Custom shortcut: ${key}`,
        action,
      });
    });

    return () => {
      shortcutRegistry.current.clear();
    };
  }, [enabled, getDefaultShortcuts, registerShortcut, shortcuts]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't interfere with input fields
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      // Check for modifiers
      const key = event.key;
      const ctrlKey = event.ctrlKey;
      const metaKey = event.metaKey;
      const shiftKey = event.shiftKey;
      const altKey = event.altKey;

      // Find matching shortcut
      const shortcutId = `${key}-${ctrlKey || false}-${metaKey || false}-${shiftKey || false}-${altKey || false}`;
      const shortcut = shortcutRegistry.current.get(shortcutId);

      if (shortcut) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
      }
    },
    [enabled]
  );

  // Attach/detach event listener
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  // Helper to get all registered shortcuts
  const getShortcuts = useCallback(() => {
    return Array.from(shortcutRegistry.current.values());
  }, []);

  // Helper to get shortcut descriptions
  const getShortcutDescriptions = useCallback(() => {
    return Array.from(shortcutRegistry.current.values()).map(shortcut => ({
      key: shortcut.key,
      description: shortcut.description,
      modifiers: {
        ctrl: shortcut.ctrlKey || false,
        meta: shortcut.metaKey || false,
        shift: shortcut.shiftKey || false,
        alt: shortcut.altKey || false,
      },
    }));
  }, []);

  return {
    handleKeyDown,
    registerShortcut,
    unregisterShortcut,
    getShortcuts,
    getShortcutDescriptions,
  };
}
