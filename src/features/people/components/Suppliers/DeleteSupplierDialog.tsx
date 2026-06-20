import { SupplierDto } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { useDeleteSupplier } from "../../hooks/useSuppliers";

interface DeleteSupplierDialogProps {
  supplier: SupplierDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteSupplierDialog({
  supplier,
  open,
  onOpenChange,
}: DeleteSupplierDialogProps) {
  const { mutate: deleteSupplier, isPending } = useDeleteSupplier();

  const handleDelete = () => {
    if (!supplier) return;

    deleteSupplier(supplier.supplierId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف المورد</DialogTitle>

          <DialogDescription>
            هل أنت متأكد من حذف المورد {supplier?.name}؟
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "جارٍ الحذف..." : "حذف"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
