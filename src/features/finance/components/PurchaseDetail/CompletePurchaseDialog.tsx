import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Banknote, Calendar, FileText, ShoppingCart, Truck } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  useCompletePurchase,
  useGetPurchase,
} from "../../hooks/usePurchases";
import { useToast } from "@/hooks/use-toast";

interface CompletePurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseId: number;
}

export default function CompletePurchaseDialog({
  open,
  onOpenChange,
  purchaseId,
}: CompletePurchaseDialogProps) {
  const { toast } = useToast();
  const { data: purchase } = useGetPurchase(purchaseId);
  const { mutate: completePurchase, isPending } =
    useCompletePurchase(purchaseId);

  const handleSubmit = () => {
    completePurchase(undefined, {
      onSuccess: () => {
        onOpenChange(false);
        toast({
          title: "تم إتمام الفاتورة بنجاح",
          description: "تم إتمام فاتورة المشتريات بنجاح.",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "فشل إتمام الفاتورة",
          description: "حدث خطأ أثناء إتمام الفاتورة.",
          variant: "destructive",
        });
      },
    });
  };

  if (!purchase) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            إتمام فاتورة المشتريات
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {purchase.supplierName && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-4 h-4" />
                المورد
              </span>
              <span className="text-sm font-medium">
                {purchase.supplierName}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="w-4 h-4" />
              عدد الأصناف
            </span>
            <span className="text-sm font-medium">
              {purchase.items?.length ?? 0}
            </span>
          </div>

          {purchase.note && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                ملاحظة
              </span>
              <span className="text-sm font-medium">{purchase.note}</span>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              تاريخ الإنشاء
            </span>
            <span className="text-sm font-medium">
              {formatDate(purchase.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">الإجمالي</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(purchase.totalAmount)} ريال
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "جاري الإتمام..." : "إتمام الفاتورة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
