"use client";

import { memo } from "react";

interface SpecificationsTabProps {
  specifications?: Record<string, unknown>;
}

export const SpecificationsTab = memo(
  function SpecificationsTab({ specifications }: SpecificationsTabProps) {
    const entries = Object.entries(specifications ?? {});

    if (entries.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No specifications available</p>
          <p className="text-sm text-gray-400 mt-1">
            This product doesn't have any technical details listed.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Technical Specifications</h2>
          <p className="text-sm text-gray-500 mt-1">
            Detailed product specifications and features
          </p>
        </div>

        <div className="overflow-hidden bg-white rounded-lg border border-gray-200">
          <dl className="divide-y divide-gray-100">
            {entries.map(([key, value], index) => (
              <div
                key={key}
                className={`
                  px-4 py-4
                  grid grid-cols-1
                  md:grid-cols-4
                  gap-2 md:gap-6
                  transition-colors
                  ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}
                  hover:bg-gray-50
                `}
              >
                <dt className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="inline-flex items-center">
                    {getIconForLabel(key)}
                    <span className="ml-2 capitalize">{formatLabel(key)}</span>
                  </span>
                </dt>

                <dd className="md:col-span-3 text-sm text-gray-900 break-words flex items-center">
                  <span className="bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
                    {formatValue(value)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    );
  }
);

function formatLabel(label: string) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim()
    .replace(/^./, (str) => str.toUpperCase());
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return <span className="text-gray-400">Not specified</span>;
  }

  if (typeof value === "boolean") {
    return (
      <span className={value ? "text-green-600" : "text-red-500"}>
        {value ? "✓ Yes" : "✗ No"}
      </span>
    );
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "None";
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
          >
            {String(item)}
          </span>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    return <span className="font-mono text-xs">{JSON.stringify(value)}</span>;
  }

  return String(value);
}

function getIconForLabel(label: string) {
  const icons: Record<string, string> = {
    weight: "⚖️",
    dimensions: "📐",
    color: "🎨",
    material: "🧱",
    brand: "🏷️",
    model: "🔢",
    warranty: "🛡️",
    power: "⚡",
    voltage: "🔌",
    capacity: "📦",
    size: "📏",
    origin: "🌍",
  };

  const key = label.toLowerCase();
  for (const [pattern, icon] of Object.entries(icons)) {
    if (key.includes(pattern)) return icon;
  }
  return "•";
}