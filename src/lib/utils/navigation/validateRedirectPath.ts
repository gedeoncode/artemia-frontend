
export const validateRedirectPath = (raw: string | null): string => {
  if (!raw) return "/";

  let path = raw.trim();
  // Decode safely (prevent encoded redirect attacks like %2F%2Fexample.com)
  try {
    path = decodeURIComponent(path);
  } catch {
    return "/";
  }

  // SECURITY: Never allow full URLs
  if (/^(?:https?:)?\/\//i.test(path)) return "/";

  // SECURITY: Must start with a single slash
  if (!path.startsWith("/")) return "/";

  // Normalize: remove double slashes (//)
  path = path.replace(/\/{2,}/g, "/");

  /**
   * Allowed patterns:
   * - Product + Category routes
   * - Named pages
   * - Dynamic slugs
   * - Configurable dashboards
   */
  const ALLOWED = [
    // Home
    /^\/$/,

    // Product Pages
    /^\/product\/[\w-]+$/,
    /^\/products\/[\w-]+$/, // /products/:id
    /^\/products(?:\?.*)?$/, // /products?query

    // Categories
    /^\/category\/[\w-]+$/,

    // Searching
    /^\/search(?:\?.*)?$/,

    // Checkout + Orders
    /^\/checkout(?:\?.*)?$/,
    /^\/orders\/\d+$/,

    // Client/Seller Dashboards
    /^\/client(?:\/[\w/-]*)?$/,
    /^\/seller(?:\/[\w/-]*)?$/,

    // Generic dynamic catch-all pages you trust
    /^\/[a-zA-Z0-9-]+$/, // /about, /contact, etc.
  ];

  for (const rule of ALLOWED) {
    if (rule.test(path)) {
      return path; // SAFE redirect
    }
  }

  // Default fail-safe
  return "/";
};
