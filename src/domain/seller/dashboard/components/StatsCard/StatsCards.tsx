import { ReactNode } from "react";
import { cn } from "@/lib/utils/";

type StatsCardProps = {
  icon: ReactNode;
  title: string;
  value: string | number;
  isCurrency?: boolean;
  isStatus?: boolean;
  statusPositive?: boolean;
  colorVariant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "pending";
};

const gradientMap: Record<
  NonNullable<StatsCardProps["colorVariant"]>,
  string
> = {
  default: "from-gray-400 to-gray-600",
  primary: "from-blue-500 to-cyan-500",
  secondary: "from-purple-500 to-indigo-500",
  success: "from-green-500 to-emerald-500",
  warning: "from-yellow-400 to-amber-500",
  danger: "from-red-500 to-pink-500",
  pending: "from-gray-300 to-gray-500",
};

export const StatsCard = ({
  icon,
  title,
  value,
  isCurrency = false,
  isStatus = false,
  statusPositive = false,
  colorVariant = "default",
}: StatsCardProps) => {
  const displayValue = isCurrency
    ? `$${typeof value === "number" ? value.toLocaleString() : value}`
    : value;

  return (
    <div className="flex flex-col justify-between p-4 transition-all bg-white shadow-sm rounded-xl hover:shadow-md sm:p-5 group">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icon}</div>

        <div>
          <h2 className="text-sm font-medium text-gray-500 sm:text-base">
            {title}
          </h2>
          <p
            className={cn(
              "text-xl font-bold sm:text-2xl",
              isStatus
                ? statusPositive
                  ? "text-green-700"
                  : "text-red-600"
                : "text-gray-800"
            )}
          >
            {displayValue}
          </p>
        </div>
      </div>

      {/* Hover underline matching the badge variant */}
      <div
        className={cn(
          "w-0 h-1 mt-3 transition-all duration-300 group-hover:w-full",
          `bg-gradient-to-r ${gradientMap[colorVariant]}`
        )}
      />
    </div>
  );
};
