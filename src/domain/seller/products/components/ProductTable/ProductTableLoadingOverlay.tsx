import LoadingSpinner from "@/components/ui/LoadingSpinner";

export function ProductTableLoadingOverlay() {
  return (
    <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[1px]">
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    </div>
  );
}