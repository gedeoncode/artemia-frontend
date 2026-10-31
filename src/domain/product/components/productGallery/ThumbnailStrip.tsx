
"use client";

import React from "react";
import { Thumbnails } from "./";

interface Props {
  images: string[];
  selectedImage: string;
  onSelect: (img: string) => void;
  toggleLensShape: () => void;
  lensShape: "circle" | "square";
  position: "left" | "bottom";
  showToggle: boolean;
  isMobile?: boolean;
}

export function ThumbnailStrip(props: Props) {
  return <Thumbnails {...props} />;
}
