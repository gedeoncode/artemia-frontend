import { getCurrentUser } from "@/domain/auth/services";
import { logger } from "@/lib/logger";
import { SessionUser } from "../types";

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const { user } = await getCurrentUser();

    if (!user?.id || !user.email) {
      logger.error("Malformed session user payload", { user });
      return null;
    }
    return user;
  } catch (err: any) {
    if (err?.status === 401) return null;
    logger.error("Fetch session user error", { err });
    return null;
  }
}
