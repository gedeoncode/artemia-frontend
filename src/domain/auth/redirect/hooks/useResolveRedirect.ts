// hooks/useResolveRedirect.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import { authService } from "@/domain/auth/services/authService";
import { getNextRedirect } from "@/lib/utils/navigation/nextRedirect";

type UseResolveRedirectProps = {
  user: any; // replace with your actual User type
  enabled?: boolean;
};

export function useResolveRedirect({
  user,
  enabled = true,
}: UseResolveRedirectProps) {
  return useQuery({
    queryKey: ["resolve-redirect", user?.id],

    queryFn: async () => {
      // 1️⃣ Fast client fallback
      const fallbackRoute = getNextRedirect(user);

      // 2️⃣ Backend authoritative redirect
      const response = await authService.resolveRedirect();

      const finalRoute = response.redirectTo || fallbackRoute;

      if (!finalRoute) {
        throw new Error("No redirect destination found.");
      }

      return finalRoute;
    },

    enabled: enabled && !!user,

    staleTime: 1000 * 60 * 5,
  });
}
