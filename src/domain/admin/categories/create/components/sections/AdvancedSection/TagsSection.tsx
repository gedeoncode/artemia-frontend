// app/(dashboard)/categories/[id]/components/TagsSection.tsx
"use client";

import { useState, KeyboardEvent } from "react";
import { useFieldArray } from "react-hook-form";
import { X, Plus, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/";
import { Button } from "@/components/ui/";
import { Badge } from "@/components/ui/";
import { Label } from "@/components/ui/";
import { cn } from "@/lib/utils";

interface TagsSectionProps {
  control: any;
  errors: any;
}

export function TagsSection({ control, errors }: TagsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("Tag cannot be empty");
      return;
    }

    const exists = fields.some((field: any) => field.value === trimmed);
    if (exists) {
      setError("Tag already exists");
      return;
    }

    append({ value: trimmed });
    setInputValue("");
    setError(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Tags</Label>
        <p className="text-sm text-gray-500 mt-1">
          Add tags to help organize and categorize this category
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type tag and press Enter..."
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500",
              )}
            />
            {error && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={addTag}
            variant="outline"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Tag
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {fields.map((field: any, index: number) => (
            <Badge
              key={field.id}
              variant="secondary"
              className="px-3 py-1.5 text-sm gap-2"
            >
              {field.value}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="hover:text-red-500 transition-colors"
                aria-label={`Remove tag ${field.value}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {fields.length === 0 && (
            <p className="text-sm text-gray-400 italic">No tags added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
