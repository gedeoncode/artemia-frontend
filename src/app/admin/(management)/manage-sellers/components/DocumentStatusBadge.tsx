import { Badge } from "@/components/ui/Badge";
export function DocumentStatusBadge({ status }: { status: string }) {
  const statusMap = {
    pending: { label: "Pending", variant: "secondary" },
    approved: { label: "Approved", variant: "success" },
    rejected: { label: "Rejected", variant: "destructive" },
  };

  const currentStatus =
    statusMap[status as keyof typeof statusMap] || statusMap.pending;

  return <Badge variant={currentStatus.variant}>{currentStatus.label}</Badge>;
}