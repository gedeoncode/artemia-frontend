"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Plus,
  Trash2,
  Settings,
  ChevronDown,
  ChevronUp,
  Copy,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Input,
  Badge,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/components/ui/";

import { cn } from "@/lib/utils";

interface ModeRule {
  id: string;
  mode: "PAL" | "PAP";
  conditionType: "always" | "based_on" | "restricted";
  conditions?: RuleCondition[];
  restrictions?: RuleRestriction[];
  priority: number;
  isActive: boolean;
}

interface RuleCondition {
  id: string;
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "greater_than"
    | "less_than"
    | "contains"
    | "in";
  value: any;
}

interface RuleRestriction {
  id: string;
  type: "min_quantity" | "max_quantity" | "requires_approval" | "limited_time";
  value: any;
}

interface ModeRulesBuilderProps {
  modes: Array<"PAL" | "PAP">;
  value: Record<string, any>;
  onChange: (rules: Record<string, any>) => void;
  disabled?: boolean;
}

const CONDITION_FIELDS = [
  { value: "price", label: "Price" },
  { value: "quantity", label: "Quantity" },
  { value: "customer_group", label: "Customer Group" },
  { value: "date_range", label: "Date Range" },
  { value: "inventory_status", label: "Inventory Status" },
  { value: "product_tag", label: "Product Tag" },
];

