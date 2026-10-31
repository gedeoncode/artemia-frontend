"use client";

import React from "react";

interface Props {
  lensSize: number;
  lensShape: "circle" | "square";
  x: number;
  y: number;
}

export function ZoomLens({ lensSize, lensShape, x, y }: Props) {
  return (
    <div
      className={`absolute pointer-events-none z-50 ${
        lensShape === "circle" ? "rounded-full" : "rounded-sm"
      }`}
      style={{
        width: lensSize,
        height: lensSize,
        left: x,
        top: y,
        border: "1px solid rgba(102, 153, 255, 0.28)",
        backgroundColor: "rgba(255,255,255,0.6)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.8) inset, 0 2px 8px rgba(0,0,0,0.08)",
        position: "absolute",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px bg-slate-200/40" />
        <div className="absolute w-px h-full bg-slate-200/40" />
      </div>
    </div>
  );
}
