"use client";
import { FiAlertTriangle } from "react-icons/fi";

import {
  Category,
  DashboardStats,
  Notification,
  SellerInfo,
  SellerStatus,
} from "../../types/dashboard.types";
import { Button } from "@/components/ui/button/Button";
import { PendingView } from "./PendingView";
import { RejectedView } from "./RejectedView";
import { ActivatedView } from "./ActivatedView";

/* ---------------------- Tableau de bord principal ---------------------- */
export function DashboardView({
  sellerInfo,
  categories,
  dashboardStats,
  notifications,
  navigateTo,
}: {
  sellerInfo: SellerInfo;
  categories: Category[];
  dashboardStats: DashboardStats;
  notifications: Notification[];
  navigateTo: (path: string) => void;
}) {
  const sellerStatus: SellerStatus =
    sellerInfo?.verificationStatus ?? "pending";

  // État de chargement
  if (!sellerInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 animate-pulse">
          Chargement de votre tableau de bord...
        </div>
      </div>
    );
  }

  switch (sellerStatus) {
    case "pending":
      return <PendingView sellerInfo={sellerInfo} />;
    case "rejected":
      return <RejectedView sellerInfo={sellerInfo} navigateTo={navigateTo} />;
    case "approved":
      return (
        <ActivatedView
          sellerInfo={sellerInfo}
          notifications={notifications}
          dashboardStats={dashboardStats}
          categories={categories}
          navigateTo={navigateTo}
        />
      );
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full px-4 py-20 text-center">
          <div className="p-4 mb-6 bg-gray-100 rounded-full">
            <FiAlertTriangle className="text-3xl text-gray-600" />
          </div>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            Statut du compte non reconnu
          </h2>
          <p className="max-w-md mb-6 text-gray-600">
            Nous ne parvenons pas à identifier le statut de votre compte. Merci
            de contacter notre support afin que nous puissions vous aider
            rapidement.
          </p>
          <Button onClick={() => navigateTo("/support")}>
            Contacter le support
          </Button>
        </div>
      );
  }
}
