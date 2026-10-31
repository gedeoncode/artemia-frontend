export const steps = ["Informations", "Médias", "Détails", "Prix & Localisation", "Vérification"];
// export const steps = ["Basic Info", "Media", "Pricing", "Review"];
export type StepConfig = {
  id: string;
  label: string;
  fields: string[]; // form fields to validate
};

export const stepsConfig: StepConfig[] = [
  {
    id: "basic-info",
    label: "Informations de base",
    fields: ["name", "category", "details"], // first step
  },
  {
    id: "media",
    label: "Médias",
    fields: ["images"], // handle via custom upload checks
  },
  
  {
    id: "details",
    label: "Description et caractéristiques",
    fields: ["description", "details"],
  },
  {
    id: "pricing",
    label: "Prix et stock",
    fields: ["price", "stock"],
  },

  {
    id: "review",
    label: "Vérification",
    fields: [], // usually final confirmation
  },
];

// constants/steps.ts

// export const steps = [
//   {
//     title: "Informations",
//     description: "Informations de base",
//   },

//   {
//     title: "Médias",
//     description: "Photos et vidéos",
//   },

//   {
//     title: "Détails",
//     description: "Description et caractéristiques",
//   },

//   {
//     title: "Prix & Localisation",
//     description: "Tarification et emplacement",
//   },

//   {
//     title: "Vérification",
//     description: "Prévisualiser et publier",
//   },
// ] as const;