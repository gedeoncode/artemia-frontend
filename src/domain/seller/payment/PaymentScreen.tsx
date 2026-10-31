"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPaymentSession } from "../dashboard/services/productServices";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "react-toastify";
import { formatCurrency } from "@/lib/utils/";
import type { PaymentSessionResponse } from "../products/types/product.types";
import { motion } from "framer-motion";
import { ROUTES } from "@/domain/seller/constants/routes";

/* ----------------------------- Config ---------------------------------- */

const AUTO_REFRESH_INTERVAL_MS = 3000; // base interval for pending checks
const BACKOFF_MULTIPLIER = 1.5; // exponential backoff multiplier
const MAX_AUTO_RETRIES = 10; // how many auto refresh attempts before stopping
const SUCCESS_REDIRECT_DELAY_MS = 3500; // optional: redirect after success (disabled here)

/* ------------------------- Status Configuration ------------------------ */

const PAYMENT_STATUS_CONFIG = {
  COMPLETED: {
    icon: CheckCircle2,
    color: "text-blue-600", // use app-blue family for enterprise look
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Completed",
    message:
      "Payment completed successfully — your listing will go live shortly.",
    badgeVariant: "success" as const,
  },
  FAILED: {
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Failed",
    message:
      "Payment failed. No charges were made. Try again or contact support.",
    badgeVariant: "destructive" as const,
  },
  PENDING: {
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Pending",
    message: "Payment is being processed. We'll update you automatically.",
    badgeVariant: "secondary" as const,
  },
  PROCESSING: {
    icon: Loader2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Processing",
    message: "Payment is being processed.",
    badgeVariant: "default" as const,
  },
} as const;

/* ------------------------- Helper Utilities ---------------------------- */

function normalizeStatus(status?: string | null) {
  if (!status) return "PENDING";
  return String(status).trim().toUpperCase();
}

function useDebouncedToast() {
  // Simple guard to avoid spamming duplicate toasts
  const lastMsgRef = useRef<string | null>(null);
  return (msg: string) => {
    if (lastMsgRef.current === msg) return;
    lastMsgRef.current = msg;
    toast.error(msg);
    setTimeout(() => {
      lastMsgRef.current = null;
    }, 4000);
  };
}

/* --------------------------- Small Subcomponents ----------------------- */

interface PaymentDetailRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}
const PaymentDetailRow: React.FC<PaymentDetailRowProps> = ({
  label,
  value,
  className = "",
}) => (
  <div className={`flex justify-between items-start py-3 ${className}`}>
    <span className="flex-shrink-0 mr-4 text-sm font-medium text-gray-600">
      {label}
    </span>
    <span className="flex-1 text-sm text-right text-gray-900 break-words">
      {value}
    </span>
  </div>
);

/* ------------------------------- Component ----------------------------- */

