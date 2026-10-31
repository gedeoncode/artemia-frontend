// app/(dashboard)/categories/[id]/components/AdvancedSection.tsx
"use client";

import { useState } from "react";
import {  Code } from "lucide-react";
import { TagsSection } from "./TagsSection";
import { AttributesSection } from "./AttributesSection/AttributesSection";
import { DeveloperMode } from "./DeveloperMode";

interface AdvancedSectionProps {
  control: any;
  errors: any;
}

export function AdvancedSection({ control, errors }: AdvancedSectionProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "dev">("visual");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Advanced Settings</h2>
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "visual" ? "dev" : "visual")}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Code className="w-4 h-4" />
          {activeTab === "visual" ? "Developer Mode" : "Visual Mode"}
        </button>
      </div>

      {activeTab === "visual" ? (
        <div className="space-y-8">
          <TagsSection control={control} errors={errors} />
          <AttributesSection control={control} errors={errors} />
        </div>
      ) : (
        <DeveloperMode control={control} errors={errors} />
      )}
    </div>
  );
}