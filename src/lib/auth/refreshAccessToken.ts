"use server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/config/env";
let refreshPromise: Promise<string | null> | null = null;

/**
 * Refresh access token using server-side refresh token (rotation enabled)
 */

export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: {
            Cookie: cookies().toString(), // refresh token lives in HTTP-only cookie
          },
        });

        if (!res.ok) return null;

        const json = await res.json();
        const newAccessToken = json?.accessToken ?? null;

        // backend should set new refresh token cookie via Set-Cookie
        return newAccessToken;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}
