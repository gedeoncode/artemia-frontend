import { API_BASE_URL } from "@/config/env";
import { classify } from "../../errors/classify";

type ApiFetchOptions = RequestInit & {
  token?: string;
  requireAuth?: boolean;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
  body?: any;
};

export type FetchOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

let refreshPromise: Promise<boolean | null> | null = null;

// 🔑 Refresh token endpoint
async function refreshSession(): Promise<boolean | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    requireAuth = false,
    timeout = 10000,
    retries = 3,
    retryDelay = 300,
    signal,
    body,
    ...fetchOptions
  } = options;

  let attempt = 0;

  while (true) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const combinedSignal = signal
      ? anySignal([signal, controller.signal])
      : controller.signal;

    try {
      const isFormData = body instanceof FormData;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(fetchOptions.headers || {}),
        },
        credentials: requireAuth ? "include" : "same-origin",
        signal: combinedSignal,
      });

      clearTimeout(timeoutId);

      if (response.status === 204) {
        return null as T;
      }

      let json: any;
      try {
        json = await response.json();
      } catch {
        throw classify({
          status: response.status,
          message: "Invalid JSON response",
        });
      }

      if (!response.ok) {
        // 🔄 Session expired → refresh
        if (response.status === 401 && requireAuth) {
          const refreshed = await refreshSession();

          if (refreshed) {
            continue; // retry original request
          }

          throw classify({
            status: 401,
            message: "Unauthorized: session expired",
          });
        }

        // Retry transient errors
        if (response.status >= 500 && attempt < retries) {
          attempt++;
          const delay =
            retryDelay * Math.pow(2, attempt - 1) + Math.random() * 100;
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        throw classify({
          status: response.status,
          code: json?.code ?? "UNKNOWN_ERROR",
          message: json?.message ?? `API error: ${response.status}`,
        });
      }

      return json as T;
    } catch (err: any) {
      clearTimeout(timeoutId);

      const isNetworkError =
        err?.name === "AbortError" ||
        err?.message?.includes("NetworkError") ||
        err?.message?.includes("Failed to fetch");

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
}

// Utility: merge multiple AbortSignals
function anySignal(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  signals.forEach((s) => {
    if (s.aborted) controller.abort();
    else s.addEventListener("abort", () => controller.abort());
  });
  return controller.signal;
}
