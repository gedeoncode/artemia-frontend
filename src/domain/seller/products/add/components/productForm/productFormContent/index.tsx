"use client";

import dynamic from "next/dynamic";

// Dynamically import each step — code-split per component
export const BasicInfoSection = dynamic(
  () =>
    import("./basic-info/BasicInfoSection").then((mod) => mod.BasicInfoSection),
  { ssr: false }
);

export const MediaSection = dynamic(
  () => import("./MediaSection").then((mod) => mod.MediaSection),
  { ssr: false }
);


export const ShippingSection = dynamic(
  () => import("./ShippingSection").then((mod) => mod.ShippingSection),
  { ssr: false }
);

export const ReviewSection = dynamic(
  () =>
    import("./ReviewSection/ReviewSection").then((mod) => mod.ReviewSection),
  { ssr: false}
);
