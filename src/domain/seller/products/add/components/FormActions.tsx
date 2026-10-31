"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
interface FormActionsProps {
  loading?: boolean;
  isEdit?: boolean;
  isFirst: boolean;
  isLast: boolean;
  prev: () => void;
  next: () => void;
  canProceed: boolean;

  /** Optional: if you still want RHF validation triggered on “Next” */
  fieldsToValidate?: string[];
}

export const FormActions = ({
  loading = false,
  isEdit = false,
  isFirst,
  isLast,
  prev,
  next,
  canProceed,

  fieldsToValidate = [],
}: FormActionsProps) => {
  const [validating, setValidating] = useState(false);
  const { trigger } = useFormContext();
  const isLoading = loading || validating;
  const isDisabled = loading || validating || !canProceed;

  const handleNext = async () => {
    // Optionally trigger RHF validation if this step uses form fields
    if (fieldsToValidate.length > 0) {
      setValidating(true);
      const valid = await trigger(fieldsToValidate);
      setValidating(false);
      if (!valid) return;
    }

    await next();
  };

  return (
    <div className="flex flex-col gap-4 pt-6 border-t sm:flex-row sm:items-center sm:justify-between">
      {/* ── Back Button ─────────────────────────────── */}
      {isFirst ? (
        <div />
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={prev}
          disabled={loading || validating}
        >
          Retour
        </Button>
      )}

      {/* ── Next / Submit Button ───────────────────── */}
      <div>
        {!isLast ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={isDisabled}
            className="min-w-[120px] flex items-center justify-center gap-2"
          >
            {validating && <Loader2 className="w-4 h-4 animate-spin" />}
            {validating ? "Vérification..." : "Suivant"}
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isDisabled}
            className="min-w-[180px] flex items-center justify-center gap-2"
            isPending={isLoading}
            loadingText={isEdit ? "Enregistrement..." : "Enregistrement..."}
          >
            {!isLoading && isEdit
              ? "Mettre à jour le produit"
              : "Enregistrer le produit"}
          </Button>
        )}
      </div>
    </div>
  );
};
