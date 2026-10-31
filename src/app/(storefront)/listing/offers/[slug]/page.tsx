// /app/categories/[slug]/page.tsx
import { buildMetadata, ListingPage, SearchParams } from "@/domain";

type CategoryPageProps = {
  params: {
    slug: string
  },
searchParams: SearchParams
};

export default function OffersPage({ params, searchParams }: CategoryPageProps) {
  return (
    <ListingPage
      searchParams={searchParams}
      config={{
        type: "offer",
        offerSlug: params.slug,
      }}
    />
  );
}
export async function generateMetadata({ params }: CategoryPageProps) {
  return buildMetadata({
    type: "offer",
    title: params.slug,
  });
}