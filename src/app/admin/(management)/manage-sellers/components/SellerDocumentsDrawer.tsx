import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchSellerDocuments } from "../services/manage.sellers.services";
import { SellerDocumentsResponse, Seller } from "../services/types";
import { Button } from "@/components/ui/button/Button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { DocumentStatusBadge } from "./DocumentStatusBadge";

interface SellerDocumentDrawerProps {
  open: boolean;
  onClose: () => void;
  seller: Seller | null;
  onStatusChange?: () => void;
}

export default function SellerDocumentDrawer({
  open,
  onClose,
  seller,
  onStatusChange,
}: SellerDocumentDrawerProps) {
  const [documents, setDocuments] = useState<SellerDocumentsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setCurrentDocIndex(0); // Reset on close
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Load documents when seller changes
  useEffect(() => {
    const loadSellerDocuments = async () => {
      if (!seller) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetchSellerDocuments(seller._id);
        if (response) {
          setDocuments(response.sellerDocuments);
        }
      } catch (err) {
        setError("Failed to load documents. Please try again.");
        console.error("Error loading documents:", err);
      } finally {
        setLoading(false);
      }
    };

    if (open && seller) {
      loadSellerDocuments();
    }
  }, [seller, open]);

  if (!open || !seller) return null;

  // Prepare document list for carousel
  const documentList = [
    { type: "Profile Photo", url: documents?.profilePhoto?.url },
    { type: "ID Front", url: documents?.idFront?.url },
    { type: "ID Back", url: documents?.idBack?.url },
    { type: "Business License", url: documents?.licenseUrl },
  ].filter((doc) => doc.url);

  const handleNextDoc = () => {
    setCurrentDocIndex((prev) => (prev + 1) % documentList.length);
  };

  const handlePrevDoc = () => {
    setCurrentDocIndex(
      (prev) => (prev - 1 + documentList.length) % documentList.length,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Overlay with fade-in animation */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer with slide-up animation */}
      <div
        className={`relative w-full max-h-[90vh] sm:max-w-2xl bg-white shadow-xl rounded-t-lg sm:rounded-lg transition-all duration-300 transform ${
          open ? "translate-y-0" : "translate-y-full sm:translate-y-8"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white/90 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {seller.name}'s Verification Documents
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={seller.isVerified ? "success" : "secondary"}>
                {seller.isVerified ? "Verified" : "Pending Verification"}
              </Badge>
              <DocumentStatusBadge status={seller.verificationStatus} />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-64 rounded-lg" />
              <Skeleton className="w-1/2 h-4 rounded" />
              <Skeleton className="w-3/4 h-4 rounded" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-red-600">
              <p className="mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : documentList.length > 0 ? (
            <div className="space-y-6">
              {/* Document Carousel */}
              <div className="relative">
                {documentList.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute z-10 -translate-y-1/2 left-2 top-1/2 bg-white/80 hover:bg-white"
                      onClick={handlePrevDoc}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute z-10 -translate-y-1/2 right-2 top-1/2 bg-white/80 hover:bg-white"
                      onClick={handleNextDoc}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}

                <div className="overflow-hidden rounded-lg bg-gray-50">
                  <Image
                    src={documentList[currentDocIndex].url}
                    alt={documentList[currentDocIndex].type}
                    width={800}
                    height={600}
                    className="object-contain w-full max-h-[60vh]"
                    quality={100}
                  />
                </div>

                <div className="mt-2 text-sm text-center text-gray-500">
                  {documentList[currentDocIndex].type}
                  {documentList.length > 1 && (
                    <span className="ml-2">
                      ({currentDocIndex + 1} of {documentList.length})
                    </span>
                  )}
                </div>
              </div>

              {/* Document Verification Actions */}
              {onStatusChange && (
                <div className="flex justify-center gap-4 pt-4 border-t">
                  <Button
                    variant="success"
                    onClick={() => {
                      // Handle approve logic
                      onStatusChange();
                      onClose();
                    }}
                  >
                    Approve Documents
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // Handle reject logic
                      onStatusChange();
                      onClose();
                    }}
                  >
                    Request Changes
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
              <p className="mb-2">No documents uploaded yet</p>
              <p className="text-sm">
                This seller hasn't submitted any verification documents.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Optional separate component for document status badge
