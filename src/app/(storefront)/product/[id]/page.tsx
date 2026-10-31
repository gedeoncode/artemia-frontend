import { fetchProductById } from "@/domain";
import { NEXT_PUBLIC_SITE_NAME } from "@/config/env";
import { ProductScreen } from "@/domain/product/components/ProductScreen";
import { adaptProduct } from "@/adapters/productAdapter";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const { product } = await fetchProductById(id);

  return <ProductScreen id={id} product={adaptProduct(product)} />;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  return {
    title: `Product ${id} – ${NEXT_PUBLIC_SITE_NAME}`,
    description: "View product details, pricing, and more.",
    keywords: "product, item, ecommerce, details",
  };
}
