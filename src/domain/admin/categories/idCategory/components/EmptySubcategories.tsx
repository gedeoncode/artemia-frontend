import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button/Button";
import { Category } from "../../../../../../domain/admin/categories/services/types";

interface EmptySubcategoriesProps {
  parentCategory: Category;
  onAddClick?: () => void;
}

export function EmptySubcategories({
  parentCategory,
  onAddClick,
}: EmptySubcategoriesProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
      <Icons.folderOpen className="w-12 h-12 text-muted-foreground" />
      <div className="w-24 h-24 mb-4 rounded-full bg-muted" />
      <h3 className="mb-2 text-lg font-medium">No subcategories yet</h3>
      <p className="max-w-md mb-4 text-sm text-muted-foreground">
        Organize products under {parentCategory.name} by creating subcategories
      </p>
      <Button onClick={onAddClick} size="sm">
        <Icons.add className="w-4 h-4 mr-2" />
        Add Subcategory
      </Button>
    </div>
  );
}
