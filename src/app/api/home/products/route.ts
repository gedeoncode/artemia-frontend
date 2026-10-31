
import { fetchProductSections } from "@/domain";

import { withHandler } from "@/lib/http/withHandler";

export const GET = withHandler(fetchProductSections);
