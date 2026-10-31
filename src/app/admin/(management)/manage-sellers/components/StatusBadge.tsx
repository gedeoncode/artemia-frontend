import { cn } from "@/lib";
import { STATUS_CONFIGS } from "../constants/actionConfig.constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
// Memoized Status Badge Component
export const StatusBadge = 
  ({ status, isBlocked }: { status: string; isBlocked: boolean }) => {
    const config = isBlocked
      ? STATUS_CONFIGS.blocked
      : status === "approved"
        ? STATUS_CONFIGS.approved
        : status === "rejected"
          ? STATUS_CONFIGS.rejected
          : STATUS_CONFIGS.pending;
    const Icon = config.icon;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
              config.className,
            )}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    );
  }