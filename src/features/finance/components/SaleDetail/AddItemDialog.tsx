import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import type { AddSaleItemRequest } from "@/types";
import AddItemForm from "./AddItemForm";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: AddSaleItemRequest) => void;
  isPending: boolean;
}

export default function AddItemDialog({
  open,
  onOpenChange,
  onAdd,
  isPending,
}: AddItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة صنف للفاتورة</DialogTitle>
        </DialogHeader>

        <AddItemForm onAdd={onAdd} isPending={isPending} open={open} />
      </DialogContent>
    </Dialog>
  );
}
