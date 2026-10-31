import MainLayout from "@/components/layout/MainLayout";
import { fetchNodeCategories } from "@/domain/home/services/nodeCategories.services";
import { ReactNode } from "react";

const revalidate = 3600; // 1 hour

export default async function ProductLayout({
  children,
}: {
  children: ReactNode;
}) {
  const categories = await fetchNodeCategories(null, {
    next: { tags: ["home-categories"], revalidate: revalidate },
  });

  // 3) SUCCESS RENDER
  return <MainLayout rootCategories={categories.data}>{children}</MainLayout>;
}
