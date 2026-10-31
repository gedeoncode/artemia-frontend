// app/(dashboard)/categories/[id]/components/AttributeCard.tsx
"use client";

import { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/";
import { Badge } from "@/components/ui/";
import { Button } from "@/components/ui/";
import { AttributeBasicFields } from "./AttributeBasicFields";
import { AttributeBehaviorFields } from "./AttributeBehaviorFields";
import { AttributeDisplayFields } from "./AttributeDisplayFields";
import { AttributeValidationFields } from "./AttributeValidationFields";
import { AttributeOptionsEditor } from "./AttributeOptionsEditor";
import { AttributeUISettings } from "./AttributeUISettings";
import { cn } from "@/lib/utils";
import { useWatch } from "react-hook-form";

interface AttributeCardProps {
  control: any;
  index: number;
  attribute: any;
  onRemove: () => void;
  onDuplicate: () => void;
  onReorder: (dragIndex: number, dropIndex: number) => void;
  totalAttributes: number;
  errors: any;
}

const ItemType = "ATTRIBUTE_CARD";

export function AttributeCard({
  control,
  index,
  attribute,
  onRemove,
  onDuplicate,
  onReorder,
  totalAttributes,
  errors,
}: AttributeCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
const inputType = useWatch({
  control,
  name: `attributes.${index}.inputType`,
});
console.log("Input type:",inputType)
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onReorder(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  const getTypeBadgeVariant = (type: string) => {
    const variants: Record<string, string> = {
      string: "default",
      number: "secondary",
      boolean: "outline",
      date: "danger",
      enum: "default",
      array: "secondary",
      object: "outline",
    };
    return variants[type] || "default";
  };

  return (
    <Card
      ref={ref}
      className={cn(
        "transition-all duration-200",
        isDragging && "opacity-50 shadow-lg",
        "hover:shadow-md"
      )}
    >
      <CardHeader className="p-4 cursor-move">
        <div className="flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-gray-900 truncate">
                {attribute.label || "Unnamed Attribute"}
              </h4>
              <code className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {attribute.key}
              </code>
              <Badge variant={getTypeBadgeVariant(attribute.type)} className="text-xs">
                {attribute.type}
              </Badge>
              {attribute.required && (
                <Badge variant="danger" className="text-xs">
                  Required
                </Badge>
              )}
              {attribute.filterable && (
                <Badge variant="outline" className="text-xs">
                  Filterable
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDuplicate}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-6 pt-0 space-y-6">
          {errors && Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
              <div className="text-sm text-red-700">
                This attribute has validation errors. Please review all fields.
              </div>
            </div>
          )}

          <AttributeBasicFields control={control} index={index} errors={errors} />
          <AttributeBehaviorFields control={control} index={index} />
          <AttributeDisplayFields control={control} index={index} />
          
          {["select", "multiselect", "radio"].includes(inputType) && (
            <AttributeOptionsEditor control={control} index={index} />
          )}
          
          <AttributeValidationFields control={control} index={index} type={attribute.type} />
          <AttributeUISettings control={control} index={index} />
        </CardContent>
      )}
    </Card>
  );
}