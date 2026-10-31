"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Globe,
} from "lucide-react";
import { Input, Label } from "@/components/ui/";
import { cn } from "@/lib/utils";
import { useSlugValidation } from "../../hooks/useSlugValidation";

interface SlugInputProps {
  name?: string;
  label?: string;
  placeholder?: string;
  autoGenerateFromName?: boolean;
  excludeId?: string;
  onAvailabilityChange?: (isAvailable: boolean) => void;
}

export function SlugInput({
  name = "slug",
  label = "URL Slug",
  placeholder = "e.g., electronics, clothing",
  autoGenerateFromName = true,
  excludeId,
  onAvailabilityChange,
}: SlugInputProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const currentSlug = watch(name);
  const currentName = watch("name");

  const { status, getStatusMessage, getStatusColor } = useSlugValidation({
    slug: currentSlug,
    excludeId,
    onAvailabilityChange,
  });

  // Auto-generate slug from name
  const generateSlugFromName = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }, []);

  useEffect(() => {
    // Auto-generate when name changes and slug hasn't been manually edited
    if (autoGenerateFromName && currentName && !slugManuallyEdited) {
      const generatedSlug = generateSlugFromName(currentName);
      if (generatedSlug !== currentSlug) {
        setValue(name, generatedSlug, { shouldValidate: true });
      }
    }
  }, [
    currentName,
    autoGenerateFromName,
    slugManuallyEdited,
    generateSlugFromName,
    setValue,
    name,
    currentSlug,
  ]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value;
    setSlugManuallyEdited(true);
    setValue(name, newSlug, { shouldValidate: true });
  };

  const error = errors[name];
  const isInvalid = error || status === "taken" || status === "invalid";

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Globe className="w-4 h-4 text-gray-400" />
        </div>

        <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
          <span className="text-gray-400 text-sm">/category/</span>
        </div>

        <Input
          id={name}
          className={cn(
            "pl-32 pr-10",
            isInvalid && "border-red-500 focus-visible:ring-red-500",
            status === "available" &&
              "border-green-500 focus-visible:ring-green-500",
          )}
          placeholder={placeholder}
          {...register(name)}
          onChange={handleSlugChange}
          // aria-invalid={isInvalid}
          aria-describedby={isInvalid ? `${name}-error` : undefined}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {status === "checking" && (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          )}
          {status === "available" && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          {status === "taken" && <XCircle className="w-4 h-4 text-red-500" />}
          {status === "invalid" && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>

      {/* Status message */}
      {currentSlug && status !== "idle" && (
        <p className={cn("text-xs mt-1", getStatusColor())}>
          {getStatusMessage()}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mt-1" id={`${name}-error`}>
          {error.message as string}
        </p>
      )}

      <p className="text-xs text-gray-500 mt-1">
        URL-friendly version of the category name. Used for SEO and navigation.
        {autoGenerateFromName && !slugManuallyEdited && (
          <span className="block mt-0.5 text-gray-400">
            Auto-generated from category name
          </span>
        )}
      </p>
    </div>
  );
}
