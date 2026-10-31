// hooks/useNavigation.ts
"use client"
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export type UseNavigationOptions = {
  onLogout?: () => Promise<void> | void; // optional: call backend logout API
  sidebarClose?: () => void; // optional: close mobile sidebar
  postLogoutRedirect?: string; // defaults to /login
};

export const useNavigation = (options?: UseNavigationOptions) => {
  const router = useRouter();
  const qc = useQueryClient();

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path);
      if (options?.sidebarClose) {
        options.sidebarClose();
      }
    },
    [router, options]
  );

  const handleLogout = useCallback(async () => {
    try {
      // Clear React Query cache
      qc.clear();

      // Clear local/session storage tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        sessionStorage.clear();
      }

      // Optional backend logout
      if (options?.onLogout) {
        await options.onLogout();
      }
    } finally {
      // Redirect after logout
      router.push(options?.postLogoutRedirect ?? "auth/login");
    }
  }, [qc, router, options]);

  return {
    navigateTo,
    handleLogout,
  } as const;
};

