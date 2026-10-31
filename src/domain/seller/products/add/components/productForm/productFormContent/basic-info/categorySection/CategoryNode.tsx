"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Layers } from "lucide-react";
import type { ProductCategory } from "../../../../../../types/product.types";

import { Badge } from "@/components/ui/Badge";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { CategorySkeleton } from "./CategorySkeleton";
type Props = {
  category: ProductCategory;
  level?: number;
  selectedId?: string;
  onSelect: (id: string) => void;
  childrenMap: Record<string, ProductCategory[]>;
  searchTerm?: string;
  maxDepth?: number;
  isLoading?: boolean;
};
/* ------------------------- Category Node -------------------------- */
export const CategoryNode = ({
  category,
  level = 0,
  selectedId,
  onSelect,
  childrenMap,
  searchTerm = "",
  maxDepth = 5,
  isLoading = false,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = (childrenMap[category._id] || []).length > 0;
  const isSelected = selectedId === category._id;
  const isAtMaxDepth = level >= maxDepth;

  useEffect(() => {
    if (
      searchTerm.trim() &&
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      setExpanded(true);
    }
  }, [searchTerm, category.name]);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasChildren && !isAtMaxDepth) setExpanded(!expanded);
    },
    [hasChildren, isAtMaxDepth, expanded],
  );

  const handleSelect = useCallback(
    () => onSelect(category._id),
    [onSelect, category._id],
  );

  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const lowerText = text.toLowerCase();
    const lowerSearch = search.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerSearch);
    if (matchIndex === -1) return text;
    const before = text.slice(0, matchIndex);
    const match = text.slice(matchIndex, matchIndex + search.length);
    const after = text.slice(matchIndex + search.length);
    return (
      <>
        {before}
        <mark className="bg-blue-100 text-blue-800 rounded-sm px-0.5 font-medium">
          {match}
        </mark>
        {after}
      </>
    );
  };

  const paddingLeft = useMemo(() => {
    const base = level * 20;
    return base > 0 ? `${base}px` : "0px";
  }, [level]);

  return (
    <div className="relative">
      <motion.div
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.1 }}
        onClick={handleSelect}
        className={`group relative flex items-start gap-2 py-2.5 px-3 rounded-xl cursor-pointer transition-all duration-150 ${
          isSelected
            ? "bg-blue-50/80 ring-1 ring-blue-200 shadow-sm"
            : "hover:bg-gray-50/80 active:bg-gray-100/80"
        }`}
        style={{ paddingLeft: `calc(0.75rem + ${paddingLeft})` }}
      >
        {/* Expand/Collapse Button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={!hasChildren || isAtMaxDepth}
          className={`
            flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5
            transition-all duration-150
            ${
              hasChildren && !isAtMaxDepth
                ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                : "text-gray-300 cursor-not-allowed"
            }
          `}
          aria-label={expanded ? "Collapse category" : "Expand category"}
        >
          {hasChildren && !isAtMaxDepth ? (
            <motion.div
              initial={false}
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown className="w-4 h-4" />
            </motion.div>
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        {/* Icon / Image */}
        <div className="flex-shrink-0 mt-0.5">
          {(category as any)?.image ? (
            <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <Image
                src={(category as any).image}
                alt={category.name}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div
              className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              transition-colors duration-150
              ${
                isSelected
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
              }
            `}
            >
              <Layers className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <span
              className={`
                text-sm font-medium truncate max-w-[200px] sm:max-w-none
                transition-colors duration-150
                ${isSelected ? "text-blue-900" : "text-gray-900"}
              `}
            >
              {highlightMatch(category.name, searchTerm)}
            </span>
            {hasChildren && (
              <Badge
                variant="secondary"
                className="flex-shrink-0 text-[11px] font-mono h-5 px-1.5 bg-gray-100 text-gray-600"
              >
                {childrenMap[category._id]?.length || 0}
              </Badge>
            )}
            {isSelected && (
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm">
                <FiCheck className="w-3 h-3" />
              </div>
            )}
          </div>
          {category.description && (
            <p
              className={`
                text-xs mt-1 line-clamp-2
                transition-colors duration-150
                ${isSelected ? "text-blue-700/80" : "text-gray-500"}
              `}
            >
              {category.description}
            </p>
          )}
        </div>
      </motion.div>

      {/* Children Container */}
      <AnimatePresence initial={false}>
        {expanded && hasChildren && !isAtMaxDepth && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative mt-1">
              {isLoading ? (
                <div className="py-2 pl-6">
                  <CategorySkeleton />
                </div>
              ) : (
                (childrenMap[category._id] || []).map((child) => (
                  <CategoryNode
                    key={child._id}
                    category={child}
                    level={level + 1}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    childrenMap={childrenMap}
                    searchTerm={searchTerm}
                    maxDepth={maxDepth}
                    isLoading={isLoading}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
