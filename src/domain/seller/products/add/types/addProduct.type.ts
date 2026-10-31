import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type {
  ProductFormData,
  ProductCategory,
  ProductVariant,
} from "../../types";

export interface BasicInfoSectionProps {
  categories: ProductCategory[];
  variants: ProductVariant[];
  onAddVariant: (variant: ProductVariant) => void;
  onRemoveVariant: (index: number) => void;
  isEdit?: boolean;
  register: UseFormRegister<ProductFormData>;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export type VariantsSectionProps = {
  variants: {
    option: string;
    values: string[];
  }[];
  onAddVariant: (variant: { option: string; values: string[] }) => void;
  onRemoveVariant: (index: number) => void;
};

export type AddProductResult = {
  success: boolean;
  message?: string;
  redirectPath?: string;
};