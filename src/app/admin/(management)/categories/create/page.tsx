import { CategoryCreateForm } from "@/domain/admin/categories/create/components/CategoryCreateForm";
import { connection } from "next/server";

export const metadata = {
  title: "Create New Category | Admin Dashboard",
  description:
    "Create a new product category with advanced settings and SEO optimization",
};

export default async function CreateCategoryPage() {
  await connection()
  return <CategoryCreateForm />;
}
