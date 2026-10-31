"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button/Button";

type FormActionsProps = {
  loading?: boolean;
  onCancel?: () => void;
};

export const FormActions = ({
  loading = false,
  onCancel,
}: FormActionsProps) => {
  return (
    <div className="flex flex-col items-end gap-3 mt-8 sm:flex-row sm:justify-end sm:space-x-3">
      {onCancel && (
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="min-w-[120px]"
          >
            Annuler
          </Button>
        </div>
      )}

      <div>
        <Button
          type="submit"
          disabled={loading}
          className="relative min-w-[200px] font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </Button>
      </div>
    </div>
  );
};
