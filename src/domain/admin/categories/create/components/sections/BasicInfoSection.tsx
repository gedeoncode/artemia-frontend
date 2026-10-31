"use client";

import { useFormContext } from "react-hook-form";
import { Info } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui";
import { Section } from "../components/Section";
import { HierarchySelector } from "../components/HierarchySelector";
import { useCategories } from "../../hooks/useCategories";
import { CodeInput } from "../components/CodeInput";

export function BasicInfoSection() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();
  const { data: categories, isLoading } = useCategories();
  console.log("Data:", categories);

  const parentValue = watch("parent");

  return (
    <Section
      title="Basic Information"
      description="What is this category called and how does it fit in your hierarchy?"
      icon={<Info className="w-4 h-4" />}
      collapsible={false}
      validationErrors={errors.name ? [errors.name.message as string] : []}
    >
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Category Name
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g., Electronics, Clothing, Home Decor"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-red-500">
            {errors.name.message as string}
          </p>
        )}
        <p className="text-xs text-gray-500">
          This is how the category will appear throughout your store
        </p>
      </div>

      {/* Code Category */}
      <CodeInput
        name="code"
        label="Category code"
        placeholder="e.g., ELECTRONICS, "
        autoGenerateFromName={true}
      />
      {/* Parent Category */}
      <div className="space-y-2">
        <Label htmlFor="parent">Parent Category</Label>
        {isLoading ? (
          <div className="h-10 bg-gray-100 animate-pulse rounded-md" />
        ) : (
          <HierarchySelector
            categories={categories || []}
            value={parentValue}
            onChange={(value) =>
              setValue("parent", value, { shouldValidate: true })
            }
          />
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description of what this category includes (shown to customers)"
          rows={4}
          {...register("description")}
        />
        <p className="text-xs text-gray-500">
          Optional but recommended for SEO. Maximum 500 characters.
        </p>
      </div>
    </Section>
  );
}
