"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/";
import { CommissionModel } from "@/types/seller";

interface CommissionBreakdownProps {
  price: number;
  commissionRate: number;
  commissionModel: CommissionModel;
  sellerEarns?: number;
  listingFee?: number;
  currencyUtils: {
    format: (value: number) => string;
    getSymbol: () => string;
  };
  className?: string;
}

/**
 * CommissionBreakdown
 * ------------------
 * Displays:
 * - Base price
 * - Commission amount
 * - Seller earnings
 * - Optional warning if using PAP model
 */
export const CommissionBreakdown = ({
  price,
  commissionRate,
  commissionModel,
  sellerEarns,
  listingFee,
  currencyUtils,
  className = "",
}: CommissionBreakdownProps) => {

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.25 }}
      className={cn("grid grid-cols-1 gap-3 text-sm", className)}
    >
      <div className="flex items-center justify-between py-1 border-b border-gray-100">
        <span className="text-gray-600">Prix de vente</span>
        <span className="font-semibold">{currencyUtils.format(price)}</span>
      </div>

      <div className="flex items-center justify-between py-1 border-b border-gray-100">
        <span className="text-gray-600">Commission ({commissionRate}%)</span>
        <span className="font-medium text-red-600">
          -{currencyUtils.format(listingFee ?? 0)}
        </span>
      </div>

      <div className="flex items-center justify-between px-3 py-1 rounded-lg bg-green-50">
        <span className="font-medium text-green-800">Vous recevrez</span>
        <span className="font-bold text-green-800">
          {currencyUtils.format(sellerEarns ?? 0)}
        </span>
      </div>
      {commissionModel === "PAP" && (
        <div className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-amber-600 bg-amber-50">
          <AlertCircle className="w-3 h-3" />
          <span>Frais déduits immédiatement lors de la publication</span>
        </div>
      )}
    </motion.div>
  );
};
