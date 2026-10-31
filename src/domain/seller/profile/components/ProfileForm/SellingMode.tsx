"use client";

import { useState } from "react";
import { SectionHeader } from "../../../../add-product/components/ui/SectionHeader";
import { FormActions } from "../FormActions";
import type {
  SellerProfile,
  ProfileUpdateParams,
} from "../../../types/profileTypes";

import { SELLING_MODES } from "@/core/constants/commissionModes";

type SellingModeProps = {
  profile: SellerProfile;
  onSubmit: (updates: ProfileUpdateParams) => void;
  loading?: boolean;
};

export const SellingMode = ({
  profile,
  onSubmit,
  loading,
}: SellingModeProps) => {
  const [selectedMode, setSelectedMode] = useState<"PAP" | "PAL">(
    profile.commissionModel || "PAL",
  );
  console.log("Selected mode:", selectedMode);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ commissionModel: selectedMode });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Mode de vente"
        description="Choisissez votre modèle de commission préféré pour vos ventes."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset
          className="mb-8 space-y-4"
          role="radiogroup"
          aria-label="Sélectionner le mode de vente"
        >
          {SELLING_MODES.map((option) => {
            const Icon = option.icon;
            const selected = selectedMode === option.value;

            return (
              <label
                key={option.value}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200
                  ${
                    selected
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }
                  ${loading ? "opacity-70 pointer-events-none" : ""}
                `}
              >
                <input
                  type="radio"
                  name="commissionModel"
                  value={option.value}
                  checked={selected}
                  onChange={() => setSelectedMode(option.value)}
                  disabled={loading}
                  className="sr-only"
                />

                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <Icon className="w-6 h-6 text-blue-600" />
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {option.title}
                    </span>
                  </div>
                  <p className="ml-8 text-sm text-gray-600">
                    {option.description}
                  </p>
                  <p className="mt-1 ml-8 text-sm font-medium text-green-700">
                    {option.recommended}
                  </p>
                </div>

                {selected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0 w-5 h-5 ml-2 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </label>
            );
          })}
        </fieldset>

        <FormActions loading={loading} />
      </form>
    </div>
  );
};
