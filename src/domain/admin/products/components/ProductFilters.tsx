import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";

import {
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  FileEdit,
  Archive,
  CreditCard,
  AlertTriangle,
  PackageX,
} from "lucide-react";

interface ProductFiltersProps {
  publicationStatus: string;
  billingStatus: string;
  inventoryStatus: string;
  sort: string;

  onPublicationStatusChange: (value: string) => void;
  onBillingStatusChange: (value: string) => void;
  onInventoryStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;

  debouncedSearch: (value: string) => void;

  disabled?: boolean;
  className?: string;
}

const publicationStatuses = [
  {
    value: "all",
    label: "All Publications",
    icon: <Filter className="w-4 h-4" />,
  },

  {
    value: "approved",
    label: "Approved",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },

  {
    value: "pending",
    label: "Pending",
    icon: <Clock3 className="w-4 h-4" />,
  },

  {
    value: "draft",
    label: "Draft",
    icon: <FileEdit className="w-4 h-4" />,
  },

  {
    value: "archived",
    label: "Archived",
    icon: <Archive className="w-4 h-4" />,
  },
];

const billingStatuses = [
  { value: "all", label: "All Billing" },

  {
    value: "paid",
    label: "Paid",
  },

  {
    value: "unpaid",
    label: "Unpaid",
  },

  {
    value: "pending",
    label: "Pending",
  },

  {
    value: "failed",
    label: "Failed",
  },
];

const inventoryStatuses = [
  { value: "all", label: "All Inventory" },

  {
    value: "in_stock",
    label: "In Stock",
  },

  {
    value: "low_stock",
    label: "Low Stock",
  },

  {
    value: "out_of_stock",
    label: "Out of Stock",
  },

  {
    value: "preorder",
    label: "Preorder",
  },
];

const sortOptions = [
  {
    value: "newest",
    label: "Newest",
  },

  {
    value: "oldest",
    label: "Oldest",
  },

  {
    value: "price_asc",
    label: "Price: Low to High",
  },

  {
    value: "price_desc",
    label: "Price: High to Low",
  },

  {
    value: "name_asc",
    label: "Name: A-Z",
  },

  {
    value: "name_desc",
    label: "Name: Z-A",
  },
];

export function ProductFilters({
  publicationStatus,
  billingStatus,
  inventoryStatus,
  sort,

  onPublicationStatusChange,
  onBillingStatusChange,
  onInventoryStatusChange,
  onSortChange,

  debouncedSearch,

  disabled,
  className,
}: ProductFiltersProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* ===================================== */}
      {/* 🔹 Search */}
      {/* ===================================== */}

      <div className="relative">
        <Search className="absolute w-4 h-4 text-gray-400 left-3 top-3" />

        <Input
          type="text"
          placeholder="Search by product, category, seller..."
          className="pl-9"
          onChange={(e) => debouncedSearch(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* ===================================== */}
      {/* 🔹 Filters */}
      {/* ===================================== */}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {/* Publication Status */}

        <FilterSelect
          label="Publication"
          value={publicationStatus}
          options={publicationStatuses}
          onChange={onPublicationStatusChange}
          disabled={disabled}
        />

        {/* Billing */}

        <FilterSelect
          label="Billing"
          value={billingStatus}
          options={billingStatuses}
          onChange={onBillingStatusChange}
          disabled={disabled}
          icon={<CreditCard className="w-4 h-4" />}
        />

        {/* Inventory */}

        <FilterSelect
          label="Inventory"
          value={inventoryStatus}
          options={inventoryStatuses}
          onChange={onInventoryStatusChange}
          disabled={disabled}
          icon={<PackageX className="w-4 h-4" />}
        />

        {/* Sort */}

        <FilterSelect
          label="Sort"
          value={sort}
          options={sortOptions}
          onChange={onSortChange}
          disabled={disabled}
          icon={<AlertTriangle className="w-4 h-4" />}
        />
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;

  options: {
    value: string;
    label: string;
    icon?: React.ReactNode;
  }[];

  onChange: (value: string) => void;

  disabled?: boolean;

  icon?: React.ReactNode;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled,
  icon,
}: FilterSelectProps) {
  const activeOption = options.find((o) => o.value === value);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          {activeOption?.icon || icon}

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {label}:
            </span>

            <Badge
              variant="secondary"
              className="font-medium"
            >
              {activeOption?.label}
            </Badge>
          </div>
        </div>

        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
          >
            <div className="flex items-center gap-2">
              {option.icon}

              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}