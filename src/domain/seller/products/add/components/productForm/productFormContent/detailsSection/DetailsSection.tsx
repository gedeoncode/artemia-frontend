"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FileText, Tag } from "lucide-react";

import { Category, CategoryAttribute } from "@/types";
import { DynamicForm } from "./dynamicForm/DynamicForm";
import { CreateProductFormSchema } from "../../../../../schemas";

// Shadcn Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/";
import { Textarea } from "@/components/ui/";
import { Badge } from "@/components/ui/";
import { FormFieldFeedback } from "@/components/error/FormFieldFeedback";
interface Props {
  selectedCategory?: Category;
  details: CategoryAttribute[];
  className?: string;
}

export function DetailsSection({
  selectedCategory,
  className,
  details,
}: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CreateProductFormSchema>();

  const description = watch("description") || "";

  const attributes = useMemo(
    () => selectedCategory?.attributes ?? [],
    [selectedCategory],
  );

  const hasAttributes = attributes.length > 0;
  const attributeCount = attributes.length;

  // Description character count and limits
  const charCount = description.length;
  const maxChars = 5000;

  const isOverLimit = charCount > maxChars;
  // Check if description has error
  const hasDescriptionError = !!errors.description;

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* ================= DESCRIPTION SECTION ================= */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Product Description
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Tell buyers everything they need to know about your item
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={6}
                  maxLength={maxChars}
                  className={`resize-y text-sm ${
                    hasDescriptionError ? "border-destructive" : ""
                  } ${isOverLimit ? "border-destructive" : ""}`}
                  placeholder={`Describe your ${selectedCategory?.name?.toLowerCase() || "item"} in detail...`}
                  aria-describedby="description-help description-counter"
                />
              </div>

              {hasDescriptionError && (
                <FormFieldFeedback
                  message={
                    errors.description?.message ||
                    "Please provide a description"
                  }
                />
              )}

              <p
                id="description-help"
                className="text-xs text-muted-foreground"
              >
                Provide a clear, detailed description. Include key features,
                condition, and any important details buyers should know.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ================= ATTRIBUTES SECTION ================= */}
        {selectedCategory && hasAttributes ? (
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                      <Tag className="h-5 w-5 text-blue-600" />
                      Product Attributes
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Provide specific details about your{" "}
                      {selectedCategory.name}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {attributeCount} fields
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                {/* Dynamic Attributes */}
                <div className="space-y-4">
                  <DynamicForm attributes={attributes} details={details} />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <Card className="border-0 shadow-sm border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4">
                  <Tag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  No category selected
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Select a category in the previous step to see and fill in
                  product-specific attributes.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Categories help organize your listing
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
