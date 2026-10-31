"use client";

import { useCallback } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Input, Button } from "@/components/ui/";
import { useLogin } from "@/hooks/auth/useLogin";
import { AUTH_MESSAGES } from "@/constants/auth.constants";
import { AuthAlert } from "@/components/auth/LoginAuthAlert";
import { Navbar, Footer } from "@/components/auth";

export function LoginCLientPage() {
  const {
    email,
    password,
    showPassword,
    errors,
    loading,
    countdown,
    emailRef,
    setEmail,
    setPassword,
    setShowPassword,
    setErrors,
    formatDelay,
    submitLogin,
  } = useLogin({
    onSuccess: () => {
      toast.success(AUTH_MESSAGES.login.success.LOGIN_SUCCESS);
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (loading || countdown !== null) return;
      submitLogin();
    },
    [loading, countdown, submitLogin],
  );

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, [setShowPassword]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center ">
        <div className="w-full max-w-md px-4 sm:px-6">
          <h1 className="mb-2 text-2xl sm:text-3xl font-semibold text-gray-900">
            {t("login.title", "Se connecter")}
          </h1>
          <p className="mb-6 text-sm sm:text-base text-gray-500">
            {t("login.subtitle", "Accédez à votre compte Artemia")}
          </p>

          {/* Banner / Global error */}
          {errors.banner && (
            <AuthAlert
              message={errors.banner}
              countdown={countdown}
              formatDelay={formatDelay}
              onRetry={() => setErrors({})}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <label className="block w-full">
              <span className="text-sm sm:text-base font-medium text-gray-700">
                {t("login.emailLabel", "Email")}
              </span>
              <Input
                ref={emailRef}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                className="mt-2"
                placeholder={t("login.emailPlaceholder", "you@company.com")}
              />
              {/* Inline error */}
              {errors.inline?.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.inline.email}
                </p>
              )}
            </label>

            {/* Password */}
            <label className="block w-full">
              <span className="text-sm sm:text-base font-medium text-gray-700">
                {t("login.passwordLabel", "Mot de passe")}
              </span>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label={
                    showPassword
                      ? t("login.hidePassword", "Masquer le mot de passe")
                      : t("login.showPassword", "Afficher le mot de passe")
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.inline?.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.inline.password}
                </p>
              )}
            </label>

            <Button
              type="submit"
              aria-busy={loading}
              disabled={loading || countdown !== null}
              isPending={loading}
              loadingIcon={<Loader className="w-4 h-4 animate-spin" />}
              loadingText={t("login.loading", "Connexion…")}
              className={`w-full py-3 `}
            >
              {t("login.submit", "Se connecter")}
            </Button>
          </form>

          {/* Registration Link */}
          <p className="mt-4 text-sm sm:text-base text-center text-gray-500">
            {t("login.noAccount", "Vous n'avez pas de compte ? ")}
            <Link
              href="/auth/register/email"
              className="text-blue-600 hover:underline font-medium"
            >
              {t("login.register", "Inscrivez-vous")}
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* --------------------------------------------
 * Placeholder t() function for i18n
 * Replace with your translation library (i18next, react-intl, etc.)
 * ------------------------------------------ */
function t(key: string, defaultText: string) {
  return defaultText;
}
