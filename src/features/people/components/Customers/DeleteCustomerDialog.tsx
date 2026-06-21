import type { CustomerDto } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { useDeleteCustomer } from "../../hooks/useCustomers";

interface DeleteCustomerDialogProps {
  customer: CustomerDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteCustomerDialog({
  customer,
  open,
  onOpenChange,
}: DeleteCustomerDialogProps) {
  const { mutate: deleteCustomer, isPending } = useDeleteCustomer();

  const handleDelete = () => {
    if (!customer) return;

    deleteCustomer(customer.customerId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف العميل</DialogTitle>

          <DialogDescription>
            هل أنت متأكد من حذف العميل {customer?.name}؟
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
