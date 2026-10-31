import { redirect } from "next/navigation";
import { authService } from "@/domain/auth/services/authService";
import { UserProfileResponse } from "@/domain/auth/types";

/**
 * ---------------------------------------
 * Types
 * ---------------------------------------
 */

export async function requirePageSession(): Promise<UserProfileResponse> {
  // 1️⃣ Try existing access token
  const user = await authService.profile();

  if (user) {
    return user;
  }

  if (!user) {
    redirect("/auth/login?reason=unauthorized");
  }

  return user;
}
