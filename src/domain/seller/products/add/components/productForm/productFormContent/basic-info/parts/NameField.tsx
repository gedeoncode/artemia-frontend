"use client";

import { useMemo, useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { CharacterCounter } from "../ui/CharacterCounter";
import { cn } from "@/lib/utils/";
import {
  FieldError,
  FieldValues,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { FormFieldFeedback } from "@/components/error/FormFieldFeedback";

interface NameFieldProps {
  register: UseFormRegister<FieldValues>;
  nameValue: string;
  nameRules: {
    required: boolean;
    minLength: { value: number; message: string };
    maxLength: { value: number; message: string };
    validate: (v: string) => boolean | string;
  };
  touched?: boolean;
  errors: FieldErrors;
  disabled?: boolean;
  maxNameLength: number;
  lang?: "fr" | "en";
}

export const NameField = ({
  register,
  nameValue,
  nameRules,
  touched,
  errors,
  disabled,
  maxNameLength,
  lang: langProp = "fr",
}: NameFieldProps) => {
  const [lang, setLang] = useState<"fr" | "en">(langProp);
  const length = nameValue?.length || 0;
  const fieldError = errors?.name as FieldError | undefined;
  const hasError = touched && !!fieldError;

  // Auto-detect language (fallback to prop)
  useEffect(() => {
    if (!langProp && typeof window !== "undefined") {
      const userLang = navigator.language.toLowerCase();
      setLang(userLang.startsWith("fr") ? "fr" : "en");
    }
  }, [langProp]);

  // Localized text + dynamic SEO tips
  const t = useMemo(
    () => ({
      fr: {
        label: "Nom du produit ",
        placeholder: "Ex: T-shirt en coton bio pour femme",
        hintGood: "💡 Ex: “T-shirt en coton bio pour femme — doux et durable”",
        hintShort:
          "Essayez un nom plus descriptif pour attirer plus d’acheteurs.",
        seoTip:
          length > 0 && length < 30
            ? "Astuce SEO : ajoutez une caractéristique (matière, couleur, public cible)."
            : null,
      },
      en: {
        label: "Product Name *",
        placeholder: "e.g. Organic cotton T-shirt for women",
        hintGood:
          "💡 e.g. “Organic cotton T-shirt for women — soft and durable”",
        hintShort: "Try a more descriptive name to attract more buyers.",
        seoTip:
          length > 0 && length < 30
            ? "SEO tip: Add an attribute like material, color, or audience."
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
        <Label htmlFor="name">{text.label} <span className="text-red-500">*</span></Label>
        <CharacterCounter current={length} max={maxNameLength} />
      </div>

      {/* Input */}
      <Input
        {...register("name", nameRules)}
        placeholder={text.placeholder}
        disabled={disabled}
        className={cn(hasError && "border-red-300 focus:ring-red-400")}
      />

      {/* Messages */}
      {hasError ? (
        <FormFieldFeedback message={fieldError?.message || ""} />
      ) : touched && length < 5 ? (
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
