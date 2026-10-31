// app/(dashboard)/categories/create/components/sections/DeveloperMode.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Download, Upload, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/";
import { Textarea } from "@/components/ui/";
import { Alert, AlertDescription } from "@/components/ui/";

interface DeveloperModeProps {
  control: any;
  errors: any;
}

export function DeveloperMode({ control }: DeveloperModeProps) {
  const { getValues, setValue } = useFormContext();
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleExport = () => {
    const values = getValues();
    const exportData = {
      tags: values.tags,
      attributes: values.attributes,
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    setJsonInput(jsonString);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      // Basic validation
      if (!parsed.tags || !Array.isArray(parsed.tags)) {
        throw new Error("Invalid tags format");
      }
      if (!parsed.attributes || !Array.isArray(parsed.attributes)) {
        throw new Error("Invalid attributes format");
      }

      setValue("tags", parsed.tags);
      setValue("attributes", parsed.attributes);
      setJsonError(null);

      // Show success toast or notification here
    } catch (error) {
      setJsonError(
        error instanceof Error ? error.message : "Invalid JSON format",
      );
    }
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setValue("tags", parsed.tags);
      setValue("attributes", parsed.attributes);
      setJsonError(null);
    } catch (error) {
      setJsonError(
        error instanceof Error ? error.message : "Invalid JSON format",
      );
    }
  };

  return (
    <div className="space-y-6">
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Developer Mode is intended for bulk operations, migrations, and
          debugging. Direct JSON editing may break form validation. Use with
          caution.
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={handleExport}
          variant="outline"
          leftIcon={<Download className="w-4 h-4 " />}
        >
          Export to JSON
        </Button>
        <Button
          type="button"
          onClick={handleImport}
          variant="outline"
          leftIcon={<Upload className="w-4 h-4" />}
        >
          Import from JSON
        </Button>
      </div>

      {jsonError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{jsonError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">JSON Editor</label>
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste or edit JSON here..."
          className="font-mono text-sm min-h-[400px]"
        />
        <Button type="button" onClick={handleApplyJson}>
          Apply Changes
        </Button>
      </div>
    </div>
  );
}
