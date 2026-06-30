import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import type { AddSaleItemRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";
import AddItemForm from "./AddItemForm";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (
    data: AddSaleItemRequest,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => void;
  isPending: boolean;
}

export default function AddItemDialog({
  open,
  onOpenChange,
  onAdd,
  isPending,
}: AddItemDialogProps) {
  const { toast } = useToast();

  const handleAdd = (data: AddSaleItemRequest) => {
    onAdd(data, {
      onSuccess: () => {
        onOpenChange(false);
        toast({
          title: "تمت إضافة الصنف بنجاح",
          description: "تمت إضافة الصنف إلى الفاتورة بنجاح.",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "فشل إضافة الصنف",
          description: "حدث خطأ أثناء إضافة الصنف إلى الفاتورة.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة صنف للفاتورة</DialogTitle>
        </DialogHeader>

        <AddItemForm onAdd={handleAdd} isPending={isPending} open={open} />
      </DialogContent>
    </Dialog>
  );
}
