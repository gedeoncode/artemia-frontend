"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authService } from "@/domain/auth/services/authService";
import { authChannel, AuthEvent, broadcastLogout } from "@/domain/auth/lib";
import { authUserKey } from "@/domain/auth/constants";
import { BaseUser } from "@/types";

/* -------------------------------------------------------------------------- */
/*                                 Types                                      */
/* -------------------------------------------------------------------------- */

interface AuthContextType {
  user: BaseUser | null;
  loading: boolean;
  ready: boolean;
  logout: (broadcast?: boolean) => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  refetchUser: () => void;
  isAuthentificated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/* -------------------------------------------------------------------------- */
/*                              Auth Provider                                 */
/* -------------------------------------------------------------------------- */

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  /* ------------------------------------------------------------------------ */
  /*                           React Query User Fetch                          */
  /* ------------------------------------------------------------------------ */

  const {
    data: user,
    isLoading,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: authUserKey,
    queryFn: async () => {
      const data = await authService.profile();
      return data.user ?? null;
    },

    retry: false,

    // 🚫 Removed polling
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
  /* ------------------------------------------------------------------------ */
  /*                    Detect Commission Model Changes (Optional UX)         */
  /* ------------------------------------------------------------------------ */

  const prevUserRef = useRef<BaseUser | null>(null);

  useEffect(() => {
    if (!isFetched) return;

    if (
      prevUserRef.current &&
      prevUserRef.current.commissionModel !== user?.commissionModel
    ) {
      toast.info("Commission model updated");
    }

    prevUserRef.current = user ?? null;
  }, [user, isFetched]);

  /* ------------------------------------------------------------------------ */
  /*                                 Logout                                    */
  /* ------------------------------------------------------------------------ */

  const logout = useCallback(
    async (broadcast = true) => {
      try {
        await authService.logout();
      } catch {
        console.log("Logout request failed");
      }

      // Immediately clear cache
      queryClient.setQueryData(authUserKey, null);

      if (broadcast) {
        broadcastLogout();
      }

      toast.success("Logged out");
    },
    [queryClient],
  );

  /* ------------------------------------------------------------------------ */
  /*                          Multi-tab Logout Sync                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const handler = (ev: MessageEvent<AuthEvent>) => {
      if (ev.data?.type === "LOGOUT") {
        queryClient.setQueryData(authUserKey, null);
      }

      if (ev.data?.type === "INVALIDATE_USER") {
        queryClient.invalidateQueries({ queryKey: authUserKey });
      }
    };

    authChannel.addEventListener("message", handler);
    return () => authChannel.removeEventListener("message", handler);
  }, [queryClient]);

  /* ------------------------------------------------------------------------ */
  /*                                Role Check                                 */
  /* ------------------------------------------------------------------------ */

  const hasRole = useCallback(
    (role: string | string[]) => {
      if (!user?.role) return false;
      return Array.isArray(role)
        ? role.includes(user.role)
        : user.role === role;
    },
    [user],
  );

  /* ------------------------------------------------------------------------ */
  /*                              Context Value                                */
  /* ------------------------------------------------------------------------ */

  const value = useMemo<AuthContextType>(
    () => ({
      user: user ?? null,
      loading: isLoading,
      ready: isFetched,
      logout,
      hasRole,
      isAuthentificated: !!user,
      refetchUser: refetch,
    }),
    [user, isLoading, isFetched, logout, hasRole, refetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* -------------------------------------------------------------------------- */
/*                                  Hook                                      */
/* -------------------------------------------------------------------------- */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
