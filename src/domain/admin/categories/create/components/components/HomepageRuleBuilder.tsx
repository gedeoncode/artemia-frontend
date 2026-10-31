"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  Calendar,
  Layout,
  Eye,
  Move,
  Star,
  Clock,
  AlertCircle,
} from "lucide-react";

import {
  Button,
  Input,
  Badge,
  Label,
  Slider,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/components/ui/";

interface HomepageRule {
  id: string;
  type: "featured" | "promoted" | "automatic" | "manual";
  position: number;
  displayStyle: "grid" | "carousel" | "list" | "hero";
  conditionType: "always" | "scheduled" | "based_on";
  schedule?: {
    startDate: string;
    endDate: string;
    timezone: string;
  };
  conditions?: HomepageCondition[];
  settings: {
    title?: string;
    subtitle?: string;
    showProductCount?: boolean;
    maxProducts?: number;
    sortBy?: "newest" | "popular" | "price_asc" | "price_desc" | "manual";
    backgroundColor?: string;
    textColor?: string;
  };
  isActive: boolean;
}

interface HomepageCondition {
  id: string;
  field: string;
  operator: "equals" | "not_equals" | "contains";
  value: string;
}

interface HomepageRuleBuilderProps {
  rules: HomepageRule[];
  onChange: (rules: HomepageRule[]) => void;
  disabled?: boolean;
}

const DISPLAY_STYLES = [
  { value: "grid", label: "Grid View", icon: Layout },
  { value: "carousel", label: "Carousel", icon: Move },
  { value: "list", label: "List View", icon: Layout },
  { value: "hero", label: "Hero Banner", icon: Eye },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "manual", label: "Manual Order" },
];

