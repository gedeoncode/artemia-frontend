import {
  Banner,
  getHomeProducts,
  MobileBanner,
  ProductCarousselContainer,
  // ProductGridContainer,
} from "@/domain";
import { NEXT_PUBLIC_SITE_NAME } from "@/config/env";
import { CategorySection } from "@/domain/home/sections/category/CategorySection";

export default async function HomePage() {
  const { data } = await getHomeProducts({
    next: { tags: ["home-products"], revalidate: 30 },
  });
  return (
    <>
      <MobileBanner banners={data.banners} />
      <Banner
        banners={data.banners}
        sideBanners={data.sideBanners}
        className=""
      />
      <CategorySection
        categories={data.categories}
        title="Shop by Category"
        subtitle="Discover our curated collections"
      />
      
      <ProductCarousselContainer  sections={data.sections}/>
    </>
  );
}

export const metadata = {
  title: `${NEXT_PUBLIC_SITE_NAME}`,
  description: "Discover our featured products and newest arrivals",
  keywords: "ecommerce, shop, products, deals",
};
