"use client";

import React from "react";

interface Props {
  zoomStyle: React.CSSProperties;
}

export function ZoomPreview({ zoomStyle }: Props) {
  return (
    <div
      className="zoom-preview"
      style={{ "--preview-size": "min(600px, 90vw)" } as React.CSSProperties}
    >
      <div style={zoomStyle} className="absolute inset-0" />

      <style jsx>{`
        .zoom-preview {
          position: fixed;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%) translateZ(0);
          width: var(--preview-size);
          height: var(--preview-size);
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.08);
          overflow: hidden;
          z-index: 20;
          background-color: white;
          pointer-events: none;
        }
        @media (min-width: 1024px) {
          .zoom-preview {
            position: absolute;
            top: 0;
            left: 100%;
            margin-left: 1rem;
            bottom: auto;
            transform: translateZ(0);
          }
        }
      `}</style>
    </div>
  );
}
