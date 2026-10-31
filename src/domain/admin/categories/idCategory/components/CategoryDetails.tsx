"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Category } from "../../services/types";

export function CategoryDetails({ category }: { category: Category }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Category Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Name + Slug */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Detail label="Name" value={category.name} />
          <Detail label="Slug" value={category.slug} />
        </div>
        {/* Type + Status */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <BadgeDetail label="Type" value={category.type} variant="outline" />
          <BadgeDetail
            label="Status"
            value={category.status}
            variant={
              category.status === "active"
                ? "success"
                : category.status === "archived"
                  ? "secondary"
                  : "destructive"
            }
          />
        </div>

        {/* Level + Parent */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Detail label="Level" value={category.level} />
          <div>
            <Label text="Parent Category" />
            {category.parent ? (
              <Link
                href={`/admin/categories/${category.parent._id}`}
                className="font-medium text-primary hover:underline"
              >
                {category.parent.name}
              </Link>
            ) : (
              <p className="text-muted-foreground">None (Root Category)</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <Label text="Description" />
          <p className="font-medium whitespace-pre-line">
            {category.description || "No description provided"}
          </p>
        </div>

        {/* Featured + Payment */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <BadgeDetail
            label="Featured"
            value={category.isFeatured ? "Yes" : "No"}
            variant={category.isFeatured ? "default" : "outline"}
          />
          <BadgeDetail
            label="Requires Payment"
            value={category.requiresPayment ? "Yes" : "No"}
            variant={category.requiresPayment ? "default" : "outline"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Label({ text }: { text: string }) {
  return <p className="mb-1 text-sm text-muted-foreground">{text}</p>;
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <Label text={label} />
      <p className="font-medium break-words">{value}</p>
    </div>
  );
}

function BadgeDetail({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant?: "default" | "outline" | "success" | "secondary" | "danger";
}) {
  return (
    <div>
      <Label text={label} />
      <Badge variant={variant || "outline"} className="capitalize">
        {value}
      </Badge>
    </div>
  );
}
