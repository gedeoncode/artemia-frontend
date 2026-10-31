import { getSellerDashboard } from "@/domain/seller/dashboard/services";
import { withHandler } from "@/lib/http/withHandler";

export const GET = withHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  
  const params = {
    month: searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined,
    year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
    interval: searchParams.get('interval') as 'hourly' | 'daily' | 'weekly' | 'monthly' | undefined,
    compareWithPrevious: searchParams.get('compareWithPrevious') === 'true',
  };
  
  return getSellerDashboard({ params });
});