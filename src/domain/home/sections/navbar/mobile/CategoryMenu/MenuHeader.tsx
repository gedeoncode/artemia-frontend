import { ChevronLeft, X } from "lucide-react";
import { cx } from "@/lib/utils/classNames";

type Props = {
  title: string;
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  labels: {
    back: string;
    close: string;
  };
};

export function MenuHeader({
  title,
  canGoBack,
  onBack,
  onClose,
  closeRef,
  labels,
}: Props) {
  return (
    <div
      className={cx(
        "sticky top-0 z-10 flex items-center justify-between px-4 py-4",
        "bg-white border-b",
        "will-change-transform"
      )}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center min-w-0 gap-2">
        
        {/* Back button (animated, layout-stable) */}
        <div
          className={cx(
            "transition-all duration-200 ease-out",
            canGoBack
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 pointer-events-none"
          )}
        >
          <button
            type="button"
            onClick={onBack}
            aria-label={labels.back}
            className={cx(
              "inline-flex items-center justify-center w-10 h-10 rounded-full",
              "transition-all duration-200",
              "hover:bg-gray-100 active:bg-gray-200",
              "active:scale-95"
            )}
          >
            <ChevronLeft className="w-5 h-5 transition-transform duration-200 group-active:-translate-x-0.5" />
          </button>
        </div>

        {/* Title (animated between states) */}
        <div className="relative overflow-hidden">
          <h2
            key={title}
            id="mobile-menu-title"
            className={cx(
              "text-base font-semibold text-gray-900 truncate",
              "transition-all duration-300 ease-out",
              "animate-in fade-in slide-in-from-bottom-1"
            )}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* CLOSE BUTTON */}
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={labels.close}
        className={cx(
          "inline-flex items-center justify-center w-10 h-10 rounded-full",
          "transition-all duration-200",
          "hover:bg-gray-100 active:bg-gray-200",
          "active:scale-95"
        )}
      >
        <X className="w-5 h-5 transition-transform duration-200 active:rotate-90" />
      </button>
    </div>
  );
}