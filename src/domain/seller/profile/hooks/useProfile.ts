import { useState, useEffect, useTransition, useCallback } from "react";
import {
  updateSellerProfileAction,
  changePasswordAction,
  changeSellingModeAction,
} from "../../actions/profile";
import {
  fetchSellerProfile,
  uploadAvatar,
} from "../../services/profileServices";
import type {
  SellerProfile,
  ProfileUpdateParams,
  PasswordChangeParams,
} from "../../types/profileTypes";
import {
  defaultNotifier,
  NotificationService,
} from "@/core/notifications/defaultNotifier";
import { CommissionModel } from "@/types/category/category.types";

type LoadingState =
  | "idle"
  | "fetching"
  | "updating"
  | "uploading"
  | "changingPassword";

export function useProfile(
  initialProfile?: SellerProfile,
  notify: NotificationService = defaultNotifier,
) {
  const [profile, setProfile] = useState<SellerProfile | null>(
    initialProfile ?? null,
  );
  const [activeTab, setActiveTab] = useState("personal");
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // === Utility ===
  const handleError = useCallback(
    (message: string, err?: unknown) => {
      console.error("[useProfile]", message, err);
      setError(message);
      notify.error(message);
      setLoadingState("idle");
    },
    [notify],
  );

  // === Fetch Profile (only if not preloaded) ===
  useEffect(() => {
    if (initialProfile) return;

    let isMounted = true;
    setLoadingState("fetching");

    const loadProfile = async () => {
      try {
        const data = await fetchSellerProfile();
        if (isMounted) setProfile(data.seller);
      } catch (err: any) {
        if (isMounted)
          handleError(err.message || "Failed to fetch profile", err);
      } finally {
        if (isMounted) setLoadingState("idle");
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [initialProfile, handleError]);

  // === Update Profile (Optimistic + rollback) ===
  const handleProfileUpdate = useCallback(
    async (updates: ProfileUpdateParams) => {
      if (!profile || loadingState !== "idle") return;

      const prevProfile = profile;
      setProfile({ ...profile, ...updates });
      setError(null);
      setLoadingState("updating");

      try {
        const result = await updateSellerProfileAction(updates);

        if (!result.success) {
          setProfile(prevProfile);
          notify.error(result.error || "Failed to update profile");
          return;
        }

        setProfile((prev) => (prev ? { ...prev, ...result.data } : prev));
        notify.success("Profile updated successfully");
      } catch (err) {
        setProfile(prevProfile);
        handleError("Unexpected error during profile update", err);
      } finally {
        setLoadingState("idle");
      }
    },
    [profile, loadingState, notify, handleError],
  );

  // === Change Password ===
  const handlePasswordChange = useCallback(
    async ({
      currentPassword,
      newPassword,
      confirmPassword,
    }: PasswordChangeParams) => {
      if (newPassword !== confirmPassword) {
        notify.error("Les nouveaux mots de passe ne correspondent pas.");
        return;
      }

      setLoadingState("changingPassword");
      startTransition(async () => {
        try {
          const result = await changePasswordAction({
            currentPassword,
            newPassword,
            confirmPassword,
          });

          if (!result.success) {
            notify.error(
              result.error || "Échec du changement de mot de passe.",
            );
            return;
          }

          notify.success("Votre mot de passe a été modifié avec succès !");
        } catch (err) {
          handleError(
            "Une erreur interne est survenue. Veuillez réessayer.",
            err,
          );
        } finally {
          setLoadingState("idle");
        }
      });
    },
    [notify, handleError],
  );

  // === Change Selling Mode ===
  const handleSellingModeChange = useCallback(
    async (mode: CommissionModel) => {
      if (!profile) return;
      if (profile.commissionModel === mode) {
        notify.info("No change detected.");
        return;
      }
      setLoadingState("updating");
      setError(null);

      try {
        const result = await changeSellingModeAction(mode);

        if (!result.success) {
          notify.error(result.error || "Failed to change selling mode");
          return;
        }

        // Merge updated server data back into the profile
        setProfile((prev) => (prev ? { ...prev, ...result.data } : prev));

        notify.success("Selling mode updated successfully");
      } catch (err) {
        handleError("Unexpected error while changing selling mode", err);
      } finally {
        setLoadingState("idle");
      }
    },
    [profile, notify, handleError],
  );

  // === Upload Avatar ===
  const handleAvatarUpload = useCallback(
    async (file: File) => {
      setLoadingState("uploading");

      try {
        // Optionally: validate file before uploading
        if (!file || !file.type.startsWith("image/")) {
          throw new Error("Please select a valid image file");
        }

        const result = await uploadAvatar(file);
        console.log("result: ", result.success);

        if (!result || !result.success) {
          throw new Error(result?.error || "Avatar upload failed");
        }

        // Update profile state safely
        setProfile((prev) =>
          prev ? { ...prev, avatar: result.data.url } : prev,
        );

        notify.success("Avatar updated successfully");
      } catch (err: any) {
        const message =
          err?.message ||
          err?.response?.data?.message ||
          "Failed to upload avatar";
        handleError(message, err);
        notify.error(message);
      } finally {
        setLoadingState("idle");
      }
    },
    [notify, handleError],
  );

  // === Derived flags ===
  const loading =
    isPending || loadingState === "fetching" || (!profile && !error);

  const isUpdating = loadingState === "updating";
  const isUploading = loadingState === "uploading";
  const isChangingPassword = loadingState === "changingPassword";

  // === Public API ===
  return {
    profile,
    loading, // global lightweight flag
    loadingState, // fine-grained string state
    error,
    activeTab,
    setActiveTab,
    isUpdating,
    isUploading,
    isChangingPassword,
    handleProfileUpdate,
    handlePasswordChange,
    handleSellingModeChange,
    handleAvatarUpload,
  };
}
