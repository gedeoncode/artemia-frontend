"use client";

import { Navbar, Footer } from "@/components/auth";

import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { AUTH_MESSAGES } from "@/constants/auth.constants";
import { useEmailRegistration } from "@/hooks/registration/useEmailRegistration";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

export function EmailClientPage() {
  const { checking, email, setEmail, loading, error, submitEmail } =
    useEmailRegistration({
      onSuccess: () => {
        toast.success(AUTH_MESSAGES.registration.success.EMAIL_SENT);
      },
    });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    submitEmail();
  };

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
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md px-4 sm:px-6">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">
            Create an account
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Start with your email — we’ll guide you next.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block w-full">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="you@company.com"
                className="mt-2"
              />
            </label>

            {error && (
              <div className="text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!email}
              isPending={loading}
              loadingIcon={<Loader className="animate-spin" />}
              loadingText="en cours..."
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
