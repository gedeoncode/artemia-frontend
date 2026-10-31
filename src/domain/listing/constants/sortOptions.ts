export const DEBOUNCE_DELAY = 500;

export const SORT_OPTIONS = [
  { value: "", label: "Pertinence" },
  { value: "priceLowToHigh", label: "Prix : croissant" },
  { value: "priceHighToLow", label: "Prix : décroissant" },
  { value: "newest", label: "Nouveautés" },
  { value: "bestSelling", label: "Meilleures ventes" },
  { value: "customerTopRated", label: "Mieux notés" },
] as const;
