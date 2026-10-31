"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { RedirectLoader } from "@/components/RedirectLoader";

import { useResolveRedirect } from "@/domain/auth/redirect";

export default function RedirectPage() {
  const router = useRouter();

  const {
    user,
    loading,
    refetchUser,
  } = useAuth();

  const {
    data: finalRoute,
    isLoading,
    isError,
    refetch,
  } = useResolveRedirect({
    user,
    enabled: !loading,
  });

  useEffect(() => {
    if (!finalRoute) return;

    router.prefetch(finalRoute);
    router.replace(finalRoute);
  }, [finalRoute, router]);

  if (loading || isLoading) {
    return (
      <RedirectLoader
        title="Preparing your experience"
        description="We’re setting everything up for you"
      />
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <p className="text-sm text-red-600">
            Failed to resolve redirect.
          </p>

          <button
            className="px-4 py-2 border rounded-md"
            onClick={async () => {
              await refetchUser();
              refetch();
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return null;
}