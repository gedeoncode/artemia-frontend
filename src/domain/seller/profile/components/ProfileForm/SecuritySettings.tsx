"use client";

import { useState, useMemo, useRef } from "react";
import { SectionHeader } from "../../../../add-product/components/ui/SectionHeader";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { FormActions } from "../FormActions";
import { Eye, EyeOff, ShieldAlert, ShieldCheck } from "lucide-react";
import type { PasswordChangeParams } from "../../../types/profileTypes";
import { cn } from "@/lib/utils/";
import { AlertMessage } from "@/components/error/AlertMessage";

type SecuritySettingsProps = {
  onChangePassword: (data: PasswordChangeParams) => Promise<void>;
  loading: boolean;
};

export const SecuritySettings = ({
  onChangePassword,
  loading,
}: SecuritySettingsProps) => {
  const [passwordForm, setPasswordForm] = useState<PasswordChangeParams>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement | null>(null);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { newPassword, confirmPassword, currentPassword } = passwordForm;

    if (!currentPassword.trim()) {
      setError("Veuillez entrer votre mot de passe actuel.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Votre mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await onChangePassword(passwordForm);
      setSuccessMessage("Mot de passe mis à jour avec succès.");
      setTimeout(() => {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }, 1500);
    } catch (err: any) {
      const message =
        err.message?.includes("incorrect") || err.response?.status === 401
          ? "Le mot de passe actuel est incorrect."
          : err.message?.includes("network")
            ? "Problème de connexion. Veuillez réessayer."
            : "Impossible de mettre à jour le mot de passe.";
      setError(message);
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const passwordHints = (password: string) => {
    const missing: string[] = [];
    if (!/[A-Z]/.test(password)) missing.push("une majuscule");
    if (!/[a-z]/.test(password)) missing.push("une minuscule");
    if (!/\d/.test(password)) missing.push("un chiffre");
    if (!/[!@#$%^&*]/.test(password)) missing.push("un caractère spécial");
    return missing.length > 0 ? `Ajoutez ${missing.join(", ")}.` : "";
  };

  const passwordStrength = useMemo(() => {
    const { newPassword } = passwordForm;
    if (!newPassword) return { label: "Aucun mot de passe", level: 0 };
    if (newPassword.length < 8) return { label: "Trop court", level: 1 };
    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword))
      return { label: "Faible", level: 2 };
    if (validatePassword(newPassword)) return { label: "Fort", level: 3 };
    return { label: "Moyen", level: 2 };
  }, [passwordForm]);

  const strengthColor = [
    "bg-gray-300",
    "bg-red-400",
    "bg-yellow-400",
    "bg-green-500",
  ][passwordStrength.level];

  const toggleVisibility = (field: keyof typeof showPassword) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <SectionHeader
        title="Paramètres de sécurité"
        description="Mettez à jour régulièrement votre mot de passe pour garantir la sécurité de votre compte vendeur."
      />

      <div className="space-y-5">
        {/* Current Password */}
        <div className="relative">
          <Label htmlFor="currentPassword">
            Mot de passe actuel <span className="text-red-600">*</span>
          </Label>
          <Input
            type={showPassword.current ? "text" : "password"}
            id="currentPassword"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handleFieldChange}
            disabled={loading}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => toggleVisibility("current")}
            className="absolute text-gray-400 right-3 top-9 hover:text-gray-600"
          >
            {showPassword.current ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <Label htmlFor="newPassword">
            Nouveau mot de passe <span className="text-red-600">*</span>
          </Label>
          <Input
            type={showPassword.new ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handleFieldChange}
            disabled={loading}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => toggleVisibility("new")}
            className="absolute text-gray-400 right-3 top-9 hover:text-gray-600"
          >
            {showPassword.new ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          <div className="mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {passwordStrength.level >= 3 ? (
                <ShieldCheck className="w-4 h-4 text-green-500" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-yellow-500" />
              )}
              {passwordStrength.label}
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  strengthColor,
                )}
                style={{ width: `${(passwordStrength.level / 3) * 100}%` }}
              />
            </div>
            {passwordForm.newPassword && (
              <p className="mt-1 text-xs text-gray-500">
                {passwordHints(passwordForm.newPassword) ||
                  "Bon mot de passe ! Gardez-le secret et unique."}
              </p>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Label htmlFor="confirmPassword">
            Confirmer le mot de passe <span className="text-red-600">*</span>
          </Label>
          <Input
            type={showPassword.confirm ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handleFieldChange}
            disabled={loading}
            required
            autoComplete="new-password"
            className={cn(
              passwordForm.confirmPassword &&
                passwordForm.confirmPassword !== passwordForm.newPassword &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          <button
            type="button"
            onClick={() => toggleVisibility("confirm")}
            className="absolute text-gray-400 right-3 top-9 hover:text-gray-600"
          >
            {showPassword.confirm ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          {passwordForm.confirmPassword &&
            passwordForm.confirmPassword === passwordForm.newPassword && (
              <AlertMessage
                message=" Les mots de passe
                correspondent."
                variant="success"
              />
            )}
        </div>

        {/* Error / Success Messages */}
        {error && <AlertMessage message={error} variant="error" />}
      </div>
      <FormActions loading={loading} />
    </form>
  );
};
