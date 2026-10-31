"use client";

import type { LeadStatus } from "@/types/lead.types";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-sky-100 text-sky-800",

  contacted: "bg-amber-100 text-amber-800",

  converted: "bg-emerald-100 text-emerald-800",

  closed: "bg-rose-100 text-rose-800",
};

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

export const LeadStatusBadge = ({
  status,
}: LeadStatusBadgeProps) => (
  <span
    className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
      statusColors[status] ??
      "bg-gray-200 text-gray-800"
    }`}
  >
    {status.replace("_", " ")}
  </span>
);