import { redirect } from "next/navigation";

import { getCurrentUser } from "@/domain/auth/services";

import { UserRole } from "@/types";

import {
  getRoleHomeRoute,
  hasRequiredRole,
} from "../policies/access-policy";

export async function requireRole(
  allowedRoles: UserRole[],
) {
  const {user} = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (
    !hasRequiredRole(
      user.role as UserRole,
      allowedRoles,
    )
  ) {
    redirect(
      getRoleHomeRoute(user.role as UserRole),
    );
  }

  return user;
}