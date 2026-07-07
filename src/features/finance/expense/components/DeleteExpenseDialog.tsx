import { ExpenseDto } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { useDeleteExpense } from "../../common/hooks/useExpenses";

interface DeleteExpenseDialogProps {
  expense: ExpenseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function DeleteExpenseDialog({
  expense,
  open,
  onOpenChange,
}: DeleteExpenseDialogProps) {
  const { mutate: deleteExpense, isPending } = useDeleteExpense();

  const handleDelete = async () => {
    if (!expense) return;

    deleteExpense(expense.expenseId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف المصروف</DialogTitle>

          <DialogDescription>
            هل أنت متأكد من حذف المصروف بقيمة {expense?.amount} ريال؟
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