const OPERATORS = {
  price: [
    { value: "equals", label: "Equals" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
    { value: "between", label: "Between" },
  ],
  quantity: [
    { value: "equals", label: "Equals" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
  ],
  customer_group: [
    { value: "in", label: "In group" },
    { value: "not_in", label: "Not in group" },
  ],
  default: [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not equals" },
    { value: "contains", label: "Contains" },
  ],
};

export function ModeRulesBuilder({
  modes,
  value,
  onChange,
  disabled,
}: ModeRulesBuilderProps) {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"PAL" | "PAP">(modes[0] || "PAL");

  // Parse existing rules or initialize
  const rules = useMemo(() => value?.rules || [], [value.rules]);

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

  const addRule = useCallback(
    (mode: "PAL" | "PAP") => {
      const newRule: ModeRule = {
        id: `rule_${Date.now()}_${Math.random()}`,
        mode,
        conditionType: "always",
        conditions: [],
        restrictions: [],
        priority: rules.filter((r: ModeRule) => r.mode === mode).length + 1,
        isActive: true,
      };

      onChange({
        ...value,
        rules: [...rules, newRule],
      });
    },
    [rules, value, onChange],
  );

  const removeRule = useCallback(
    (ruleId: string) => {
      onChange({
        ...value,
        rules: rules.filter((r: ModeRule) => r.id !== ruleId),
      });
    },
    [rules, value, onChange],
  );

  const updateRule = useCallback(
    (ruleId: string, updates: Partial<ModeRule>) => {
      onChange({
        ...value,
        rules: rules.map((r: ModeRule) =>
          r.id === ruleId ? { ...r, ...updates } : r,
        ),
      });
    },
    [rules, value, onChange],
  );

  const addCondition = useCallback(
    (ruleId: string) => {
      const newCondition: RuleCondition = {
        id: `cond_${Date.now()}_${Math.random()}`,
        field: "price",
        operator: "equals",
        value: "",
      };

      onChange({
        ...value,
        rules: rules.map((r: ModeRule) =>
          r.id === ruleId
            ? { ...r, conditions: [...(r.conditions || []), newCondition] }
            : r,
        ),
      });
    },
    [rules, value, onChange],
  );

  const removeCondition = useCallback(
    (ruleId: string, conditionId: string) => {
      onChange({
        ...value,
        rules: rules.map((r: ModeRule) =>
          r.id === ruleId
            ? {
                ...r,
                conditions: (r.conditions || []).filter(
                  (c) => c.id !== conditionId,
                ),
              }
            : r,
        ),
      });
    },
    [rules, value, onChange],
  );

  const updateCondition = useCallback(
    (ruleId: string, conditionId: string, updates: Partial<RuleCondition>) => {
      onChange({
        ...value,
        rules: rules.map((r: ModeRule) =>
          r.id === ruleId
            ? {
                ...r,
                conditions: (r.conditions || []).map((c) =>
                  c.id === conditionId ? { ...c, ...updates } : c,
                ),
              }
            : r,
        ),
      });
    },
    [rules, value, onChange],
  );

  const addRestriction = useCallback(
    (ruleId: string) => {
      const newRestriction: RuleRestriction = {
        id: `restrict_${Date.now()}_${Math.random()}`,
        type: "min_quantity",
        value: 1,
      };

      onChange({
        ...value,
        rules: rules.map((r: ModeRule) =>
          r.id === ruleId
            ? {
                ...r,
                restrictions: [...(r.restrictions || []), newRestriction],
              }
            : r,
        ),
      });
    },
    [rules, value, onChange],
  );

  const removeRestriction = useCallback(
    (ruleId: string, restrictionId: string) => {
      onChange({
        ...value,
        rules: rules.map((r: ModeRule) =>
          r.id === ruleId
            ? {
                ...r,
                restrictions: (r.restrictions || []).filter(
                  (r) => r.id !== restrictionId,
                ),
              }
            : r,
        ),
      });
    },
    [rules, value, onChange],
  );

  const updateRestriction = useCallback(
    (
      ruleId: string,
      restrictionId: string,
      updates: Partial<RuleRestriction>,
    ) => {
      onChange({
        ...value,
        rules: rules.map((r: ModeRule) =>
          r.id === ruleId
            ? {
                ...r,
                restrictions: (r.restrictions || []).map((rest) =>
                  rest.id === restrictionId ? { ...rest, ...updates } : rest,
                ),
              }
            : r,
        ),
      });
    },
    [rules, value, onChange],
  );

  const duplicateRule = useCallback(
    (rule: ModeRule) => {
      const duplicatedRule: ModeRule = {
        ...rule,
        id: `rule_${Date.now()}_${Math.random()}`,
        priority:
          rules.filter((r: ModeRule) => r.mode === rule.mode).length + 1,
      };

      onChange({
        ...value,
        rules: [...rules, duplicatedRule],
      });
    },
    [rules, value, onChange],
  );

  const getConditionInput = (condition: RuleCondition, ruleId: string) => {
    const operators =
      OPERATORS[condition.field as keyof typeof OPERATORS] || OPERATORS.default;

    switch (condition.field) {
      case "price":
        return (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount"
              value={condition.value}
              onChange={(e) =>
                updateCondition(ruleId, condition.id, {
                  value: parseFloat(e.target.value),
                })
              }
              className="w-32"
              disabled={disabled}
            />
            {condition.operator === "between" && (
              <>
                <span className="text-gray-500">and</span>
                <Input
                  type="number"
                  placeholder="Max amount"
                  className="w-32"
                  disabled={disabled}
                />
              </>
            )}
          </div>
        );

      case "customer_group":
        return (
          <Select
            value={condition.value}
            onValueChange={(val) =>
              updateCondition(ruleId, condition.id, { value: val })
            }
            disabled={disabled}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wholesale">Wholesale</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="new">New Customers</SelectItem>
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            placeholder="Value"
            value={condition.value}
            onChange={(e) =>
              updateCondition(ruleId, condition.id, { value: e.target.value })
            }
            className="w-48"
            disabled={disabled}
          />
        );
    }
  };

  const getRestrictionInput = (
    restriction: RuleRestriction,
    ruleId: string,
  ) => {
    switch (restriction.type) {
      case "min_quantity":
        return (
          <Input
            type="number"
            placeholder="Minimum quantity"
            value={restriction.value}
            onChange={(e) =>
              updateRestriction(ruleId, restriction.id, {
                value: parseInt(e.target.value),
              })
            }
            className="w-32"
            min={1}
            disabled={disabled}
          />
        );

      case "max_quantity":
        return (
          <Input
            type="number"
            placeholder="Maximum quantity"
            value={restriction.value}
            onChange={(e) =>
              updateRestriction(ruleId, restriction.id, {
                value: parseInt(e.target.value),
              })
            }
            className="w-32"
            min={1}
            disabled={disabled}
          />
        );

      case "requires_approval":
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={restriction.value}
              onCheckedChange={(checked) =>
                updateRestriction(ruleId, restriction.id, { value: checked })
              }
              disabled={disabled}
            />
            <span className="text-sm text-gray-600">
              Requires manager approval
            </span>
          </div>
        );

      case "limited_time":
        return (
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={restriction.value?.start || ""}
              onChange={(e) =>
                updateRestriction(ruleId, restriction.id, {
                  value: { ...restriction.value, start: e.target.value },
                })
              }
              className="w-48"
              disabled={disabled}
            />
            <span className="text-gray-500">to</span>
            <Input
              type="datetime-local"
              value={restriction.value?.end || ""}
              onChange={(e) =>
                updateRestriction(ruleId, restriction.id, {
                  value: { ...restriction.value, end: e.target.value },
                })
              }
              className="w-48"
              disabled={disabled}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderRuleCard = (rule: ModeRule) => {
    const isExpanded = expandedRules.has(rule.id);

    return (
      <div
        key={rule.id}
        className="border border-gray-200 rounded-lg bg-white overflow-hidden"
      >
        {/* Rule Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleRuleExpand(rule.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <Badge variant={rule.mode === "PAL" ? "primary" : "secondary"}>
              {rule.mode} Mode
            </Badge>

            <Badge variant="outline" className="font-mono">
              Priority {rule.priority}
            </Badge>

            <div className="flex items-center gap-2">
              <Switch
                checked={rule.isActive}
                onCheckedChange={(checked) =>
                  updateRule(rule.id, { isActive: checked })
                }
                disabled={disabled}
              />
              <span className="text-sm text-gray-600">
                {rule.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => duplicateRule(rule)}
              disabled={disabled}
              iconOnly
              leftIcon={<Copy className="w-4 h-4" />}
            />

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
            {/* Condition Type Selection */}
            <div className="space-y-2">
              <Label>When should this rule apply?</Label>
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
                  <SelectItem value="always">Always apply</SelectItem>
                  <SelectItem value="based_on">
                    Apply based on conditions
                  </SelectItem>
                  <SelectItem value="restricted">
                    Apply with restrictions
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditions Section */}
            {rule.conditionType === "based_on" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Conditions
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCondition(rule.id)}
                    disabled={disabled}
                    leftIcon={<Plus className="w-4 h-4 mr-1" />}
                  >
                    Add Condition
                  </Button>
                </div>

                {(!rule.conditions || rule.conditions.length === 0) && (
                  <div className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-lg">
                    No conditions added. Rule will apply to all products.
                  </div>
                )}

                {rule.conditions?.map((condition, idx) => (
                  <div
                    key={condition.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-500 w-8">
                      {idx + 1}.
                    </span>
                    <Select
                      value={condition.field}
                      onValueChange={(val) =>
                        updateCondition(rule.id, condition.id, { field: val })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITION_FIELDS.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={condition.operator}
                      onValueChange={(val: any) =>
                        updateCondition(rule.id, condition.id, {
                          operator: val,
                        })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPERATORS[
                          condition.field as keyof typeof OPERATORS
                        ]?.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getConditionInput(condition, rule.id)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(rule.id, condition.id)}
                      disabled={disabled}
                      className="text-red-600"
                      iconOnly
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    />{" "}
                  </div>
                ))}
              </div>
            )}

            {/* Restrictions Section */}
            {rule.conditionType === "restricted" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Restrictions
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addRestriction(rule.id)}
                    disabled={disabled}
                    leftIcon={<Plus className="w-4 h-4 mr-1" />}
                  >
                    Add Restriction
                  </Button>
                </div>

                {(!rule.restrictions || rule.restrictions.length === 0) && (
                  <div className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-lg">
                    No restrictions added. Rule applies without limitations.
                  </div>
                )}

                {rule.restrictions?.map((restriction) => (
                  <div
                    key={restriction.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Select
                      value={restriction.type}
                      onValueChange={(val: any) =>
                        updateRestriction(rule.id, restriction.id, {
                          type: val,
                        })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="min_quantity">
                          Minimum Quantity
                        </SelectItem>
                        <SelectItem value="max_quantity">
                          Maximum Quantity
                        </SelectItem>
                        <SelectItem value="requires_approval">
                          Requires Approval
                        </SelectItem>
                        <SelectItem value="limited_time">
                          Limited Time
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {getRestrictionInput(restriction, rule.id)}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRestriction(rule.id, restriction.id)}
                      disabled={disabled}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Priority Info */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              Rules are evaluated in priority order (lower numbers first)
            </div>
          </div>
        )}
      </div>
    );
  };

  // Filter rules by active tab
  const filteredRules = rules.filter((r: ModeRule) => r.mode === activeTab);

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {modes.map((mode) => (
          <button
            type="button"
            key={mode}
            onClick={() => setActiveTab(mode)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors relative",
              activeTab === mode
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            {mode} Mode Rules
            <Badge variant="secondary" className="ml-2 text-xs">
              {rules.filter((r: ModeRule) => r.mode === mode).length}
            </Badge>
          </button>
        ))}
      </div>

      {/* Global Settings */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Global Settings
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-blue-800">Default Mode</Label>
            <Badge variant="primary">{activeTab}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-blue-800">Rules Priority</Label>
            <span className="text-sm text-blue-900">
              Sequential (first match wins)
            </span>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {filteredRules.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">
              No rules configured for {activeTab} mode
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Add rules to control how {activeTab} mode behaves for this
              category
            </p>
            <Button
              type="button"
              onClick={() => addRule(activeTab)}
              disabled={disabled}
              leftIcon={<Plus className="w-4 h-4 mr-2" />}
            >
              Add Rule
            </Button>
          </div>
        )}

        {filteredRules.map((rule: ModeRule) => renderRuleCard(rule))}
      </div>

      {/* Add Rule Button */}
      {filteredRules.length > 0 && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => addRule(activeTab)}
          disabled={disabled}
          leftIcon={<Plus className="w-4 h-4 mr-2" />}
        >
          Add {activeTab} Mode Rule
        </Button>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">💡 How rules work:</p>
        <ul className="list-disc list-inside space-y-0.5 text-gray-600">
          <li>Rules are evaluated in priority order (lower numbers first)</li>
          <li>The first matching rule determines the mode behavior</li>
          <li>Use conditions to target specific products or customers</li>
          <li>Add restrictions to limit when/where rules apply</li>
        </ul>
      </div>
    </div>
  );
}
