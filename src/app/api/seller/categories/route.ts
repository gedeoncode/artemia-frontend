import { getSellerCategories } from "@/lib/api/";
import { withHandler } from "@/lib/http/withHandler";

export const GET = withHandler(getSellerCategories);
