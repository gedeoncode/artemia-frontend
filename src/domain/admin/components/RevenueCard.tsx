// RevenueCard component
export function RevenueCard({
  title,
  value,
  description,
  isPrimary = false,
}: {
  title: string;
  value: number;
  description: string;
  isPrimary?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-lg border ${isPrimary ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-white"}`}
    >
      <h3 className={`text-xs font-medium ${isPrimary ? "text-blue-700" : "text-gray-500"}`}>
        {title}
      </h3>
      <p className={`mt-1 text-lg font-bold ${isPrimary ? "text-blue-900" : "text-gray-900"}`}>
        ${value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}