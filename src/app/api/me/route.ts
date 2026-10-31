
import { getCurrentUser } from "@/domain/auth/services";
import { withHandler } from "@/lib/http";

export const GET = withHandler(getCurrentUser);

