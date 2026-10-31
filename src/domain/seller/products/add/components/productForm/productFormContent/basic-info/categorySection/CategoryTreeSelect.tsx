"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import {
  FiChevronRight,
  FiSearch,
  FiX,
  FiCheck,
  FiLoader,
} from "react-icons/fi";
import { Layers } from "lucide-react";
import type { Category } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button/Button";
import { CategorySkeleton } from "./CategorySkeleton";
import { CategoryNode } from "./CategoryNode";
import { FormFieldFeedback } from "@/components/error/FormFieldFeedback";

type Props = {
  categories: Category[];
  isEdit?: boolean;
  isLoading?: boolean;
  error?: string;
  maxDepth?: number;
  required?: boolean;
  className?: string;
};

/* ----------------------- Main Component --------------------------- */
export const CategoryTreeModalSelect = ({
  categories,
  isEdit = false,
  isLoading = false,
  error,
  maxDepth = 5,
  required = true,
  className = "",
}: Props) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const selectedCategoryId = watch("category");
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const { childrenMap, categoryMap, flatCategories } = useMemo(() => {
    const childMap: Record<string, Category[]> = {};
    const map: Record<string, Category> = {};
    categories.forEach((cat) => {
      const parentId = cat.parent || "root";
      if (!childMap[parentId]) childMap[parentId] = [];
      childMap[parentId].push(cat);
      map[cat._id] = cat;
    });
    Object.keys(childMap).forEach((key) =>
      childMap[key].sort((a, b) => a.name.localeCompare(b.name)),
    );
    return {
      childrenMap: childMap,
      categoryMap: map,
      flatCategories: categories,
    };
  }, [categories]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const t = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(t);
    }
  }, [searchTerm]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return childrenMap["root"] || [];
    const lower = searchTerm.toLowerCase();
    return flatCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.description?.toLowerCase().includes(lower),
    );
  }, [flatCategories, childrenMap, searchTerm]);

  const selectedCategory = categoryMap[selectedCategoryId];
  const handleSelect = async (id: string) => {
    if (!isEdit) {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 500));
      setValue("category", id, { shouldValidate: true });
      setLoading(false);
    }
  };

  const handleClearSelection = () => {
    if (!isEdit) setValue("category", "", { shouldValidate: true });
  };

  const rootNodes =
    searchTerm.trim() === "" ? childrenMap["root"] || [] : filteredCategories;
  const hasError = error || errors.category?.message?.toString();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label Row */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-semibold text-gray-800">
          Category
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {selectedCategoryId && (
          <button
            type="button"
            onClick={handleClearSelection}
            disabled={isEdit}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !isEdit && setModalOpen(true)}
        disabled={isEdit || isLoading}
        className={`
          w-full px-4 py-3 rounded-xl border text-left
          transition-all duration-150
          flex items-center justify-between gap-3
          ${
            isEdit || isLoading
              ? "bg-gray-50 border-gray-200 cursor-not-allowed"
              : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm active:bg-gray-50 cursor-pointer"
          }
          ${hasError ? "border-red-300 ring-1 ring-red-300" : ""}
        `}
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <FiLoader className="w-5 h-5 text-gray-400 animate-spin" />
            <span className="text-sm text-gray-500">Loading categories...</span>
          </div>
        ) : selectedCategory ? (
          <div className="flex items-center gap-3 min-w-0">
            {(selectedCategory as Category)?.image ? (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-gray-200 bg-white overflow-hidden">
                <Image
                  src={(selectedCategory as Category).image || ""}
                  alt={selectedCategory.name}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Layers className="w-4 h-4 text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {selectedCategory.name}
              </div>
              {selectedCategory.description && (
                <div className="text-xs text-gray-500 truncate mt-0.5">
                  {selectedCategory.description}
                </div>
              )}
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Select a category...</span>
        )}
        {!isEdit && !isLoading && (
          <FiChevronRight className="flex-shrink-0 w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
        )}
      </button>

      {/* Error Message */}
      {hasError && (
        <div className="pt-0.5">
          <FormFieldFeedback message={hasError} />
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => !loading && setModalOpen(false)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
                mass: 0.8,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between flex-shrink-0 px-5 py-4 border-b border-gray-100 bg-white">
                <h2 className="flex items-center gap-2.5 text-base font-semibold text-gray-900">
                  <div className="p-1.5 rounded-lg bg-gray-100">
                    <Layers className="w-4 h-4 text-gray-700" />
                  </div>
                  Select Category
                </h2>
                <button
                  onClick={() => !loading && setModalOpen(false)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${
                      loading
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                    }
                  `}
                  aria-label="Close modal"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Search Section */}
              <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-gray-100 bg-white">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search categories..."
                    className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Search Meta */}
                {searchTerm.trim() && (
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className="text-gray-500">
                      {isSearching
                        ? "Searching..."
                        : `${filteredCategories.length} result${
                            filteredCategories.length > 1 ? "s" : ""
                          }`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>

              {/* Categories List */}
              <div className="flex-1 overflow-y-auto px-2 py-4 bg-white">
                {isLoading ? (
                  <div className="px-3 py-4">
                    <CategorySkeleton />
                  </div>
                ) : rootNodes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-gray-50 mb-4">
                      <Layers className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {searchTerm.trim()
                        ? "No matching categories"
                        : "No categories available"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {searchTerm.trim()
                        ? "Try adjusting your search"
                        : "Please check back later"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {rootNodes.map((cat) => (
                      <CategoryNode
                        key={cat._id}
                        category={cat}
                        selectedId={selectedCategoryId}
                        onSelect={handleSelect}
                        childrenMap={childrenMap}
                        searchTerm={searchTerm}
                        maxDepth={maxDepth}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="min-w-0 text-sm text-gray-600">
                  {selectedCategory ? (
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="truncate">
                        Selected:{" "}
                        <strong className="font-medium text-gray-900">
                          {selectedCategory.name}
                        </strong>
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No category selected
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => !loading && setModalOpen(false)}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-4 py-2 text-sm rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setModalOpen(false)}
                    disabled={!selectedCategory || loading}
                    className="flex-1 sm:flex-none px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
