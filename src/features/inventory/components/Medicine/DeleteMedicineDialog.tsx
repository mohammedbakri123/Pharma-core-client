import { MedicineDto } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { useDeleteMedicine } from "@features/inventory/hooks/useMedicine";

interface DeleteMedicineDialogProps {
  medicine: MedicineDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function DeleteMedicineDialog({
  medicine,
  open,
  onOpenChange,
}: DeleteMedicineDialogProps) {
  const { mutate: deleteMedicine, isPending } = useDeleteMedicine();

  const handleDelete = async () => {
    if (!medicine) return;

    deleteMedicine(medicine.medicineId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف الصنف</DialogTitle>

          <DialogDescription>
            هل أنت متأكد من حذف الصنف {medicine?.arabicName || medicine?.name}؟
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
