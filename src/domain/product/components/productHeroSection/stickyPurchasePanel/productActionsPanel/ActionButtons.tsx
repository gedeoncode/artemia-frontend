"use client";

import { useState } from "react";

import { PRODUCT_ACTION, ResolvedProductAction } from "./types";
import { Button } from "@/components/ui";

type Props = {
  actions: ResolvedProductAction[];

  topContent?: React.ReactNode;
};

export function ActionButtons({ actions, topContent }: Props) {
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const primaryActions = actions.filter(
  (action) =>
    action.id === PRODUCT_ACTION.BUY_NOW ||
    action.id === PRODUCT_ACTION.ADD_TO_CART
);

const supportAction = actions.find(
  (action) => action.id === PRODUCT_ACTION.CONTACT_SELLER
);

  const handleAction = async (action: ResolvedProductAction) => {
    try {
      setProcessingAction(action.id);

      await action.handler();
    } finally {
      setProcessingAction(null);
    }
  };

return (
  <div className="space-y-4">
    {topContent}

    <div className="flex flex-wrap gap-2">
      {primaryActions.map((action) => (
        <Button
          key={action.id}
          className="flex-1 min-w-[160px]"
          onClick={() => handleAction(action)}
          disabled={processingAction === action.id}
          variant={action.variant}
          isPending={processingAction === action.id}
        >
          {processingAction === action.id
            ? "Processing..."
            : action.label}
        </Button>
      ))}
    </div>

    {supportAction && (
      <Button
        variant="ghost"
        className="justify-start px-0"
        onClick={() => handleAction(supportAction)}
        disabled={processingAction === supportAction.id}
        isPending={processingAction === supportAction.id}
      >
        {processingAction === supportAction.id
          ? "Processing..."
          : "Contact Seller →"}
      </Button>
    )}
  </div>
  );
}


