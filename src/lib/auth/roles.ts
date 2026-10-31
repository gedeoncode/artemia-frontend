// i'll change the user folder later to account
export type UserRole = "seller" | "client" | "user" | "admin";

/**
 * Base route for each role.
 * (These are the "home areas" for each role)
 */
export const BASE_ROUTES: Record<UserRole, string> = {
  admin: "/admin",
  seller: "/seller",
  client: "/app", // your general user space
  user: "/app", // same as client for now
};

/**
 * Main protected route prefixes per role.
 */
export const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: [BASE_ROUTES.admin],
  seller: [BASE_ROUTES.seller],
  client: [BASE_ROUTES.client],
  user: [BASE_ROUTES.user],
};

/**
 * Cross-role / exception routes
 * These are checked BEFORE base role routes.
 */
export const SHARED_ROUTES: Record<string, UserRole[]> = {
  // 🔹 onboarding is now top-level (recommended)
  "/onboarding": ["user", "client", "seller", "admin"],

  // examples you might add later:
  // "/help": ["user", "client", "seller", "admin"],
  // "/support": ["user", "client", "seller", "admin"],
};

/**
 * Utility: Check if a role has access to a given pathname.
 */
export function hasAccess(role: UserRole, pathname: string): boolean {
  /* 1. Shared routes first */
  for (const route in SHARED_ROUTES) {
    if (pathname.startsWith(route)) {
      return SHARED_ROUTES[route].includes(role);
    }
  }

  /* 2. Normal role-based routes */
  const routes = ROLE_ROUTES[role];
  return routes.some((route) => pathname.startsWith(route));
}
