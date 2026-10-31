// /types/actionConfig.constants.ts

import { SellerAction } from "../types/SellerAction.types";
import { Icons } from "@/components/Icons";

export const ACTION_CONFIGS: Record<
  SellerAction,
  {
    icon: any;
    label: string;
    variant:
      | "primary"
      | "danger"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    className: string;
  }
> = {
  approve: {
    icon: Icons.shieldCheck,
    label: "Approve",
    variant: "primary",
    className: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },

  reject: {
    icon: Icons.xCircle,
    label: "Reject",
    variant: "destructive",
    className: "",
  },

  block: {
    icon: Icons.ban,
    label: "Block",
    variant: "outline",
    className:
      "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700",
  },

  unblock: {
    icon: Icons.refresh,
    label: "Unblock",
    variant: "outline",
    className:
      "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
  },
};

export const STATUS_CONFIGS = {
  blocked: {
    label: "Blocked",
    icon: Icons.ban,
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400",
    description: "Seller has been blocked from the platform",
  },

  approved: {
    label: "Active",
    icon: Icons.checkCircle,
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
    description: "Seller is approved and active",
  },

  rejected: {
    label: "Rejected",
    icon: Icons.xCircle,
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400",
    description: "Seller application was rejected",
  },

  pending: {
    label: "Pending",
    icon: Icons.clock,
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400",
    description: "Seller application pending review",
  },
};

export const CONFIRM_DIALOG_CONTENT = {
  reject: {
    title: "Confirm rejection",
    description:
      "Are you sure you want to reject this seller? This action can be reversed by approving them later.",
  },

  block: {
    title: "Confirm block",
    description:
      "Are you sure you want to block this seller? They will no longer be able to access the platform.",
  },

  unblock: {
    title: "Confirm unblock",
    description:
      "Are you sure you want to unblock this seller? They will regain access to the platform.",
  },
};