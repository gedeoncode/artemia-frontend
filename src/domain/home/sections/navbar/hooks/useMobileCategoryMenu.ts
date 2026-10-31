"use client";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useCategories } from ".";
import { categoryKeys } from "@/lib/react-query/category-keys";
import { type CategoryNode } from "@/domain/home/services/nodeCategories.services";
import { useRouter } from "next/navigation";
import { getCategoryUrl } from "..";

type Level = {
  title: string;
  parentId: string | null;
  items: CategoryNode[];
};
type Params = {
  rootCategories: CategoryNode[];
  selectedCategoryId?: string | null;
  onCategorySelect?: (category: CategoryNode) => void;
  onOpenChange?: (open: boolean) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNavigate?: (payload: {
    type: "forward" | "back" | "close" | "select";
    category?: CategoryNode;
    levelDepth: number;
  }) => void;
  labels?: {
    rootTitle?: string;
    close?: string;
    back?: string;
    retry?: string;
    empty?: string;
    error?: string;
  };
};
export function useMobileCategoryMenu({
  rootCategories,
  selectedCategoryId,
  onCategorySelect,
  onNavigate,
  onOpenChange,
  isOpen,
  setIsOpen,
  labels,
}: Params) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { prefetch } = useCategories(null, rootCategories);

  const requestIdRef = useRef(0);

  const initialLevel = useMemo<Level>(
    () => ({
      title: labels?.rootTitle,
      parentId: null,
      items: rootCategories,
    }),
    [labels?.rootTitle, rootCategories],
  );

  const [stack, setStack] = useState<Level[]>([initialLevel]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const current = stack[stack.length - 1];

  // Sync root categories
  useEffect(() => {
    setStack((prev) => {
      if (prev.length === 1) {
        return [{ ...prev[0], items: rootCategories }];
      }
      return prev;
    });
  }, [rootCategories]);

  // Notify parent
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setIsNavigating(false);
    setErrorState(null);
    requestIdRef.current += 1;
    setStack([initialLevel]);

    onNavigate?.({
      type: "close",
      levelDepth: 0,
    });
  }, [setIsOpen, initialLevel, onNavigate]);

  const goBack = useCallback(() => {
    setErrorState(null);
    setStack((prev) => {
      const next = prev.slice(0, -1);

      onNavigate?.({
        type: "back",
        levelDepth: Math.max(next.length - 1, 0),
      });

      return next;
    });
  }, [onNavigate]);

  const loadChildren = useCallback(
    async (cat: CategoryNode) => {
      const key = categoryKeys.children(cat._id);
      const cached = queryClient.getQueryData<CategoryNode[]>(key);

      if (cached) {
        setStack((prev) => [
          ...prev,
          { title: cat.name, parentId: cat._id, items: cached },
        ]);
        return;
      }

      const requestId = ++requestIdRef.current;
      setIsNavigating(true);
      setErrorState(null);

      try {
        await prefetch(cat._id);

        if (requestId !== requestIdRef.current) return;

        const children = queryClient.getQueryData<CategoryNode[]>(key) ?? [];

        setStack((prev) => [
          ...prev,
          { title: cat.name, parentId: cat._id, items: children },
        ]);
      } catch {
        if (requestId !== requestIdRef.current) return;

        setErrorState({ parentId: cat._id, category: cat });
      } finally {
        if (requestId === requestIdRef.current) {
          setIsNavigating(false);
        }
      }
    },
    [prefetch, queryClient],
  );

  const goForward = useCallback(
    async (cat: CategoryNode) => {
      if (!cat.hasChildren) {
        const url = getCategoryUrl(cat);

        onCategorySelect?.(cat);

        onNavigate?.({
          type: "select",
          category: cat,
          levelDepth: stack.length - 1,
        });

        closeMenu();
        router.prefetch(url);
        router.push(url);

        return;
      }
      await loadChildren(cat);
    },
    [
      closeMenu,
      loadChildren,
      onCategorySelect,
      stack.length,
      onNavigate,
      router,
    ],
  );

  const retry = useCallback(async () => {
    if (!errorState?.category) return;
    await loadChildren(errorState.category);
  }, [errorState, loadChildren]);

  return {
    stack,
    current,
    isNavigating,
    errorState,
    goBack,
    goForward,
    closeMenu,
    retry,
  };
}
