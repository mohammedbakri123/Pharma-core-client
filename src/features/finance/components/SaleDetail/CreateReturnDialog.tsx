import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { useCreateSaleReturn } from "../../hooks/useSalesReturns";

interface CreateReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleId: number;
}

export default function CreateReturnDialog({
  open,
  onOpenChange,
  saleId,
}: CreateReturnDialogProps) {
  const [note, setNote] = useState("");
  const createReturn = useCreateSaleReturn(saleId);
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إنشاء مرتجع للفاتورة</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            سيتم إنشاء مرتجع للفاتورة #{saleId}. يمكنك إضافة الأصناف المرتجعة
            لاحقًا.
          </p>
          <div className="space-y-2">
            <Label htmlFor="returnNote">ملاحظات (اختياري)</Label>
            <Input
              id="returnNote"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="سبب المرتجع"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() =>
              createReturn.mutate(
                { note: note || undefined },
                {
                  onSuccess: (response) => {
                    onOpenChange(false);
                    setNote("");
                    if (response?.data?.salesReturnId) {
                      navigate(
                        `/finance/sales/${saleId}/returns/${response.data.salesReturnId}`
                      );
                    }
                  },
                },
              )
            }
            disabled={createReturn.isPending}
          >
            {createReturn.isPending ? "جاري الإنشاء..." : "إنشاء المرتجع"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
