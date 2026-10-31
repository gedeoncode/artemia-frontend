"use client";

import { X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/";

interface StickyFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export function StickyFooter({
  onCancel,
  onSubmit,
  isSubmitting,
  isValid,
}: StickyFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="container max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Keyboard shortcuts hint */}
          <div className="hidden sm:block">
            <p className="text-xs text-gray-400 space-x-3">
              <span className="mx-2">•</span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">
                  ⌘
                </kbd>
                <span className="mx-1">+</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">
                  ↵
                </kbd>
                <span className="ml-1">Publish</span>
              </span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              leftIcon={<X className="w-4 h-4 " />}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              onClick={onSubmit}
              disabled={isSubmitting || !isValid}
              className="min-w-[120px]"
              isPending={isSubmitting}
              loadingIcon={<Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              loadingText="Creating..."
              leftIcon={<Send className="w-4 h-4 " />}
            >
              <>Publish Category</>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
