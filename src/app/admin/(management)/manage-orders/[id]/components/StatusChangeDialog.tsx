import { Icons } from "@/components/Icons";
import Button from "@/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

export function StatusChangeDialog({
  open,
  onOpenChange,
  nextStatus,
  onConfirm,
  updating,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
        </DialogHeader>
        <div className="text-sm">
          Are you sure you want to change the order status to{" "}
          <span className="font-semibold">{nextStatus}</span>?
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={updating}>
            {updating ? (
              <>
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
