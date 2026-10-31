"use client";

import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

import { type CategoryNode } from "@/domain/home/services/nodeCategories.services";
import { type FeaturedCategoryLink } from ".";

type CategoryMenuRailProps = {
  activeLeaf: CategoryNode | null;
  previewLeaf?: CategoryNode | null; // 👈 NEW
  getCategoryHref: (category: CategoryNode) => string;
  featuredLinks: FeaturedCategoryLink[];
  onCategoryClick?: (category: CategoryNode, level: number) => void;
  activeLevel?: number;
};

export function CategoryMenuRail({
  activeLeaf,
  previewLeaf,
  getCategoryHref,
  featuredLinks,
  onCategoryClick,
  activeLevel = 0,
}: CategoryMenuRailProps) {
  const contextLeaf = previewLeaf ?? activeLeaf; // 👈 state-machine aware

  return (
    <div className="hidden w-[340px] border-l border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-white p-6 lg:block">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        <Sparkles className="h-3.5 w-3.5" />
        Explore
      </div>

      {/* =========================
          EMPTY STATE
      ========================= */}
      {!contextLeaf ? (
        <div className="p-5 border border-dashed rounded-sm border-slate-200 bg-white/80">
          <h3 className="text-base font-semibold text-slate-900">
            Start browsing
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Hover over a category or use your keyboard to explore the catalog.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* =========================
              CONTEXT HEADER
          ========================= */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                {contextLeaf.name}
              </h3>

              {/* subtle preview badge */}
              {previewLeaf && previewLeaf._id !== activeLeaf?._id && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Preview
                </span>
              )}
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Discover curated collections, featured products, and faster ways
              to browse this catalog branch.
            </p>
          </div>

          {/* =========================
              PRIMARY ACTION
          ========================= */}
          <div className="space-y-3">
            <Link
              href={getCategoryHref(contextLeaf)}
              onClick={() =>
                onCategoryClick?.(contextLeaf, activeLevel)
              }
              className="inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium bg-secondary-button"
            >
              Shop {contextLeaf.name} 
              <ChevronRight className="w-4 h-4 group-hover:text-slate-600" />
            </Link>
          </div>

          {/* =========================
              FEATURED LINKS
          ========================= */}
          {featuredLinks.length > 0 && (
            <div className="pt-5 space-y-3 border-t border-slate-200">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Featured
              </div>

              <div className="space-y-2">
                {featuredLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium transition bg-white border rounded-sm group border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}