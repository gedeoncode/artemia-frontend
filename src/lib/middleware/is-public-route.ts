// Utility to check if a route is public
export function isPublicRoute(
  pathname: string,
  publicRoutes: string[]
): boolean {
  return publicRoutes.some((route) => {
    if (route === "/") {
      return pathname === "/"; // ✅ only home page
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}
