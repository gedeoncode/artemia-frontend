import { ACTION_CONFIGS } from "../constants/actionConfig.constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { SellerAction } from "../types/SellerAction.types";
import { Seller } from "../services/types";
import { Button } from "@/components/ui";
import { cn } from "@/lib";
import { Icons } from "@/components/Icons";
// Memoized Action Button Component
export const ActionButton = 
  ({
    action,
    isUpdating,
    onClick,
  }: {
    seller: Seller;
    action: SellerAction;
    isUpdating: boolean;
    onClick: () => void;
  }) => {
    const config = ACTION_CONFIGS[action];
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={config.variant}
            onClick={onClick}
            disabled={isUpdating}
            className={cn(
              "h-8 px-3 text-xs font-medium transition-all duration-200",
              config.className,
            )}
          >
            {isUpdating ? (
              <Icons.spinner className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <config.icon className="h-3.5 w-3.5 mr-1.5" />
                {config.label}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p>{config.label} this seller</p>
        </TooltipContent>
      </Tooltip>
    );
  }



