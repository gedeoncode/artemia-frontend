"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils/";
import { Category } from "../../services/types";

export function CategorySidebar({ category }: { category: Category }) {
  return (
    <aside className="space-y-6">
      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Stat
            label="Products"
            value={category.productCount?.toLocaleString() || "0"}
          />
          <Stat
            label="Subcategories"
            value={category.subcategories?.length?.toLocaleString() || "0"}
          />

          <div className="grid grid-cols-2 gap-4">
            <Stat
              label="Created"
              value={formatDate(category.createdAt)}
              compact
            />
            <Stat
              label="Updated"
              value={formatDate(category.updatedAt)}
              compact
            />
          </div>
        </CardContent>
      </Card>

      {/* Image */}
      {category.image && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden border rounded-lg aspect-square">
              <img
                src={category.image}
                alt={`Image of ${category.name}`}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      {category.metadata && Object.keys(category.metadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(category.metadata).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm capitalize text-muted-foreground">
                  {key}
                </p>
                <p className="font-medium break-all">
                  {typeof value === "string" ? value : JSON.stringify(value)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </aside>
  );
}

function Stat({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string | number;
  compact?: boolean;
}) {
  return (
    <div>
      <p className={`text-sm text-muted-foreground ${compact ? "mb-1" : ""}`}>
        {label}
      </p>
      <p className={`font-semibold ${compact ? "text-sm" : "text-2xl"}`}>
        {value}
      </p>
    </div>
  );
}
