"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { CheckCircle, XCircle, AlertCircle, Loader2, Hash } from "lucide-react";

import { Input, Label } from "@/components/ui/";
import { cn } from "@/lib/utils";
import { useCodeValidation } from "../../hooks/useCodeValidation";

interface CodeInputProps {
  name?: string;
  label?: string;
  placeholder?: string;
  autoGenerateFromName?: boolean;
  excludeId?: string;
  onAvailabilityChange?: (isAvailable: boolean) => void;
}

export function CodeInput({
  name = "code",
  label = "Category Code",
  placeholder = "e.g., ELECTRONICS",
  autoGenerateFromName = true,
  excludeId,
  onAvailabilityChange,
}: CodeInputProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false);

  const currentCode = watch(name);
  const currentName = watch("name");

  const { status, getStatusMessage, getStatusColor } = useCodeValidation({
    code: currentCode,
    excludeId,
    onAvailabilityChange,
  });

  // Auto-generate code from category name
  const generateCodeFromName = useCallback((name: string) => {
    return name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .substring(0, 20);
  }, []);

  useEffect(() => {
    if (autoGenerateFromName && currentName && !codeManuallyEdited) {
      const generatedCode = generateCodeFromName(currentName);

      if (generatedCode !== currentCode) {
        setValue(name, generatedCode, {
          shouldValidate: true,
        });
      }
    }
  }, [
    currentName,
    currentCode,
    autoGenerateFromName,
    codeManuallyEdited,
    generateCodeFromName,
    setValue,
    name,
  ]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalizedCode = e.target.value.toUpperCase().replace(/\s+/g, "_");

    setCodeManuallyEdited(true);

    setValue(name, normalizedCode, {
      shouldValidate: true,
    });
  };

  const error = errors[name];

  const isInvalid = error || status === "taken" || status === "invalid";

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Hash className="w-4 h-4 text-gray-400" />
        </div>

        <Input
          id={name}
          className={cn(
            "pl-10 pr-10",
            isInvalid && "border-red-500 focus-visible:ring-red-500",
            status === "available" &&
              "border-green-500 focus-visible:ring-green-500",
          )}
          placeholder={placeholder}
          {...register(name)}
          onChange={handleCodeChange}
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
      {currentCode && status !== "idle" && (
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
        Stable internal category identifier used for integrations, reporting,
        and business logic.
        {autoGenerateFromName && !codeManuallyEdited && (
          <span className="block mt-0.5 text-gray-400">
            Auto-generated from category name
          </span>
        )}
      </p>
    </div>
  );
}
