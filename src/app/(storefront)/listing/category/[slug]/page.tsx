// /app/categories/[slug]/page.tsx

import { buildMetadata, ListingPage, SearchParams } from "@/domain";

function extractId(slug: string) {
  return slug.split("-").pop();
}

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<SearchParams>;
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const categoryId = extractId(slug);

  return (
    <ListingPage
      searchParams={resolvedSearchParams}
      config={{
        type: "category",
        categoryId,
      }}
    />
  );
}

export async function generateMetadata({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  return buildMetadata({
    type: "category",
    title: slug, // later: fetch real category name
  });
}