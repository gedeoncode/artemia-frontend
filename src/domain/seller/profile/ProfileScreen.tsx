"use client";

import {
  ProfileHeader,
  ProfileTabs,
  ProfileLoadingOverlay,
  ProfileTabContent,
} from "./components";

import { useProfile } from "./hooks/useProfile";
import type { SellerProfile } from "../types/profileTypes";
import { AlertMessage } from "@/components/error/AlertMessage";
import { PageSection } from "@/components/PageSection";

interface ProfilePageClientProps {
  initialProfile?: SellerProfile;
}

export default function ProfilePageClient({
  initialProfile,
}: ProfilePageClientProps) {
  const {
    profile,
    loadingState,
    error,
    activeTab,
    setActiveTab,
    isUpdating,
    isUploading,
    isChangingPassword,
    handleProfileUpdate,
    handleSellingModeChange,
    handlePasswordChange,
    handleAvatarUpload,
  } = useProfile(initialProfile);

  const isBusy = isUpdating || isChangingPassword;

  return (
    <PageSection >
      <ProfileHeader
        profile={profile}
        onAvatarUpload={handleAvatarUpload}
        uploading={isUploading}
      />

      <ProfileTabs
        profileType={profile?.type}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        disabled={loadingState !== "idle"}
      />

      <div className="relative overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        {error && <AlertMessage message={error} variant="error"/>}
        {isBusy && (
          <ProfileLoadingOverlay
            label={
              isUpdating
                ? "Mise à jour du profil..."
                : "Changement du mot de passe..."
            }
          />
        )}

        <div className="p-6 sm:p-8">
          <ProfileTabContent
            activeTab={activeTab}
            profile={profile}
            loading={isUpdating}
            onUpdate={handleProfileUpdate}
            onSellingModeChange={handleSellingModeChange}
            onPasswordChange={handlePasswordChange}
          />
        </div>
      </div>
    </PageSection>
  );
}
