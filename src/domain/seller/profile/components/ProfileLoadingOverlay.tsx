import { LoadingDots } from "@/components/ui/LoadingSpinner";

interface ProfileLoadingOverlayProps {
  label: string;
}

export function ProfileLoadingOverlay({ label }: ProfileLoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
      <LoadingDots size="lg" label={label} />
    </div>
  );
}
