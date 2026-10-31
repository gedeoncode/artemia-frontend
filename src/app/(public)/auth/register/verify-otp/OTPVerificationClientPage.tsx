"use client";

import clsx from "clsx";
import { Loader, CheckCircle, RefreshCw } from "lucide-react";
import Button from "@/components/ui/button/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOtpVerificationController } from "@/hooks/registration/useOtpVerificationController";
import { OTP_LENGTH } from "@/constants/auth.constants";
import { Navbar, Footer } from "@/components/auth";

export default function OTPVerificationClientPage() {
  const {
    checking,
    otpDigits,
    inputRefs,
    loading,
    resendLoading,
    resendRunning,
    requestLoading,
    success,
    error,
    message,
    resendTimer,
    isLocked,
    isOtpComplete,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleResend,
  } = useOtpVerificationController();

  if (checking || requestLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getInputState = (index: number) => {
    if (success) return "success";
    if (error) return "error";
    if (otpDigits[index]) return "filled";
    return "default";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md px-4 sm:px-6">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">
            Verify your email
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Enter the {OTP_LENGTH}-digit code we sent to your email.
          </p>

          <form className="space-y-4">
            {/* Alerts */}
            {message && !error && !loading && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                {message}
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            {isLocked && (
              <div className="p-3 text-sm border rounded-lg text-amber-700 bg-amber-50 border-amber-200">
                Too many failed attempts. Please request a new OTP.
              </div>
            )}

            {/* OTP Inputs */}
            <div onPaste={handlePaste}>
              <div className="flex justify-between gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      if (el) inputRefs.current[idx] = el;
                    }}
                    value={digit}
                    maxLength={1}
                    inputMode="numeric"
                    disabled={
                      loading ||
                      success ||
                      isLocked ||
                      resendLoading ||
                      resendRunning
                    }
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={clsx(
                      "w-12 h-12 text-center text-xl font-semibold border rounded-lg transition",
                      {
                        "border-green-500 bg-green-50":
                          getInputState(idx) === "success",
                        "border-red-500 bg-red-50":
                          getInputState(idx) === "error",
                        "border-blue-400 bg-blue-50":
                          getInputState(idx) === "filled",
                        "border-gray-300": getInputState(idx) === "default",
                      },
                    )}
                  />
                ))}
              </div>

              <p className="mt-2 text-xs text-gray-500">
                {isOtpComplete
                  ? "✓ Ready to verify"
                  : `${OTP_LENGTH - otpDigits.filter(Boolean).length} digits remaining`}
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                <Loader className="w-4 h-4 animate-spin" />
                Verifying…
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                <CheckCircle className="w-4 h-4" />
                Verification successful! Redirecting…
              </div>
            )}

            {/* Resend */}
            <Button
              type="button"
              onClick={handleResend}
              disabled={resendRunning || loading}
              isPending={resendLoading}
              className="w-full"
              loadingText="En cours..."
              loadingIcon={<Loader className="w-4 h-4 animate-spin" />}
            >
              {resendTimer > 0 ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Resend in {resendTimer}s
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Resend OTP
                </span>
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
