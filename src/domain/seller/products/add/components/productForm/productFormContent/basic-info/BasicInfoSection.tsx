"use client";
import { Badge } from "@/components/ui/Badge";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ValidationState } from "../../../ui/ValidationState";
import {
  NameField,
  DescriptionField,
  CategorySpecificSection,
  // PhysicalToggle,
} from "./parts";
import { cn } from "@/lib/utils/";
import { Category } from "@/types";
import { FormSectionCard } from "../ui/FormSectionCard";

export function BasicInfoSection({
  categories,
  isEdit = false,
  onCategoryChange,
  maxNameLength = 100,
  maxDescriptionLength = 500,
  validationRules,
  className,
}: {
  categories: Category[];
  isEdit?: boolean;
  isLoading?: boolean;
  onCategoryChange?: (id: string | null) => void;
  maxNameLength?: number;
  maxDescriptionLength?: number;
  validationRules?: any;
  className: string;
  stepIndex?: number;
  registerStepValidity: (step: number, isValid: boolean) => void;
}) {
  const {
    register,
    // setValue,
    control,
    trigger,
    formState: { errors, touchedFields, isSubmitting },
  } = useFormContext();
  const [name, category, description] = useWatch({
    control,
    name: ["name", "category", "shortDescription"],
  });
  const [valid, setValid] = useState({
    name: false,
    category: false,
    description: false,
  });

  const selectedCategory = useMemo(
    () => categories.find((c) => c._id === category) || null,
    [categories, category],
  );
  useEffect(
    () => void onCategoryChange?.(category || null),
    [category, onCategoryChange],
  );

  const validateStep = useCallback(async () => {
    const okName = await trigger("name");
    const okDesc = await trigger("description");

    const okCat = Boolean(category?.trim());
    setValid({ name: okName, description: okDesc, category: okCat });
  }, [category, trigger]);

  useEffect(
    () => void validateStep(),
    [name, description, category, validateStep],
  );

  const nameRules = {
    required: validationRules?.name?.required ?? true,
    minLength: { value: 2, message: "Nom trop court" },
    maxLength: { value: maxNameLength, message: "Nom trop long" },
    validate: (v: string) => !!v.trim() || "Nom vide",
  };
  const isValid = valid.name && valid.category && valid.category;

  return (

<section className={cn(className)}>
  <div className="space-y-6">

    <FormSectionCard
      title={
        <div className="flex items-center gap-2">
          Informations de base

          <Badge variant={isEdit ? "secondary" : "primary"}>
            {isEdit ? "Édition" : "Nouveau"}
          </Badge>
        </div>
      }
      description={
        isEdit
          ? "Renseignez ou mettez à jour les informations principales du produit."
          : "Renseignez les informations principales du produit. Les champs * sont obligatoires."
      }
      actions={
        isValid ? (
          <ValidationState
            valid={isValid}
            label="All required fields completed"
          />
        ) : null
      }
    >
      <NameField
        register={register}
        nameValue={name}
        nameRules={nameRules}
        touched={touchedFields.name}
        errors={errors}
        disabled={isSubmitting}
        maxNameLength={80}
        lang="fr"
      />

      <DescriptionField
        register={register}
        description={description}
        touched={touchedFields.description}
        errors={errors}
        maxDescriptionLength={maxDescriptionLength}
        disabled={isSubmitting}
      />

      <CategorySpecificSection
        categories={categories}
        touched={touchedFields.category}
        isEdit={isEdit}
        control={control}
        selectedCategory={selectedCategory}
      />
    </FormSectionCard>

  </div>
</section>  );
}
