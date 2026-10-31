"use client";

import { useMemo, useEffect, useState } from "react";
import { Label } from "@/components/ui/Label";
import { AlertMessage } from "@/components/error/AlertMessage";
import { CharacterCounter } from "../ui/CharacterCounter";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils/";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { FormFieldFeedback } from "@/components/error/FormFieldFeedback";

interface DescriptionFieldProps {
  register: UseFormRegister<FieldValues>;
  description: string;
  touched: boolean;
  errors: FieldErrors;
  disabled?: boolean;
  maxDescriptionLength: number;
  lang?: "fr" | "en";
}

export const DescriptionField = ({
  register,
  description,
  touched,
  errors,
  disabled,
  maxDescriptionLength,
  lang: langProp = "fr",
}: DescriptionFieldProps) => {
  const [lang, setLang] = useState<"fr" | "en">(langProp);
  const length = description?.length || 0;
  const fieldError = errors?.description as FieldError | undefined;
  const hasError = touched && !!fieldError;

  // Auto-detect language if not set
  useEffect(() => {
    if (!langProp && typeof window !== "undefined") {
      const userLang = navigator.language.toLowerCase();
      setLang(userLang.startsWith("fr") ? "fr" : "en");
    }
  }, [langProp]);

  // Localized text with SEO suggestions
  const t = useMemo(
    () => ({
      fr: {
        label: "Description du produit ",
        placeholder:
          "Décrivez le produit, ses caractéristiques, ses avantages, et ses utilisations.",
        hintGood:
          "💡 Ajoutez des détails précis (matière, taille, usage, garantie...) pour rassurer l’acheteur.",
        hintShort:
          "Essayez d’ajouter plus de détails pour mieux décrire votre produit.",
        seoTip:
          length > 0 && length < 100
            ? "Astuce SEO : incluez des mots-clés que vos clients recherchent (ex: écologique, artisanal, durable)."
            : null,
      },
      en: {
        label: "Product Description *",
        placeholder: "Describe the product, its features, benefits, and uses.",
        hintGood:
          "💡 Add precise details (material, size, use, warranty...) to build buyer confidence.",
        hintShort: "Try adding more details to better describe your product.",
        seoTip:
          length > 0 && length < 100
            ? "SEO tip: Include keywords buyers search for (e.g. eco-friendly, handmade, durable)."
            : null,
      },
    }),
    [length]
  );

  const text = t[lang];

  return (
    <div className="space-y-2">
      {/* Label + Counter */}
      <div className="flex justify-between text-sm font-medium">
        <Label htmlFor="description">
          {text.label} <span className="text-red-500">*</span>
        </Label>
        <CharacterCounter current={length} max={maxDescriptionLength} />
      </div>

      {/* Textarea */}
      <Textarea
        {...register("description", {
          required: true,
          minLength: { value: 10, message: "Description trop courte" },
          maxLength: {
            value: maxDescriptionLength,
            message: "Description trop longue",
          },
          validate: (v: string) => !!v.trim() || "Description vide",
        })}
        placeholder={text.placeholder}
        disabled={disabled}
        className={cn(
          "min-h-[120px]",
          hasError && "border-red-300 focus:ring-red-400"
        )}
      />

      {/* Messages */}
      {hasError ? (
        <FormFieldFeedback  message={fieldError?.message || ""} />
      ) : touched && length < 20 ? (
        <p className="text-sm text-yellow-600">{text.hintShort}</p>
      ) : (
        <>
          <p className="text-sm text-gray-500">{text.hintGood}</p>
          {text.seoTip && (
            <p className="mt-1 text-xs text-gray-400">{text.seoTip}</p>
          )}
        </>
      )}
    </div>
  );
};
