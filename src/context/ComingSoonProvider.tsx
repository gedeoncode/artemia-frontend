// providers/ComingSoonProvider.tsx

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

type ComingSoonContextType = {
  showComingSoon: (featureName?: string) => void;
};

const ComingSoonContext = createContext<
  ComingSoonContextType | undefined
>(undefined);

export function ComingSoonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [featureName, setFeatureName] = useState("");

  const showComingSoon = useCallback((feature?: string) => {
    setFeatureName(feature ?? "");
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setFeatureName("");
  }, []);

  const value = useMemo(
    () => ({
      showComingSoon,
    }),
    [showComingSoon],
  );

  return (
    <ComingSoonContext.Provider value={value}>
      {children}

      <ConfirmationDialog
        isOpen={open}
        title="Feature Coming Soon"
        variant="info"
        confirmLabel="Got it"
        cancelLabel=""
        onConfirm={closeDialog}
        onCancel={closeDialog}
        message={
          <div className="space-y-3">
            {featureName && (
              <p>
                <strong>{featureName}</strong> is currently under
                development.
              </p>
            )}

            <p className="text-sm text-gray-600">
              This feature will be available in a future release.
            </p>
          </div>
        }
      />
    </ComingSoonContext.Provider>
  );
}

export function useComingSoon() {
  const context = useContext(ComingSoonContext);

  if (!context) {
    throw new Error(
      "useComingSoon must be used within ComingSoonProvider",
    );
  }

  return context;
}