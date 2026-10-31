"use client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

type FeeType = "percentage" | "fixed" | "hybrid";
type DiscountType = "percentage" | "fixed";
type Operator = ">" | "<" | ">=" | "<=" | "=";

interface Promotion {
  condition: { field: "price" | "quantity"; operator: Operator; value: number };
  discount: { type: DiscountType; value: number };
}

export interface ModeRule {
  feeType: FeeType;
  feeValue: number;
  minFee?: number;
  maxFee?: number;
  commissionRate?: number;
  holdPeriod?: number;
  promotions: Promotion[];
}

interface ModeRulesFormProps {
  modes: ("PAP" | "PAL")[];
  value: Record<string, ModeRule>;
  onChange: (rules: Record<string, ModeRule>) => void;
}

export function ModeRulesForm({ modes, value, onChange }: ModeRulesFormProps) {
  const defaultRule: ModeRule = {
    feeType: "percentage",
    feeValue: 0,
    promotions: [],
  };

  const getRule = (mode: string): ModeRule => ({
    ...defaultRule,
    ...value[mode],
  });

  // --- Helpers ---
  const updateMode = (mode: string, updates: Partial<ModeRule>) => {
    const existing = getRule(mode);
    onChange({
      ...value,
      [mode]: { ...existing, ...updates },
    });
  };

  const addPromotion = (mode: string) => {
    const newPromo: Promotion = {
      condition: { field: "price", operator: ">", value: 0 },
      discount: { type: "percentage", value: 0 },
    };
    const existing = getRule(mode);
    updateMode(mode, { promotions: [...existing.promotions, newPromo] });
  };

  const updatePromotion = (
    mode: string,
    index: number,
    updates: Partial<Promotion>,
  ) => {
    const existing = getRule(mode);
    const promos = [...existing.promotions];
    promos[index] = { ...promos[index], ...updates };
    updateMode(mode, { promotions: promos });
  };

  const removePromotion = (mode: string, index: number) => {
    const existing = getRule(mode);
    const promos = [...existing.promotions];
    promos.splice(index, 1);
    updateMode(mode, { promotions: promos });
  };

  // --- Render ---
  return (
    <div className="space-y-6">
      {modes.map((mode) => {
        const rules = getRule(mode);

        return (
          <Card key={mode} className="p-4 space-y-4 ">
            <h3 className="text-lg font-semibold">{mode} Mode Rules</h3>

            {/* Fee Config */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Fee Type</Label>
                <Select
                  value={rules.feeType}
                  onValueChange={(val) =>
                    updateMode(mode, { feeType: val as FeeType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Fee Value</Label>
                <Input
                  type="number"
                  value={rules.feeValue}
                  onChange={(e) =>
                    updateMode(mode, {
                      feeValue: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label>Min Fee</Label>
                <Input
                  type="number"
                  value={rules.minFee ?? ""}
                  onChange={(e) =>
                    updateMode(mode, {
                      minFee: parseFloat(e.target.value) || undefined,
                    })
                  }
                />
              </div>

              <div>
                <Label>Max Fee</Label>
                <Input
                  type="number"
                  value={rules.maxFee ?? ""}
                  onChange={(e) =>
                    updateMode(mode, {
                      maxFee: parseFloat(e.target.value) || undefined,
                    })
                  }
                />
              </div>
            </div>

            {/* Commission & Hold */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Commission Rate (%)</Label>
                <Input
                  type="number"
                  value={rules.commissionRate ?? ""}
                  onChange={(e) =>
                    updateMode(mode, {
                      commissionRate: parseFloat(e.target.value) || undefined,
                    })
                  }
                />
              </div>
              <div>
                <Label>Hold Period (days)</Label>
                <Input
                  type="number"
                  value={rules.holdPeriod ?? ""}
                  onChange={(e) =>
                    updateMode(mode, {
                      holdPeriod: parseFloat(e.target.value) || undefined,
                    })
                  }
                />
              </div>
            </div>

            {/* Promotions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Promotions</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addPromotion(mode)}
                >
                  + Add Promotion
                </Button>
              </div>

              {(rules.promotions ?? []).map((promo, idx) => (
                <div
                  key={idx}
                  className="grid items-end grid-cols-1 gap-2 p-2 border rounded-lg md:grid-cols-5"
                >
                  <Select
                    value={promo.condition.field}
                    onValueChange={(val) =>
                      updatePromotion(mode, idx, {
                        condition: {
                          ...promo.condition,
                          field: val as "price" | "quantity",
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="quantity">Quantity</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={promo.condition.operator}
                    onValueChange={(val) =>
                      updatePromotion(mode, idx, {
                        condition: {
                          ...promo.condition,
                          operator: val as Operator,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=">">&gt;</SelectItem>
                      <SelectItem value="<">&lt;</SelectItem>
                      <SelectItem value=">=">&gt;=</SelectItem>
                      <SelectItem value="<=">&lt;=</SelectItem>
                      <SelectItem value="=">=</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    value={promo.condition.value}
                    onChange={(e) =>
                      updatePromotion(mode, idx, {
                        condition: {
                          ...promo.condition,
                          value: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />

                  <Select
                    value={promo.discount.type}
                    onValueChange={(val) =>
                      updatePromotion(mode, idx, {
                        discount: {
                          ...promo.discount,
                          type: val as DiscountType,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">%</SelectItem>
                      <SelectItem value="fixed">$</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={promo.discount.value}
                      onChange={(e) =>
                        updatePromotion(mode, idx, {
                          discount: {
                            ...promo.discount,
                            value: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => removePromotion(mode, idx)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
