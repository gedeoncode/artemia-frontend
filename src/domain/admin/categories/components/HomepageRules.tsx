import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/button/Button";
import { ChevronDown, X } from "lucide-react";
import { HomepageRule } from "../services/types";

const RULE_TYPES = [
  "topDeals",
  "bestSellers",
  "newArrivals",
  "trending",
  "mostViewed",
  "highDiscount",
];
export interface HomepageRuleFormProps {
  rules: HomepageRule[]; // the list of rules passed from the parent
  onChange: (updatedRules: HomepageRule[]) => void; // bubbles state updates upward
  disabled?: boolean; // disables inputs when submitting or locked
}

export default function HomepageRuleForm({
  rules = [],
  onChange,
  disabled = false,
}: HomepageRuleFormProps) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const updateRule = (index, field, value) => {
    const updated = rules.map((r, i) =>
      i === index ? { ...r, [field]: value } : r,
    );
    onChange?.(updated);
  };

  const addRule = () => {
    const newIndex = rules.length;
    onChange?.([...rules, { ruleType: "topDeals", limit: 10, link: "" }]);
    setExpandedIndex(newIndex);
  };

  const removeRule = (index) => {
    const updated = rules.filter((_, i) => i !== index);
    onChange?.(updated);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  return (
    <div className="space-y-6">
      {rules.length > 0 && (
        <Card className="p-4">
          <CardContent className="space-y-4">
            {rules.map((rule, index) => {
              const isOpen = expandedIndex === index;

              return (
                <div
                  key={index}
                  className="relative transition-all bg-white animate-in fade-in slide-in-from-bottom-2"
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      Rule {index + 1}
                    </h3>

                    <div className="flex items-center gap-2">
                      {!disabled && (
                        <button
                          onClick={() => removeRule(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X size={18} />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          setExpandedIndex((p) => (p === index ? null : index))
                        }
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <ChevronDown
                          size={20}
                          className={`transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* COLLAPSIBLE CONTENT */}
                  {isOpen && (
                    <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-1">
                      {/* Rule Type */}
                      <div className="space-y-1">
                        <Label>Rule Type</Label>
                        <Select
                          value={rule.ruleType}
                          disabled={disabled}
                          onValueChange={(v) =>
                            updateRule(index, "ruleType", v)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select rule type" />
                          </SelectTrigger>

                          <SelectContent>
                            {RULE_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Determines the algorithm behind what items appear.
                        </p>
                      </div>

                      {/* Limit */}
                      <div className="space-y-1">
                        <Label>Limit</Label>
                        <Input
                          type="number"
                          min={1}
                          value={rule.limit}
                          disabled={disabled}
                          onChange={(e) =>
                            updateRule(index, "limit", Number(e.target.value))
                          }
                        />
                        <p className="text-xs text-gray-500">
                          How many items to fetch for this rule.
                        </p>
                      </div>

                      {/* Link */}
                      <div className="space-y-1">
                        <Label>Link (optional)</Label>
                        <Input
                          type="text"
                          placeholder="https://example.com/category"
                          value={rule.link || ""}
                          disabled={disabled}
                          onChange={(e) =>
                            updateRule(index, "link", e.target.value)
                          }
                        />
                        <p className="text-xs text-gray-500">
                          Optional deep-link to more content.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {!disabled && (
        <Button
          type="button"
          onClick={addRule}
          className="w-full"
          variant="outline"
        >
          Add Rule +
        </Button>
      )}
    </div>
  );
}
