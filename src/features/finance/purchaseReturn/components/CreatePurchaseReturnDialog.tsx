import { useState } from "react";
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
import { useCreatePurchaseReturn } from "../../common/hooks/usePurchaseReturns";
import { useToast } from "@/hooks/use-toast";

interface CreatePurchaseReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseId: number;
}

export default function CreatePurchaseReturnDialog({
  open,
  onOpenChange,
  purchaseId,
}: CreatePurchaseReturnDialogProps) {
  const [note, setNote] = useState("");
  const createReturn = useCreatePurchaseReturn(purchaseId);
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إنشاء مرتجع للفاتورة</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            سيتم إنشاء مرتجع للفاتورة #{purchaseId}. يمكنك إضافة الأصناف المرتجعة
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
                { note: note || undefined, items: [] },
                {
                  onSuccess: () => {
                    toast({
                      title: "تم إنشاء المرتجع",
                      description: "تم إنشاء المرتجع بنجاح.",
                    });
                    onOpenChange(false);
                    setNote("");
                  },
                  onError: () => {
                    toast({
                      title: "خطأ",
                      description: "حدث خطأ أثناء إنشاء المرتجع.",
                      variant: "destructive",
                    });
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
