// utils/validateCategoryFields.ts
export const validateCategoryFields = (
  category: string,
  details: Record<string, unknown>
): string | null => {
  if (category === "car") {
    if (!details.make) return "La marque de la voiture est requise";
    if (!details.model) return "Le modèle de la voiture est requis";
    if (!details.year || typeof details.year !== "number")
      return "Une année valide est requise";
  }
  if (category === "real_estate") {
    if (!details.propertyType) return "Le type de propriété est requis";
    if (!details.area || typeof details.area !== "number")
      return "Une superficie valide est requise";
    if (!details.location) return "L'emplacement est requis";
  }
  return null;
};
