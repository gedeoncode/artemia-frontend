"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { SectionHeader } from "../../../../add-product/components/ui/SectionHeader";
import { FormActions } from "../FormActions";
import { cn } from "@/lib/utils/";
import type {
  SellerProfile,
  ProfileUpdateParams,
} from "../../../types/profileTypes";
import { AlertMessage } from "@/components/error/AlertMessage";

type BusinessInfoProps = {
  profile: SellerProfile;
  onSubmit: (updates: ProfileUpdateParams) => void;
  loading?: boolean;
};

export function BusinessInfo({
  profile,
  onSubmit,
  loading,
}: BusinessInfoProps) {
  const [formData, setFormData] = useState({
    businessName: profile.businessName || "",
    businessAddress: profile.businessAddress || "",
    country: profile.country || "",
    preferredCurrency: profile.preferredCurrency || "USD",
    type: "company" as "company" | "individual",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const validate = (field: string, value: string) => {
    switch (field) {
      case "businessName":
        return value.trim().length < 2
          ? "Business name must be at least 2 characters"
          : "";
      case "businessAddress":
        return value.trim().length < 5 ? "Address seems too short" : "";
      case "country":
        return value.trim().length < 2 ? "Enter a valid country" : "";
      default:
        return "";
    }
  };

  const FormField = ({
    name,
    label,
    type = "text",
    disabled = false,
  }: {
    name: keyof typeof formData;
    label: string;
    type?: string;
    disabled?: boolean;
  }) => {
    const error = touched[name] ? validate(name, formData[name]) : "";
    const hasError = !!error;

    return (
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          name={name}
          type={type}
          disabled={disabled}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            hasError && "border-destructive focus-visible:ring-destructive",
          )}
        />
        {hasError && <AlertMessage message={error} variant="error" />}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <SectionHeader
        title="Business Information"
        description="Update your business details below."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField name="businessName" label="Business Name" />
        <FormField name="businessAddress" label="Business Address" />
        <FormField name="country" label="Country" />
        <FormField
          name="preferredCurrency"
          label="Preferred Currency"
          maxLength={3}
        />
        <FormField name="type" label="Account Type" disabled />
      </div>

      <div className="pt-4">
        <FormActions loading={loading} />
      </div>
    </form>
  );
}
