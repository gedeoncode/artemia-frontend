"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/button/Button";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useRegistrationDetails } from "@/hooks/registration/useRegistrationDetails";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Footer, Navbar } from "@/components/auth";
import { AUTH_MESSAGES } from "@/constants";
import { toast } from "react-toastify";

export function DetailClientPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { checking, form, error, loading, handleChange, handleSubmit } =
    useRegistrationDetails({
      onSuccess: () => {
        toast.success(AUTH_MESSAGES.registration.success.PERSONAL_INFO_SAVED);
      },
    });
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
            Your Details
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Fill in your details to continue registration
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block w-full">
              <span className="text-sm font-medium text-gray-700">
                Full Name
              </span>
              <Input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-2"
              />
            </label>

            <label className="block w-full">
              <span className="text-sm font-medium text-gray-700">Phone</span>
              <Input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+254712345678"
                className="mt-2"
              />
            </label>
            <label className="relative block w-full">
              <span className="text-sm font-medium text-gray-700">
                Password
              </span>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="pr-10 mt-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 flex items-center pr-3 text-gray-400 inset-y-14 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </label>

            {error && (
              <div className="text-sm text-red-600" role="alert">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={!form.name || !form.password || !form.phone}
              className="w-full"
              isPending={loading}
              loadingText="en cours..."
              loadingIcon={<Loader className="animate-spin" />}
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
