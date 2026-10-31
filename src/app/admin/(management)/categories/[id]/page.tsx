import { notFound } from "next/navigation";
import Separator from "@/components/ui/Separator";

import { TooltipProvider } from "@/components/ui/Tooltip";

import { getCategory } from "@/domain/admin/categories/services/category.services";
import { CategoryHeader } from "@/domain/admin/categories/idCategory/components/CategoryHeader";
import { CategoryContent } from "@/domain/admin/categories/idCategory/components/CategoryContent";
import { COMPANY_NAME } from "@/constants/branding";
export default async function ViewCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  const category = await getCategory(id);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <CategoryHeader category={category} />
        <Separator />
        <CategoryContent category={category} />
      </div>
    </TooltipProvider>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const category = await getCategory(params.id);
    return {
      title: `${category.name} | ${COMPANY_NAME}`,
      description: category.description || `Browse ${category.name} products.`,
      openGraph: {
        images: [category.image || "/default-category.png"],
      },
    };
  } catch {
    return {
      title: "Category Not Found | Artemia",
      description: "This category does not exist or could not be loaded.",
    };
  }
}
