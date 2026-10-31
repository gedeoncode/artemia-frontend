interface PriceValidation {
  isValid: boolean;
  error: string;
}
export const validatePriceRange = (
  min: string,
  max: string
): PriceValidation => {
  const minNum = parseFloat(min);
  const maxNum = parseFloat(max);

  if (min && isNaN(minNum)) {
    return { isValid: false, error: "Le prix minimum n'est pas valide" };
  }

  if (max && isNaN(maxNum)) {
    return { isValid: false, error: "Le prix maximum n'est pas valide" };
  }

  if (min && minNum < 0) {
    return { isValid: false, error: "Le prix ne peut pas être négatif" };
  }

  if (max && maxNum < 0) {
    return { isValid: false, error: "Le prix ne peut pas être négatif" };
  }

  if (min && max && minNum > maxNum) {
    return {
      isValid: false,
      error: "Le prix minimum ne peut pas dépasser le prix maximum",
    };
  }

  return { isValid: true, error: "" };
};
