import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/button/Button";
const ORDER_STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
export function ActionsCard({ status, onStatusChange, updating }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <h2 className="text-lg font-semibold">Order Actions</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Update Status
          </label>
          <Select
            value={status}
            onValueChange={onStatusChange}
            disabled={updating}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex-1 min-w-[150px]">
            Reassign Seller
          </Button>
          <Button variant="outline" className="flex-1 min-w-[150px]">
            Update Courier
          </Button>
          <Button variant="destructive" className="flex-1 min-w-[150px]">
            Process Refund
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
