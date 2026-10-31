// app/(dashboard)/categories/[id]/components/EmptyAttributeState.tsx
"use client";

import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/";

interface EmptyAttributeStateProps {
  onAdd: () => void;
}

export function EmptyAttributeState({ onAdd }: EmptyAttributeStateProps) {
  return (
    <div className="text-center py-12 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
        <Package className="w-8 h-8 text-gray-400" />
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">
        No Attributes Defined
      </h4>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
        Define custom attributes to build seller product forms, filtering, and
        search experiences. Attributes help organize products and improve
        discoverability.
      </p>
      <Button onClick={onAdd}
      leftIcon={        <Plus className="w-4 h-4 " />
}
      >
        Create First Attribute
      </Button>
    </div>
  );
}