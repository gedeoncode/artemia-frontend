// src/constants/category/categoryNature.constants.ts

export const CATEGORY_NATURES = [
  "product",
  "digital",
  "service",
  "job",
  "property",
  "vehicle",
  "space",
  "mixed",
] as const;

export type CategoryNature = (typeof CATEGORY_NATURES)[number];

export const CATEGORY_NATURE_OPTIONS = [
  {
    value: "product",
    label: "Physical",
    description: "Tangible goods",
  },
  {
    value: "digital",
    label: "Digital",
    description: "Downloads, services",
  },
 {
  value: "service",
  label: "Service",
  description: "Professional or on-demand services",
},
{
  value: "job",
  label: "Job",
  description: "Employment opportunities and career openings",
},
{
  value: "property",
  label: "Real Estate",
  description: "Properties, land, and buildings",
},
{
  value: "vehicle",
  label: "Vehicle",
  description: "Cars, bikes, trucks, and transport",
},
{
  value: "space",
  label: "Space",
  description: "Rentable spaces, venues, or storage",
},
{
  value: "mixed",
  label: "Mixed",
  description: "Mixed",
},
] as const;