import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Securely redirects to the login page while preserving the intended return path.
 * - Allows specifying a custom redirect destination
 * - Falls back to current path when not provided
 * - Validates all redirect paths
 * - Prevents open redirect vulnerabilities
 */
export const redirectToLogin = (
  router: AppRouterInstance,
  options?: {
    redirect?: string; // Preferred post-login destination
    searchParams?: ReadonlyURLSearchParams;
  },
  basePath: string = "/auth/login"
): void => {
  try {
    // Guard against SSR
    if (typeof window === "undefined") {
      if (process.env.NODE_ENV === "development") {
        console.warn("[redirectToLogin] Skipped during SSR");
      }
      return;
    }

    const { redirect, searchParams } = options || {};

    // --- 1. Determine callback target ----------------------------------------
    let callbackUrl = redirect;

    // If no redirect explicitly passed → use current URL
    if (!callbackUrl) {
      const currentPath = window.location.pathname;
      const queryString =
        searchParams?.toString() || window.location.search.replace(/^\?/, "");

      const rawCallback = `${currentPath}${queryString ? `?${queryString}` : ""}`;
      callbackUrl = rawCallback;
    }

    // --- 2. Validate callback -----------------------------------------------
    const safeCallbackUrl = validateCallbackUrl(callbackUrl);

    // --- 3. Redirect to login ------------------------------------------------
    const loginUrl = `${basePath}?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`;
    router.push(loginUrl);
  } catch (error) {
    console.error("[redirectToLogin] Critical error:", error);
    router.push(basePath); // fallback: no callback
  }
};

// --- Security Helpers ---
const validateCallbackUrl = (url: string): string => {
  const UNSAFE_PATTERNS = [
    "http://",
    "https://",
    "//",
    "/auth/", // prevent login → login loops
    "/api/",
  ];

  const isSafe = !UNSAFE_PATTERNS.some((pattern) => url.includes(pattern));
  return isSafe ? url : "/";
};
