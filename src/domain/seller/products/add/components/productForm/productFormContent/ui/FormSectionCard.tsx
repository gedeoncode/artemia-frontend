// /ui/FormSectionCard.tsx

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/";
import { cn } from "@/lib/utils";

interface FormSectionCardProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function FormSectionCard({
  title,
  description,
  actions,
  children,
  footer,
  className,
}: FormSectionCardProps) {
  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="sm:flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {title}
            </CardTitle>

            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {children}
      </CardContent>

      {footer && (
        <div className="px-6 pb-5 pt-0">
          {footer}
        </div>
      )}
    </Card>
  );
}