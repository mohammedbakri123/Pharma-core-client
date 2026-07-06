import { ConfirmDialog } from "@/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";

interface DeletePurchaseItemConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: number | null;
  onDelete: (
    itemId: number,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => void;
  isPending: boolean;
}

export default function DeletePurchaseItemConfirmDialog({
  open,
  onOpenChange,
  itemId,
  onDelete,
  isPending,
}: DeletePurchaseItemConfirmDialogProps) {
  const { toast } = useToast();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
      title="حذف الصنف"
      description="هل أنت متأكد من حذف هذا الصنف من الفاتورة؟"
      confirmLabel="حذف"
      cancelLabel="إلغاء"
      variant="destructive"
      onConfirm={() => {
        if (itemId) {
          onDelete(itemId, {
            onSuccess: () => {
              onOpenChange(false);
              toast({
                title: "تم حذف الصنف بنجاح",
                description: "تم حذف الصنف من الفاتورة بنجاح.",
                variant: "success",
              });
            },
            onError: () => {
              toast({
                title: "فشل حذف الصنف",
                description: "حدث خطأ أثناء حذف الصنف من الفاتورة.",
                variant: "destructive",
              });
            },
          });
        }
      }}
      isPending={isPending}
    />
  );
}
