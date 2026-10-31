import {  useMemo } from "react";
import { Seller } from "../services/types";
import { Icons } from "@/components/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib";
type VerificationBadge = {
  label: string;
  icon: React.ElementType;
  verified: boolean;
};
// Memoized Verification Badges Component
export const VerificationBadges = ({ seller }: { seller: Seller }) => {
  const badges: VerificationBadge[] = useMemo(
    () => [
      {
        label: "Email",
        icon: Icons.mail,
        verified: seller.user.isEmailVerified,
      },
      {
        label: "Phone",
        icon: Icons.phoneCall,
        verified: seller.user.isPhoneVerified,
      },
    ],
    [seller.user.isEmailVerified, seller.user.isPhoneVerified],
  );

  return (
    <div className="flex gap-1.5">
      {badges.map((badge, idx) => (
        <Tooltip key={idx}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-all cursor-help",
                badge.verified
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <badge.icon className="h-3 w-3" />
              {badge.label}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <p>
              {badge.verified
                ? `${badge.label} is verified`
                : `${badge.label} is not verified`}
            </p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}