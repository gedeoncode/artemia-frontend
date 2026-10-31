import { ReactNode } from "react";

export function PageSectionSkeleton({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen px-4 py-6 space-y-6  bg-gradient-to-br from-white via-gray-50 to-blue-50 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
