"use client";

import { useMemo, Suspense } from "react";
import {
  PersonalInfo,
  BusinessInfo,
  SellingMode,
  SecuritySettings,
} from "./ProfileForm"; // dynamic imports
import type { SellerProfile, PasswordChangeParams, ProfileUpdateParams } from "../../types/profileTypes";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ProfileTabContentProps {
  activeTab: string;
  profile: SellerProfile;
  loading: boolean;
  onUpdate: (data: Partial<SellerProfile>) => void;
  onSellingModeChange: (updates: ProfileUpdateParams) => void;

  onPasswordChange: (data: PasswordChangeParams) => Promise<void>;
}

export function ProfileTabContent({
  activeTab,
  profile,
  loading,
  onUpdate,
  onSellingModeChange,
  onPasswordChange,
}: ProfileTabContentProps) {
  const tabComponents = useMemo(
    () => ({
      personal:
        profile.type === "individual" ? (
          <PersonalInfo
            key="personal"
            profile={profile}
            onSubmit={onUpdate}
            loading={loading}
          />
        ) : null,
      business:
        profile.type === "company" ? (
          <BusinessInfo
            key="business"
            profile={profile}
            onSubmit={onUpdate}
            loading={loading}
          />
        ) : null,
      selling: (
        <SellingMode
          key="selling"
          profile={profile}
          onSubmit={onSellingModeChange}
          loading={loading}
        />
      ),
      security: (
        <SecuritySettings
          key="security"
          onChangePassword={onPasswordChange}
          loading={loading}
        />
      ),
    }),
    [profile, loading, onUpdate, onSellingModeChange, onPasswordChange]
  );

  const content =
    tabComponents[activeTab as keyof typeof tabComponents] ?? null;

  return (
    <div className="relative w-full">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-10">
            <LoadingSpinner />
          </div>
        }
      >
        {content}
      </Suspense>
    </div>
  );
}
