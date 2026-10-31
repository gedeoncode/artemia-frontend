// CommissionBreakdown.tsx
import { CommissionModel } from "@/types/category/category.types";
import { AlertCircle, DollarSign, TrendingUp, Wallet } from "lucide-react";

interface CommissionBreakdownProps {
  price: number;
  commissionModel: CommissionModel;
  commissionRate: number;
  listingFee: number;
  sellerEarns: number;
  currencyUtils: {
    format: (amount: number) => string;
  };
}

export function CommissionBreakdown({
  price,
  commissionModel,
  commissionRate,
  listingFee,
  sellerEarns,
  currencyUtils,
}: CommissionBreakdownProps) {
  if (!price) {
    return (
      <div className="p-2 text-center border rounded-lg md:p-4 border-amber-200 bg-amber-50">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
        <p className="font-medium text-amber-700">
          Price required for commission calculation
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 md:space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Sale Price
            </span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {currencyUtils.format(price)}
          </div>
        </div>

        {/* <div className="p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Commission Rate
            </span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {commissionRate}%
          </div>
        </div> */}
      </div>

      {/* <div className="space-y-2">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Platform Fee</span>
          <span className="font-medium text-gray-700">
            {currencyUtils.format(listingFee)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-600">You Earn</span>
          <span className="text-lg font-bold text-green-600">
            {currencyUtils.format(sellerEarns)}
          </span>
        </div>
      </div> */}

      {/* <div
        className={`p-3 rounded-lg border-l-4 ${
          commissionModel === "PAP"
            ? "bg-blue-50 border-blue-400 text-blue-700"
            : "bg-green-50 border-green-400 text-green-700"
        }`}
      >
        <div className="flex items-start gap-2">
          <Wallet className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="text-sm">
            <strong>
              {commissionModel === "PAP"
                ? "Pay At Publishing"
                : "Pay After Listing"}
            </strong>
            <p className="mt-1 opacity-90">
              {commissionModel === "PAP"
                ? `${commissionModel} Commission of ${currencyUtils.format(listingFee)} will be charged upon publication.`
                : `${commissionModel}  No upfront cost. Commission will be deducted only upon successful sale.`}
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
