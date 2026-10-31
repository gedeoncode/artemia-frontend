import { API_BASE_URL } from "@/config/env";
import { getCookieValue, refreshAccessToken } from "../auth/";
import { classify } from "@/errors";
export type ServerFetchOptions = RequestInit & {
  retries?: number;
  retryDelay?: number;
  body?: unknown;
  requireAuth?: boolean;
  accessToken?: string; // optional explicit access token
  signal?: AbortSignal;
};

let refreshPromise: Promise<string | null> | null = null;

async function getFreshToken() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
/**
 * Enterprise-grade server fetch
 */
export async function serverFetch<T = unknown>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const {
    retries = 3,
    retryDelay = 300,
    body,
    requireAuth = true,
    accessToken,
    signal,
    ...fetchOptions
  } = options;

  const cookieToken = await getCookieValue("access_token");
  let token = accessToken ?? cookieToken;

  if (requireAuth && !token) {
    // token = await getFreshToken()
    throw classify({
      status: 401,
      code: "UNAUTHORIZED",
      message: "Authentication required but no access token available",
    });
  }

  let attempt = 0;

  while (attempt <= retries) {
    const combinedSignal = signal
      ? AbortSignal.any([signal, AbortSignal.timeout(10000)])
      : AbortSignal.timeout(10000);

    try {
      const isFormData = body instanceof FormData;

      const headers = new Headers(fetchOptions.headers);

      if (!isFormData) headers.set("Content-Type", "application/json");

      if (token) headers.set("Authorization", `Bearer ${token}`);

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        signal: combinedSignal,
      });

      if (res.status === 204) return null as T;
      let json: any = null;

      if (res.headers.get("content-type")?.includes("application/json")) {
        try {
          json = await res.json();
        } catch {
          throw classify({
            status: res.status,
            message: "Invalid JSON response",
          });
        }
      }

      // -------------------------
      // Handle non-OK responses
      // -------------------------
      if (!res.ok) {
        // Attempt token refresh once if 401 and auth required
        const hasRetried =
          (fetchOptions.headers as Record<string, string>)?.[
            "x-refresh-attempt"
          ] === "true";
        if (res.status === 401 && requireAuth && !hasRetried) {
          const newToken = await getFreshToken();
          if (newToken) {
            token = newToken; // update token for retry
            return serverFetch<T>(endpoint, {
              ...options,
              accessToken: newToken,
              headers: {
                ...(fetchOptions.headers || {}),
                "x-refresh-attempt": "true", // prevent infinite loop
              },
            });
          }

          throw classify({
            status: 401,
            code: "SESSION_EXPIRED",
            message: "Session expired, please login again",
          });
        }

        // Retry server errors (5xx)
        if (res.status >= 500 && attempt < retries) {
          attempt++;
          const delay =
            retryDelay * Math.pow(2, attempt - 1) + Math.random() * 100;
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        throw classify({
          status: res.status,
          code: json?.code ?? "UNKNOWN_ERROR",
          message: json?.message ?? `API error: ${res.status}`,
        });
      }

      return json as T;
    } catch (err: unknown) {
      const isNetworkError =
        err instanceof Error &&
        (err.name === "AbortError" ||
          err.message.includes("fetch failed") ||
          err.message.includes("NetworkError") ||
          err.message.includes("Failed to fetch"));

      if (isNetworkError && attempt < retries) {
        attempt++;
        const delay =
          retryDelay * Math.pow(2, attempt - 1) + Math.random() * 100;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      throw classify(err);
    }
  }

  throw classify({
    status: 500,
    message: "Exhausted retries",
  });
}
