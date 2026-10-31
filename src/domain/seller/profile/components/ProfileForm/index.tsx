// src/components/ProfileForm/index.ts
"use client";

import dynamic from "next/dynamic";

// Lazy imports for code-splitting
export const PersonalInfo = dynamic(
  () => import("./PersonalInfo").then((mod) => mod.PersonalInfo),
  { loading: () => <p>Loading Personal Info...</p> }
);

export const BusinessInfo = dynamic(
  () => import("./BusinessInfo").then((mod) => mod.BusinessInfo),
  { loading: () => <p>Loading Business Info...</p> }
);

export const SellingMode = dynamic(
  () => import("./SellingMode").then((mod) => mod.SellingMode),
  { loading: () => <p>Loading Selling Mode...</p> }
);

export const SecuritySettings = dynamic(
  () => import("./SecuritySettings").then((mod) => mod.SecuritySettings),
  { loading: () => <p>Loading Security Settings...</p> }
);
