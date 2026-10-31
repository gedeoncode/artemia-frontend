"use client";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import Button from "@/components/ui/button/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import RoleOption from "@/components/registration/RoleOption";
import { usePurposeSelection } from "@/hooks/registration/usePurposeSelection";
import { SIGNUP_INTENT_CONFIG } from "../../constants/signupIntentConfig";
import { Navbar, Footer } from "@/components/auth";
import { UserIntent } from "@/types";
import { AUTH_MESSAGES } from "@/constants";
import { toast } from "react-toastify";

export function PurposeSelectionClientPage() {
  const { checking, loading, error, selectedIntent, chooseIntent } =
    usePurposeSelection({
      onSuccess: () => {
        toast.success(AUTH_MESSAGES.registration.success.INTENT_SELECTED);
      },
    });

  const [selected, setSelected] = useState<UserIntent | null>(null);

  // Sync UI state with authoritative intent (backend/session)
  useEffect(() => {
    if (selectedIntent) {
      setSelected(selectedIntent);
    }
  }, [selectedIntent]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex items-center justify-center flex-grow p-4 sm:p-6">
        <div className="w-full max-w-md px-4 sm:px-6">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">
            Create an account
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Choose how you want to use the platform.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selected) chooseIntent(selected);
            }}
            className="space-y-4"
          >
            <fieldset disabled={loading} className="space-y-4">
              <legend className="sr-only">Choose account type</legend>

              {Object.values(SIGNUP_INTENT_CONFIG).map((intentConfig) => (
                <RoleOption
                  key={intentConfig.intent}
                  role={intentConfig.intent}
                  title={intentConfig.title}
                  desc={intentConfig.description}
                  note={intentConfig.note}
                  icon={intentConfig.icon}
                  selected={selected}
                  onSelect={setSelected}
                />
              ))}
            </fieldset>

            {error && (
              <div className="text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3"
              disabled={!selected}
              isPending={loading}
              loadingText="En cours..."
              loadingIcon={<Loader className="w-4 h-4 animate-spin" />}
            >
              Continue
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
