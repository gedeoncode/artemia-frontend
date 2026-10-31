"use client";

import { useFormContext } from "react-hook-form";
import { Label, Input } from "@/components/ui";

export function ListingRequirementsSettings() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <Label>Listing Requirements</Label>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-xs">
            Minimum Images
          </Label>

          <Input
            type="number"
            min={0}
            {...register(
              "listingRequirements.minImages",
              {
                valueAsNumber: true,
              }
            )}
          />
        </div>

        <div>
          <Label className="mb-2 block text-xs">
            Maximum Images
          </Label>

          <Input
            type="number"
            min={1}
            {...register(
              "listingRequirements.maxImages",
              {
                valueAsNumber: true,
              }
            )}
          />
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Define the image requirements for listings in
        this category.
      </p>
    </div>
  );
}