"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { type CategoryNode } from "@/domain/home/services/nodeCategories.services";
import { categoryKeys } from "@/lib/react-query/category-keys";
import { useCategories } from ".";
import { CategoryMenuConfig } from "../desktop/categoryMenu/deskCategoryMenu.types";

type Params = {
  rootCategories: CategoryNode[];
  config?: CategoryMenuConfig;
};

const DEFAULT_STORAGE_KEY = "category-mega-menu:last-path";
const DEFAULT_HOVER_DELAY = 120;

export function useDeskCategoryMenu({ rootCategories, config }: Params) {
  const queryClient = useQueryClient();
  const { prefetch } = useCategories(null, rootCategories);
  const lastPrefetchedRef = useRef<string | null>(null);

  // -----------------------------
  // Config
  // -----------------------------
  const stableConfig = useMemo(() => config ?? {}, [config]);

  const hoverIntentDelay = stableConfig.hoverIntentDelay ?? DEFAULT_HOVER_DELAY;

  const storageKey = stableConfig.storageKey ?? DEFAULT_STORAGE_KEY;
  const persistLastPath = stableConfig.persistLastPath ?? true;

  // -----------------------------
  // STATE MACHINE
  // -----------------------------
  const [previewPath, setPreviewPath] = useState<string[]>([]);
  const [committedPath, setCommittedPath] = useState<string[]>([]);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  // 🔑 SINGLE SOURCE OF TRUTH
  const activePath = committedPath;

  const activePathRef = useRef(activePath);
  useEffect(() => {
    activePathRef.current = activePath;
  }, [activePath]);

  // -----------------------------
  // POINTER INTENT
  // -----------------------------
  const hoverTimeoutRef = useRef<number | null>(null);
  const pointerHistoryRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const pts = pointerHistoryRef.current;
      pts.push({ x: e.clientX, y: e.clientY });
      if (pts.length > 5) pts.shift();
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const clearHoverIntent = useCallback(() => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  // -----------------------------
  // HELPERS
  // -----------------------------
  const getChildren = useCallback(
    (id: string) =>
      queryClient.getQueryData<CategoryNode[]>(categoryKeys.children(id)) ?? [],
    [queryClient],
  );

  const persistPath = useCallback(
    (path: string[]) => {
      if (!persistLastPath || typeof window === "undefined") return;
      window.localStorage.setItem(storageKey, JSON.stringify(path));
    },
    [persistLastPath, storageKey],
  );

  // -----------------------------
  // STATE MACHINE ACTIONS
  // -----------------------------

  // 👁 PREVIEW (hover)
  const preview = useCallback(
    (cat: CategoryNode, level: number) => {
      // -----------------------------
      // 1. Update preview state (UI only)
      // -----------------------------
      setPreviewPath((prev) => {
        const next = prev.slice(0, level);
        next[level] = cat._id;
        return next;
      });

      // -----------------------------
      // 2. Background prefetch (silent)
      // -----------------------------
      if (!cat.hasChildren) return;
      // Prevent to prefetch
      if (lastPrefetchedRef.current === cat._id) return;

      const key = categoryKeys.children(cat._id);

      const cached = queryClient.getQueryData(key);
      if (cached) return;
      lastPrefetchedRef.current = cat._id;
      // 🔥 Silent prefetch (no loading state!)
      prefetch(cat._id).catch(() => {
        // swallow errors (important)
      });
    },
    [prefetch, queryClient],
  );

  // ✅ COMMIT (click)
  const commit = useCallback(
    async (cat: CategoryNode, level: number) => {
      setErrorId(null);

      const current = activePathRef.current;
      const next = current.slice(0, level);
      next[level] = cat._id;

      setCommittedPath(next);
      setPreviewPath([]); // clear preview
      persistPath(next);

      if (!cat.hasChildren) return;

      const key = categoryKeys.children(cat._id);
      const cached = queryClient.getQueryData(key);

      if (cached) return;

      setLoadingId(cat._id);

      try {
        await prefetch(cat._id);
      } catch {
        setErrorId(cat._id);
      } finally {
        setLoadingId((c) => (c === cat._id ? null : c));
      }
    },
    [persistPath, prefetch, queryClient],
  );

  // ♻ RESET
  const reset = useCallback(() => {
    clearHoverIntent();
    setPreviewPath([]);
    setLoadingId(null);
    setErrorId(null);
  }, [clearHoverIntent]);

  // ♻ RESTORE
  const restore = useCallback(() => {
    if (!persistLastPath || typeof window === "undefined") return;

    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const path = JSON.parse(raw);
      if (Array.isArray(path)) {
        setCommittedPath(path);
      }
    } catch {}
  }, [persistLastPath, storageKey]);

  // -----------------------------
  // INTENT HANDLERS
  // -----------------------------
  const handleHover = useCallback(
    (cat: CategoryNode, level: number) => {
      clearHoverIntent();

      hoverTimeoutRef.current = window.setTimeout(() => {
        preview(cat, level); // 👈 ONLY preview
      }, hoverIntentDelay);
    },
    [clearHoverIntent, hoverIntentDelay, preview],
  );

  const handleClick = useCallback(
    (cat: CategoryNode, level: number) => {
      clearHoverIntent();
      void commit(cat, level);
    },
    [clearHoverIntent, commit],
  );

  // -----------------------------
  // DERIVED DATA
  // -----------------------------
  const columns = useMemo(() => {
    const cols: CategoryNode[][] = [rootCategories];

    activePath.forEach((id) => {
      const children = getChildren(id);
      if (children.length) cols.push(children);
    });

    return cols;
  }, [activePath, getChildren, rootCategories]);

  const activeLeaf = useMemo(() => {
    let current: CategoryNode | null = null;
    let items = rootCategories;

    for (const id of activePath) {
      const found = items.find((i) => i._id === id);
      if (!found) return null;
      current = found;
      items = getChildren(id);
    }

    return current;
  }, [activePath, getChildren, rootCategories]);

  // -----------------------------
  // PUBLIC API
  // -----------------------------
  return useMemo(
    () => ({
      activePathIds: activePath,
      previewPathIds: previewPath, // 👈 NEW
      activeLeaf,
      columns,
      loadingId,
      errorId,

      handleHover,
      handleCategoryClick: handleClick,

      clearHoverIntent,
      resetState: reset,
      restorePersistedPath: restore,
      getChildren,
    }),
    [
      activePath,
      previewPath,
      activeLeaf,
      columns,
      loadingId,
      errorId,
      handleHover,
      handleClick,
      clearHoverIntent,
      reset,
      restore,
      getChildren,
    ],
  );
}
