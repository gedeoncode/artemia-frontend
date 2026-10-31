"use client";

import { useFormContext } from "react-hook-form";
import { Label, Checkbox } from "@/components/ui";

export function PublishingSettings() {
  const { watch, setValue } = useFormContext();

  return (
    <div className="space-y-4">
      <Label>Publishing</Label>

      <div className="space-y-3 rounded-lg border p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium">
              Category Enabled
            </p>
            <p className="text-xs text-gray-500">
              Allow listings to be created in this category
            </p>
          </div>

          <Checkbox
            checked={watch("publishing.enabled")}
            onCheckedChange={(checked) =>
              setValue("publishing.enabled", !!checked, {
                shouldValidate: true,
              })
            }
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium">
              Require Approval
            </p>
            <p className="text-xs text-gray-500">
              Listings must be reviewed before publication
            </p>
          </div>

          <Checkbox
            checked={watch("publishing.requiresApproval")}
            onCheckedChange={(checked) =>
              setValue("publishing.requiresApproval", !!checked, {
                shouldValidate: true,
              })
            }
          />
        </label>
      </div>
    </div>
  );
}