import { fetchAddresses } from "@/domain/checkout/services/server/review.services";
import { withHandler } from "@/lib/http";

export const GET = withHandler(async () => await fetchAddresses());
