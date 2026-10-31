import { UserRole } from "@/types";

export const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  [UserRole.ADMIN]: "/admin",
  [UserRole.SELLER]: "/seller/dashboard",
  [UserRole.CLIENT]: "/",
  [UserRole.USER]: "/",
};

export function getRoleHomeRoute(
  role: UserRole,
): string {
  return ROLE_HOME_ROUTES[role] ?? "/unauthorized";
}

export function hasRequiredRole(
  userRole: UserRole,
  allowedRoles: UserRole[],
): boolean {
  return allowedRoles.includes(userRole);
}