export function HomepageRuleBuilder({
  rules,
  onChange,
  disabled,
}: HomepageRuleBuilderProps) {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState<string | null>(null);

  const toggleRuleExpand = (ruleId: string) => {
    setExpandedRules((prev) => {
      const next = new Set(prev);
      if (next.has(ruleId)) {
        next.delete(ruleId);
      } else {
        next.add(ruleId);
      }
      return next;
    });
  };

  const addRule = useCallback(() => {
    const newRule: HomepageRule = {
      id: `rule_${Date.now()}_${Math.random()}`,
      type: "automatic",
      position: rules.length + 1,
      displayStyle: "grid",
      conditionType: "always",
      settings: {
        title: "New Category Section",
        showProductCount: true,
        maxProducts: 12,
        sortBy: "newest",
      },
      isActive: true,
    };

    onChange([...rules, newRule]);
  }, [rules, onChange]);

  const removeRule = useCallback(
    (ruleId: string) => {
      onChange(rules.filter((r) => r.id !== ruleId));
    },
    [rules, onChange],
  );

  const updateRule = useCallback(
    (ruleId: string, updates: Partial<HomepageRule>) => {
      onChange(rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)));
    },
    [rules, onChange],
  );

  const moveRule = useCallback(
    (ruleId: string, direction: "up" | "down") => {
      const index = rules.findIndex((r) => r.id === ruleId);
      if (index === -1) return;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= rules.length) return;

      const newRules = [...rules];
      [newRules[index], newRules[newIndex]] = [
        newRules[newIndex],
        newRules[index],
      ];

      // Update positions
      newRules.forEach((rule, idx) => {
        rule.position = idx + 1;
      });

      onChange(newRules);
    },
    [rules, onChange],
  );

  const addCondition = useCallback(
    (ruleId: string) => {
      const newCondition: HomepageCondition = {
        id: `cond_${Date.now()}_${Math.random()}`,
        field: "product_tag",
        operator: "equals",
        value: "",
      };

      onChange(
        rules.map((r) =>
          r.id === ruleId
            ? { ...r, conditions: [...(r.conditions || []), newCondition] }
            : r,
        ),
      );
    },
    [rules, onChange],
  );

  const removeCondition = useCallback(
    (ruleId: string, conditionId: string) => {
      onChange(
        rules.map((r) =>
          r.id === ruleId
            ? {
                ...r,
                conditions: (r.conditions || []).filter(
                  (c) => c.id !== conditionId,
                ),
              }
            : r,
        ),
      );
    },
    [rules, onChange],
  );

  const getRuleTypeLabel = (type: HomepageRule["type"]) => {
    switch (type) {
      case "featured":
        return "Featured Category";
      case "promoted":
        return "Promoted Section";
      case "automatic":
        return "Auto-generated";
      case "manual":
        return "Manual Selection";
    }
  };

  const getRuleTypeIcon = (type: HomepageRule["type"]) => {
    switch (type) {
      case "featured":
        return Star;
      case "promoted":
        return Calendar;
      case "automatic":
        return Clock;
      case "manual":
        return Eye;
    }
  };

  const renderPreview = (rule: HomepageRule) => {
    const Icon = getRuleTypeIcon(rule.type);

    return (
      <div className="relative border rounded-lg overflow-hidden bg-white">
        {/* Preview Header */}
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">
              {rule.settings.title || getRuleTypeLabel(rule.type)}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {rule.displayStyle}
          </Badge>
        </div>

        {/* Preview Content */}
        <div className="p-4">
          {rule.displayStyle === "hero" ? (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
              <h3 className="text-xl font-bold mb-2">
                {rule.settings.title || "Category Spotlight"}
              </h3>
              {rule.settings.subtitle && (
                <p className="text-sm opacity-90">{rule.settings.subtitle}</p>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-4"
              >
                Shop Now →
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <div className="bg-gray-100 h-24 rounded mb-2" />
                  <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Overlay on Hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Badge variant="secondary" className="text-sm">
            Live Preview
          </Badge>
        </div>
      </div>
    );
  };

  const renderRuleCard = (rule: HomepageRule) => {
    const isExpanded = expandedRules.has(rule.id);
    const RuleIcon = getRuleTypeIcon(rule.type);

    return (
      <div
        key={rule.id}
        className="border border-gray-200 rounded-lg bg-white overflow-hidden"
      >
        {/* Rule Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleRuleExpand(rule.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>

            <RuleIcon className="w-4 h-4 text-gray-500" />

            <Badge variant={rule.isActive ? "success" : "secondary"}>
              {rule.isActive ? "Active" : "Inactive"}
            </Badge>

            <Badge variant="outline">Position {rule.position}</Badge>

            <span className="text-sm font-medium">
              {rule.settings.title || getRuleTypeLabel(rule.type)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => moveRule(rule.id, "up")}
              disabled={rule.position === 1 || disabled}
              className="h-8 w-8 p-0"
            >
              ↑
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => moveRule(rule.id, "down")}
              disabled={rule.position === rules.length || disabled}
              className="h-8 w-8 p-0"
            >
              ↓
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeRule(rule.id)}
              disabled={disabled}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Rule Content */}
        {isExpanded && (
          <div className="p-4 space-y-4">
            {/* Basic Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={rule.settings.title || ""}
                  onChange={(e) =>
                    updateRule(rule.id, {
                      settings: { ...rule.settings, title: e.target.value },
                    })
                  }
                  placeholder="e.g., Featured Electronics"
                  disabled={disabled}
                />
              </div>

              <div className="space-y-2">
                <Label>Subtitle (Optional)</Label>
                <Input
                  value={rule.settings.subtitle || ""}
                  onChange={(e) =>
                    updateRule(rule.id, {
                      settings: { ...rule.settings, subtitle: e.target.value },
                    })
                  }
                  placeholder="Brief description"
                  disabled={disabled}
                />
              </div>
            </div>

            {/* Display Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Style</Label>
                <Select
                  value={rule.displayStyle}
                  onValueChange={(val: any) =>
                    updateRule(rule.id, { displayStyle: val })
                  }
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DISPLAY_STYLES.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        <div className="flex items-center gap-2">
                          <style.icon className="w-4 h-4" />
                          {style.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={rule.settings.sortBy || "newest"}
                  onValueChange={(val: any) =>
                    updateRule(rule.id, {
                      settings: { ...rule.settings, sortBy: val },
                    })
                  }
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quantity Settings */}
            <div className="space-y-2">
              <Label>
                Maximum Products to Display: {rule.settings.maxProducts || 12}
              </Label>
              <Slider
                value={[rule.settings.maxProducts || 12]}
                onValueChange={(val) =>
                  updateRule(rule.id, {
                    settings: { ...rule.settings, maxProducts: val[0] },
                  })
                }
                min={4}
                max={48}
                step={4}
                disabled={disabled}
                className="w-full"
              />
            </div>

            {/* Display Options */}
            <div className="flex items-center justify-between">
              <Label>Show Product Count</Label>
              <Switch
                checked={rule.settings.showProductCount}
                onCheckedChange={(checked) =>
                  updateRule(rule.id, {
                    settings: { ...rule.settings, showProductCount: checked },
                  })
                }
                disabled={disabled}
              />
            </div>

            {/* Schedule Settings */}
            <div className="space-y-3">
              <Label>When should this appear?</Label>
              <Select
                value={rule.conditionType}
                onValueChange={(val: any) =>
                  updateRule(rule.id, { conditionType: val })
                }
                disabled={disabled}
              >
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">Always show</SelectItem>
                  <SelectItem value="scheduled">
                    Schedule for specific dates
                  </SelectItem>
                  <SelectItem value="based_on">
                    Show based on conditions
                  </SelectItem>
                </SelectContent>
              </Select>

              {rule.conditionType === "scheduled" && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="datetime-local"
                      value={rule.schedule?.startDate || ""}
                      onChange={(e) =>
                        updateRule(rule.id, {
                          schedule: {
                            ...rule.schedule,
                            startDate: e.target.value,
                            timezone: rule.schedule?.timezone || "UTC",
                          },
                        })
                      }
                      disabled={disabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="datetime-local"
                      value={rule.schedule?.endDate || ""}
                      onChange={(e) =>
                        updateRule(rule.id, {
                          schedule: {
                            ...rule.schedule,
                            endDate: e.target.value,
                            timezone: rule.schedule?.timezone || "UTC",
                          },
                        })
                      }
                      disabled={disabled}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Preview */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <Label>Live Preview</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setPreviewMode(previewMode === rule.id ? null : rule.id)
                  }
                >
                  {previewMode === rule.id ? "Hide Preview" : "Show Preview"}
                </Button>
              </div>
              {previewMode === rule.id && renderPreview(rule)}
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg mt-2">
              <p className="font-medium mb-1">💡 About homepage sections:</p>
              <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                <li>Sections appear in order based on position number</li>
                <li>Use scheduling for seasonal or promotional content</li>
                <li>Hero banners work best for featured categories</li>
                <li>Grid views are optimal for product discovery</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Rules List */}
      <div className="space-y-3">
        {rules.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Layout className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No homepage rules configured</p>
            <p className="text-sm text-gray-400 mb-4">
              Add rules to display this category on your homepage
            </p>
            <Button
              type="button"
              onClick={addRule}
              disabled={disabled}
              leftIcon={<Plus className="w-4 h-4 mr-2" />}
            >
              Add Homepage Section
            </Button>
          </div>
        )}

        {rules.map((rule) => renderRuleCard(rule))}
      </div>

      {/* Add Rule Button */}
      {rules.length > 0 && rules.length < 10 && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addRule}
          disabled={disabled}
          leftIcon={<Plus className="w-4 h-4 mr-2" />}
        >
          Add Another Section
        </Button>
      )}

      {/* Max Rules Warning */}
      {rules.length >= 10 && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-yellow-800">
            <p className="font-medium">Maximum sections reached (10/10)</p>
            <p className="text-yellow-700 mt-0.5">
              Remove existing sections to add more homepage content for this
              category.
            </p>
          </div>
        </div>
      )}

      {/* Quick Templates */}
      {rules.length === 0 && (
        <div className="space-y-2">
          <Label className="text-sm">Quick Templates</Label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                const featuredRule: HomepageRule = {
                  id: `rule_${Date.now()}_${Math.random()}`,
                  type: "featured",
                  position: 1,
                  displayStyle: "hero",
                  conditionType: "always",
                  settings: {
                    title: "Featured Category",
                    subtitle: "Discover our top picks",
                    showProductCount: true,
                    maxProducts: 12,
                    sortBy: "popular",
                  },
                  isActive: true,
                };
                onChange([featuredRule]);
              }}
              className="p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <Star className="w-5 h-5 text-yellow-500 mb-2" />
              <p className="text-sm font-medium">Featured</p>
              <p className="text-xs text-gray-500">Hero banner style</p>
            </button>

            <button
              type="button"
              onClick={() => {
                const gridRule: HomepageRule = {
                  id: `rule_${Date.now()}_${Math.random()}`,
                  type: "automatic",
                  position: 1,
                  displayStyle: "grid",
                  conditionType: "always",
                  settings: {
                    title: "New Arrivals",
                    showProductCount: true,
                    maxProducts: 12,
                    sortBy: "newest",
                  },
                  isActive: true,
                };
                onChange([gridRule]);
              }}
              className="p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <Layout className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-sm font-medium">Product Grid</p>
              <p className="text-xs text-gray-500">Standard grid layout</p>
            </button>

            <button
              type="button"
              onClick={() => {
                const carouselRule: HomepageRule = {
                  id: `rule_${Date.now()}_${Math.random()}`,
                  type: "promoted",
                  position: 1,
                  displayStyle: "carousel",
                  conditionType: "always",
                  settings: {
                    title: "Trending Now",
                    showProductCount: false,
                    maxProducts: 8,
                    sortBy: "popular",
                  },
                  isActive: true,
                };
                onChange([carouselRule]);
              }}
              className="p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <Move className="w-5 h-5 text-purple-500 mb-2" />
              <p className="text-sm font-medium">Carousel</p>
              <p className="text-xs text-gray-500">Horizontal scroll</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
