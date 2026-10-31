"use client";

import { useFormContext } from "react-hook-form";
import { Zap } from "lucide-react";
import { Label, Checkbox } from "@/components/ui/";
import { Section } from "../components/Section";
import { ModeRulesBuilder } from "../components/ModeRulesBuilder";
import { HomepageRuleBuilder } from "../components/HomepageRuleBuilder";
import { PublishingSettings } from "./PublishingSettings";
import { ListingRequirementsSettings } from "./ListingRequirementsSettings";

export function RulesAndAutomationSection() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const allowedModes = watch("allowedModes") || [];
  const modeRules = watch("modeRules") || {};
  const homepageRules = watch("homepageRules") || [];

  const handleModeToggle = (mode: "PAL" | "PAP") => {
    const updated = allowedModes.includes(mode)
      ? allowedModes.filter((m: string) => m !== mode)
      : [...allowedModes, mode];
    setValue("allowedModes", updated, { shouldValidate: true });
  };

  return (
    <Section
      title="Rules & Automation"
      description="Set business rules and automatic behaviors"
      icon={<Zap className="w-4 h-4" />}
      collapsible={true}
      defaultExpanded={false}
      validationErrors={
        errors.allowedModes ? [errors.allowedModes.message as string] : []
      }
    >
      {/* Allowed Modes */}
      <div className="space-y-3">
        <Label>Selling Modes</Label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={allowedModes.includes("PAL")}
              onCheckedChange={() => handleModeToggle("PAL")}
            />
            <span className="text-sm">PAL (Products as Listed)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={allowedModes.includes("PAP")}
              onCheckedChange={() => handleModeToggle("PAP")}
            />
            <span className="text-sm">PAP (Products as Purchase)</span>
          </label>
        </div>
        <p className="text-xs text-gray-500">
          Select which selling modes are available for products in this category
        </p>
      </div>
      <PublishingSettings />

      <ListingRequirementsSettings />
      {/* Mode Rules Builder */}
      {allowedModes.length > 0 && (
        <div className="space-y-2">
          <Label>Mode Rules</Label>
          <ModeRulesBuilder
            modes={allowedModes}
            value={modeRules}
            onChange={(rules) => setValue("modeRules", rules)}
          />
        </div>
      )}

      {/* Homepage Rules Builder */}
      <div className="space-y-2">
        <Label>Homepage Rules</Label>
        <HomepageRuleBuilder
          rules={homepageRules}
          onChange={(rules) => setValue("homepageRules", rules)}
        />
        <p className="text-xs text-gray-500">
          Configure how this category appears on your homepage
        </p>
      </div>
    </Section>
  );
}
