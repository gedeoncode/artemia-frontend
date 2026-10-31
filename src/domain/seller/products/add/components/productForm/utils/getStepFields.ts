import { CategoryAttribute } from "@/types";

interface GetStepFieldsParams {
  step: number;
  selectedCategory: { attributes?: CategoryAttribute[] };
  resolveActiveFields: (attributes: CategoryAttribute[]) => string[];
}

export function getStepFields({
  step,
  selectedCategory,
  resolveActiveFields,
}: GetStepFieldsParams): string[] {
  switch (step) {
    case 0:
      return ["name", "category", "shortDescription"];

    case 1:
      return ["images"];

    case 2:
      return [
        "description",
        ...resolveActiveFields(selectedCategory?.attributes ?? []),
      ];

    case 3:
      return [
        "pricing",
        "shipping.location.city",
        "shipping.location.quartier",
      ];

    default:
      return [];
  }
}