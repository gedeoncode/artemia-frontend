import { buildMetadata, ListingPage, SearchParams } from "@/domain";

type ProductsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function SearchPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <ListingPage
      searchParams={resolvedSearchParams}
      config={{
        type: "search",
        query: resolvedSearchParams.query ?? "",
      }}
    />
  );
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;

  return buildMetadata({
    type: "search",
    query: resolvedSearchParams.query,
  });
}