import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { SectionHeader } from "../../../../add-product/components/ui/SectionHeader";
import { FormActions } from "../FormActions";
import type {
  SellerProfile,
  ProfileUpdateParams,
} from "../../../types/profileTypes";
import { cn } from "@/lib/utils/";
import { AlertMessage } from "@/components/error/AlertMessage";

type PersonalInfoProps = {
  profile: SellerProfile;
  onSubmit: (updates: ProfileUpdateParams) => void;
  loading?: boolean;
};

export function PersonalInfo({
  profile,
  onSubmit,
  loading,
}: PersonalInfoProps) {
  const [formData, setFormData] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    dob: profile.dob || "",
    country: profile.country || "",
    preferredCurrency: profile.preferredCurrency || "USD",
    type: "individual" as "company" | "individual",
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
      case "firstName":
      case "lastName":
        return value.trim().length < 2 ? "Must be at least 2 characters" : "";
      case "phone":
        return !/^[\d\s+()-]+$/.test(value) ? "Invalid phone number" : "";
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
          value={formData[name]}
          disabled={disabled}
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
        title="Personal Details"
        description="Update your personal details below."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField name="firstName" label="First Name" />
        <FormField name="lastName" label="Last Name" />
        <FormField name="email" label="Email" type="email" disabled />
        <FormField name="phone" label="Phone" type="tel" />
        <FormField name="dob" label="Date of Birth" type="date" />
        <FormField name="country" label="Country" />
        <FormField name="preferredCurrency" label="Preferred Currency" />
        <FormField name="type" label="Account Type" disabled />
      </div>

      <div className="pt-4">
        <FormActions loading={loading} />
      </div>
    </form>
  );
}
