"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface Options {
  max?: number; // max size of history
}

export function useRecentlyViewedProducts(options: Options = {}) {
  const { max = 10 } = options;

  const [ids, setIds] = useLocalStorage<string[]>("recentlyViewed", []);

  const add = useCallback(
    (productId: string) => {
      if (!productId) return;

      setIds((prev) => {
        const existing = prev || [];

        // remove if exists
        const filtered = existing.filter((id) => id !== productId);

        // add to top
        const updated = [productId, ...filtered];

        // limit size
        return updated.slice(0, max);
      });
    },
    [max, setIds]
  );

  const remove = useCallback(
    (productId: string) => {
      setIds((prev) => {
        const existing = prev || [];
        return existing.filter((id) => id !== productId);
      });
    },
    [setIds]
  );

  const clear = useCallback(() => {
    setIds([]);
  }, [setIds]);

  return {
    ids: ids || [],
    add,
    remove,
    clear,
  };
}
