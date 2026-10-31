"use client";

import React from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button/Button";

type Action = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type RedirectLoaderProps = {
  title: string;
  description?: string;
  ariaLive?: "polite" | "assertive";
  actions?: Action[];
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
};

export function RedirectLoader({
  title,
  description,
  ariaLive = "polite",
  actions = [],
  size = "md",
}: RedirectLoaderProps) {
  return (
    <main
      role="status"
      aria-live={ariaLive}
      className="grid min-h-screen px-4 text-center place-items-center"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <LoadingSpinner size={size} aria-hidden />

        {/* Text */}
        <div className="space-y-1">
          <h1
            className={`font-medium ${size === "sm" ? "text-base" : "text-lg"}`}
          >
            {title}
          </h1>

          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {actions.map((action, idx) =>
              action.href ? (
                <Button key={idx} variant="outline">
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ) : (
                <Button key={idx} onClick={action.onClick}>
                  {action.label}
                </Button>
              ),
            )}
          </div>
        )}
      </div>
    </main>
  );
}