export default function PaymentScreen(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentSessionId = searchParams.get("paymentId");
  console.log("Payment id:", paymentSessionId);
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<PaymentSessionResponse | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const debouncedToast = useDebouncedToast();

  // compute normalized status and config
  const normalizedStatus = useMemo(
    () => normalizeStatus(session?.status || null),
    [session],
  );
  console.log("Normalized Status:", normalizedStatus);
  const statusConfig = useMemo(
    () =>
      PAYMENT_STATUS_CONFIG[
        (normalizedStatus as keyof typeof PAYMENT_STATUS_CONFIG) || "PENDING"
      ],
    [normalizedStatus],
  );
  const StatusIcon = statusConfig.icon;
  // localized date format helper
  const formatDate = useCallback((iso?: string) => {
    if (!iso) return "N/A";
    try {
      const locale =
        typeof navigator !== "undefined" ? navigator.language : "en-US";
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return new Date(iso).toLocaleString();
    }
  }, []);

  // fetch logic (single source of truth)
  const fetchSession = useCallback(
    async (isManual = false) => {
      if (!paymentSessionId) {
        setError("Missing payment session ID.");
        setLoading(false);
        return;
      }

      // when manually triggered show refreshing state
      if (isManual) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const { data, error: fetchError } =
          await getPaymentSession(paymentSessionId);

        if (fetchError) {
          throw new Error(
            fetchError.message || "Failed to fetch payment session",
          );
        }

        if (!data) {
          throw new Error("Invalid session response from server.");
        }

        // normalize status in the returned object to uppercase (non-mutating)
        const normalized = { ...data, status: normalizeStatus(data.status) };

        if (!mountedRef.current) return;

        setSession(normalized);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load payment details.";
        setError(message);
        debouncedToast(`Payment Error: ${message}`);
      } finally {
        if (!isManual) setLoading(false);
        setRefreshing(false);
      }
    },
    [paymentSessionId, debouncedToast],
  );

  // auto-refresh with exponential backoff while status is pending/processing
  useEffect(() => {
    mountedRef.current = true;
    if (!paymentSessionId) {
      setError("Missing payment session ID.");
      setLoading(false);
      return;
    }

    // initial load
    fetchSession();

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        window.clearTimeout(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentSessionId]);

  // watch session status and start/stop auto-refresh accordingly
  useEffect(() => {
    // Clear any scheduled refresh
    if (intervalRef.current) {
      window.clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }

    // Only auto-refresh when status is pending/processing
    if (normalizedStatus === "PENDING" || normalizedStatus === "PROCESSING") {
      if (attempts >= MAX_AUTO_RETRIES) {
        // we've exhausted auto attempts — stop auto-refresh and let the user manually refresh
        return;
      }

      const nextInterval = Math.round(
        AUTO_REFRESH_INTERVAL_MS *
          Math.pow(BACKOFF_MULTIPLIER, Math.max(0, attempts - 0)),
      );

      intervalRef.current = window.setTimeout(async () => {
        if (!mountedRef.current) return;
        setAttempts((a) => a + 1);
        setRefreshing(true);
        await fetchSession();
        setRefreshing(false);
      }, nextInterval);
    }

    return () => {
      if (intervalRef.current) {
        window.clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [normalizedStatus, attempts, fetchSession]);

  // user actions
  const handleManualRefresh = async () => {
    setAttempts(0); // reset attempts when user manually retries
    await fetchSession(true);
  };

  const handleBackToDashboard = () => {
    // router.push(returnUrl);
    router.push(ROUTES.DASHBOARD);
  };

  // UX states: loading, error without session, no session, main UI
  if (loading && !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-white">
        <Card className="w-full max-w-md border shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="w-56 h-4" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-2/3 h-4" />
            </div>
            <Skeleton className="w-full h-10 rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-white">
        <Card className="w-full max-w-md border shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-6 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Unable to load payment
                </h3>
                <p className="mt-1 text-sm text-gray-600">{error}</p>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                onClick={handleManualRefresh}
                className="flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    // session not found (but no error) — maybe expired
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-white">
        <Card className="w-full max-w-md border shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-6 text-center">
            <div className="flex flex-col items-center space-y-3">
              <AlertCircle className="w-12 h-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Session not found
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  The payment session could not be found or may have expired.
                </p>
              </div>
            </div>
            <Button
              onClick={handleBackToDashboard}
              className="flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // main render (session exists)
  const formattedAmount = formatCurrency(session.amount, session.currency);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-white">
      <Card className="w-full max-w-md overflow-hidden border-0 shadow-xl rounded-2xl">
        {/* Header: status + security */}
        <CardHeader
          className={`pb-4 ${statusConfig.bgColor} ${statusConfig.borderColor} border-b`}
        >
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                aria-hidden
              >
                <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
              </motion.div>
            </div>

            <CardTitle className="text-2xl font-bold text-gray-900">
              Payment Details
            </CardTitle>

            <div className="flex items-center gap-2">
              <Badge
                variant={statusConfig.badgeVariant}
                className="text-sm font-medium"
              >
                {statusConfig.label}
              </Badge>

              {/* Security trust badge near status for visible trust */}
              <div className="flex items-center gap-1 ml-2 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                <span>Secure & encrypted</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Payment Information */}
          <div className="space-y-1">
            <PaymentDetailRow
              label="Product"
              value={session.productId?.name || "N/A"}
            />
            <PaymentDetailRow
              label="Amount"
              value={
                <span className="text-lg font-semibold">{formattedAmount}</span>
              }
            />
            <PaymentDetailRow
              label="Seller"
              value={session.userId?.name || session.userId?._id || "N/A"}
            />
            <PaymentDetailRow
              label="Payment ID"
              value={
                <code className="px-2 py-1 text-xs break-all bg-gray-100 rounded">
                  {session.providerpaymentSessionId ||
                    session.providerSessionId ||
                    "N/A"}
                </code>
              }
            />
            <PaymentDetailRow
              label="Created"
              value={formatDate(session.createdAt)}
            />
          </div>

          {/* Action Section */}
          <div className="space-y-4">
            {/* If the provider session URL is present and session is pending — show a full-width link styled as button */}
            {(normalizedStatus === "PENDING" ||
              normalizedStatus === "PROCESSING") &&
              session.providerSessionURL && (
                <a
                  href={session.providerSessionURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-base font-medium text-white no-underline bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Continue to payment provider"
                >
                  <span>Continue to Payment</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

            {/* When success or failed, primary CTA is back to dashboard (or listings) */}
            {(normalizedStatus === "COMPLETED" ||
              normalizedStatus === "FAILED") && (
              <Button
                onClick={handleBackToDashboard}
                className="flex items-center justify-center w-full py-3 space-x-2 text-base font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            )}

            {/* Pending controls */}
            {(normalizedStatus === "PENDING" ||
              normalizedStatus === "PROCESSING") && (
              <div className="flex items-center justify-between text-sm">
                <Button
                  variant="outline"
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  <span>{refreshing ? "Checking..." : "Refresh Status"}</span>
                </Button>

                {/* show auto-refresh state and attempts */}
                <span className="text-xs text-gray-500">
                  {attempts < MAX_AUTO_RETRIES
                    ? `Auto-refreshing (${attempts}/${MAX_AUTO_RETRIES})`
                    : "Auto-refresh paused — try manual refresh"}
                </span>
              </div>
            )}
          </div>

          {/* Status message (aria-live for dynamic updates) */}
          <div
            aria-live="polite"
            className={`p-4 rounded-lg text-center ${statusConfig.bgColor}`}
          >
            <p className={`text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.message}
            </p>
            {normalizedStatus === "FAILED" && (
              <p className="mt-2 text-xs text-gray-600">
                If the problem persists, contact support with your Payment ID.
              </p>
            )}
          </div>

          {/* Small footer with session id and support */}
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="text-xs text-gray-500">
              Session ID:{" "}
              <span className="font-mono">{session.providerSessionId}</span>
            </p>
            <p className="text-xs text-gray-400">
              Need help? Contact our support team
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
